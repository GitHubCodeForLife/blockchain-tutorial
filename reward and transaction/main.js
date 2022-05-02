const SHA256 = require("crypto-js/sha256");
class Block {
  //Datas: index, previousHash, timestamp, transactions, hash, nonce
  //Actions: constructor, calculateHash, mineBlock, hashMatchesDifficulty
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
}

class BlockChain {
  //Datas: chain, difficulty, pendingTransactions, miningReward
  //Actions: createTransaction, getBalanceOfAddress, isChainValid, minePendingTransactions, createGenesisBlock
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

  createTransaction(transaction) {
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
  //Datas: amount, sender, recipient
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

let TranBlock = new BlockChain();
TranBlock.createTransaction(new Transaction("address1", "address2", 100));
TranBlock.createTransaction(new Transaction("address2", "address1", 50));

console.log("\n Starting the miner");
TranBlock.minePendingTransactions("address3");

console.log(
  "\nBalance of address3 is ",
  TranBlock.getBalanceOfAddress("address3")
);

console.log("\n Starting the miner again");
TranBlock.minePendingTransactions("address3");

console.log(
  "\nBalance of address3 is ",
  TranBlock.getBalanceOfAddress("address3")
);

// console.log(JSON.stringify(TranBlock, null, 4));
// console.log("is Block Chain Valid: " + TranBlock.isChainValid());
