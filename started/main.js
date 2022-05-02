const SHA256 = require("crypto-js/sha256");
class Block {
  // Datas: index, previousHash, timestamp, data, hash
  // Actions: constructor, calculateHash
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
}

class BlockChain {
  // Datas: chain
  // Actions: constructor, isChainValid, addBlock, createGenesisBlock
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }
  createGenesisBlock() {
    return new Block(0, "01/01/2018", "Genesis Block", "0");
  }
  getLastestBlock() {
    return this.chain[this.chain.length - 1];
  }
  addBlock(newBlock) {
    newBlock.previousHash = this.getLastestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }
  generateNextBlock(blockData) {
    const previousBlock = this.getLastestBlock();
    const nextIndex = previousBlock.index + 1;
    const nextTimestamp = new Date().getTime() / 1000;
    const nextBlock = new Block(
      nextIndex,
      nextTimestamp,
      blockData,
      previousBlock.hash
    );
    this.addBlock(nextBlock);
  }
}

let TranBlock = new BlockChain();
TranBlock.addBlock(new Block(1, "01/01/2018", { amount: 4 }));
TranBlock.addBlock(new Block(2, "01/01/2018", { amount: 10 }));

console.log(JSON.stringify(TranBlock, null, 4));
