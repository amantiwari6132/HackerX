const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Simplified blockchain implementation
class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce)
      .digest('hex');
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined: " + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 10;
  }

  createGenesisBlock() {
    return new Block(0, Date.now(), "Genesis block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    const rewardTx = {
      fromAddress: null,
      toAddress: miningRewardAddress,
      amount: this.miningReward
    };
    this.pendingTransactions.push(rewardTx);

    let block = new Block(this.chain.length, Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);

    console.log('Block successfully mined!');
    this.chain.push(block);

    this.pendingTransactions = [];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.data) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }
}

// Initialize blockchain
const myBlockchain = new Blockchain();

let reports = [];
let users = {};

app.get('/api/reports', (req, res) => {
  res.json(reports);
});

app.post('/api/reports', (req, res) => {
  const newReport = {
    id: reports.length + 1,
    ...req.body,
    timestamp: new Date().toISOString()
  };
  reports.push(newReport);

  // Reward user for submitting report
  if (!users[newReport.name]) {
    users[newReport.name] = newReport.name;
  }
  myBlockchain.createTransaction({fromAddress: null, toAddress: users[newReport.name], amount: 1});
  myBlockchain.minePendingTransactions(users[newReport.name]);

  res.status(201).json(newReport);
});

app.get('/api/balance/:name', (req, res) => {
  const name = req.params.name;
  if (users[name]) {
    const balance = myBlockchain.getBalanceOfAddress(users[name]);
    res.json({balance});
  } else {
    res.status(404).json({error: 'User not found'});
  }
});

app.listen(port, () => {
  console.log(Backend server running on http://localhost:${port});
});