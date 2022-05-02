const SHA256 = require("crypto-js/sha256");
class Block {
  //Datas: index, previousHash, timestamp, data, hash, nonce
  //Actions: constructor, calculateHash, mineBlock, hashMatchesDifficulty
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }
  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data).toString() +
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
  //  Datas: chain, difficulty
  //  Actions: constructor, createGenesisBlock, getLastestBlock, addBlock, isChainValid
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }
  createGenesisBlock() {
    return new Block(0, "01/01/2018", "Genesis Block", "0");
  }
  getLastestBlock() {
    return this.chain[this.chain.length - 1];
  }
  addBlock(newBlock) {
    newBlock.previousHash = this.getLastestBlock().hash;
    // newBlock.hash = newBlock.calculateHash();
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
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

let TranBlock = new BlockChain();
console.log("Mining block 1...");
TranBlock.addBlock(new Block(1, "01/01/2018", { amount: 4 }));
console.log("Mining block 2...");
TranBlock.addBlock(new Block(2, "01/01/2018", { amount: 10 }));

// console.log(JSON.stringify(TranBlock, null, 4));
// console.log("is Block Chain Valid: " + TranBlock.isChainValid());
