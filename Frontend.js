import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Trash2, Recycle, Package } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

const wasteTypes = [
  { value: 'plastic', label: 'Plastic', icon: Package },
  { value: 'paper', label: 'Paper', icon: Recycle },
  { value: 'organic', label: 'Organic', icon: Trash2 },
];

export default function App() {
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState({
    name: '',
    address: '',
    location: '',
    wasteType: '',
    quantity: '',
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const response = await fetch(${API_URL}/reports);
    const data = await response.json();
    setReports(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(${API_URL}/reports, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReport),
    });
    if (response.ok) {
      setNewReport({ name: '', address: '', location: '', wasteType: '', quantity: '' });
      fetchReports();
    }
  };

  const handleChange = (e) => {
    setNewReport({ ...newReport, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value) => {
    setNewReport({ ...newReport, wasteType: value });
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-green-600">EcoTrack: Decentralized Waste Management</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Submit New Waste Report</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              value={newReport.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full"
            />
            <Input
              name="address"
              value={newReport.address}
              onChange={handleChange}
              placeholder="Your Address"
              className="w-full"
            />
            <Input
              name="location"
              value={newReport.location}
              onChange={handleChange}
              placeholder="Waste Location"
              className="w-full"
            />
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Waste Type" />
              </SelectTrigger>
              <SelectContent>
                {wasteTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center">
                      {React.createElement(type.icon, { className: "mr-2" })}
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              name="quantity"
              value={newReport.quantity}
              onChange={handleChange}
              placeholder="Quantity (kg)"
              className="w-full"
            />
            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">Submit Report</Button>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Recent Waste Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => {
          const WasteIcon = wasteTypes.find(t => t.value === report.wasteType)?.icon || Package;
          return (
            <Card key={report.id} className="overflow-hidden">
              <CardHeader className="bg-green-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{report.location}</h3>
                  <WasteIcon className="text-green-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p><strong>Name:</strong> {report.name}</p>
                <p><strong>Address:</strong> {report.address}</p>
                <p><strong>Waste Type:</strong> {report.wasteType}</p>
                <p><strong>Quantity:</strong> {report.quantity} kg</p>
              </CardContent>
              <CardFooter className="text-sm text-gray-500">
                Reported on: {new Date(report.timestamp).toLocaleString()}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}