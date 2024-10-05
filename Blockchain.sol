// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

contract CupcakeToken {
    // Mapping of cupcake balances
    mapping (address => uint256) public cupcakeBalances;

    // ...
}

contract WasteManagement {
    // Mapping of waste types to their respective quantities
    mapping (string => uint256) public wasteTypes;

    // Mapping of users to their respective waste quantities
    mapping (address => uint256) public userWaste;

    // Function to add waste type
    function addWasteType(string memory _wasteType, uint256 _quantity) public {
        wasteTypes[_wasteType] = _quantity;
    }

    // Function to add waste for a user
    function addWasteForUser(address _user, uint256 _quantity) public {
        userWaste[_user] += _quantity;
    }

    // Function to get waste quantity for a user
    function getWasteQuantityForUser(address _user) public view returns (uint256) {
        return userWaste[_user];
    }

    // Function to get waste quantity for a waste type
    function getWasteQuantityForType(string memory _wasteType) public view returns (uint256) {
        return wasteTypes[_wasteType];
    }
}