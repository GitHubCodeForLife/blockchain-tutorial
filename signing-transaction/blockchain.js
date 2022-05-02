const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

class Block {
  // Data: timestamp, transactions, previousHash, nonce, hash
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }
  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions).toString() +
        this.nonce
    ).toString();
  }
  mineBlock(difficulty) {
    while (this.hashMatchesDifficulty(difficulty)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined: " + this.hash);
  }

  hashMatchesDifficulty(difficulty) {
    return (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    );
  }
  hasValidTransaction() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }
    return true;
  }
}

class BlockChain {
  // Data: chain, difficulty, pendingTransactions, miningReward
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }
  createGenesisBlock() {
    return new Block("01/01/2018", "Genesis Block", "0");
  }

  getLastestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(rewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log("Block successfully mined!");
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, rewardAddress, this.miningReward),
    ];
  }

  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw Error("Transaction must include from and to address");
    }

    if (!transaction.isValid()) {
      throw Error("Cannot add invalid transaction to chain");
    }

    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
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

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hasValidTransaction()) {
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

class Transaction {
  //Data: from address, to address, amount, signature
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  calculateHash() {
    return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
  }

  signTransaction(signingkey) {
    if (signingkey.getPublic("hex") !== this.fromAddress) {
      throw new Error("You cannot sign transactions for other wallets");
    }
    const hashTx = this.calculateHash();
    const sig = signingkey.sign(hashTx, "base64");
    this.signature = sig.toDER("hex");
  }
  isValid() {
    if (this.fromAddress === null) return true;
    if (!this.signature || this.signature.length === 0) return false;
    const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

module.exports = { Block, BlockChain, Transaction };
