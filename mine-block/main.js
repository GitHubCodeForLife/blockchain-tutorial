const SHA256 = require("crypto-js/sha256");
class Block {
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
TranBlock.addBlock(new Block(1, "01/01/2018", { amount: 4 }));
TranBlock.addBlock(new Block(2, "01/01/2018", { amount: 10 }));

TranBlock.chain[1].data = { amount: 100 };

TranBlock.chain[1].hash = TranBlock.chain[1].calculateHash();
TranBlock.chain[2].previousHash = TranBlock.chain[1].hash;
TranBlock.chain[2].hash = TranBlock.chain[2].calculateHash();
console.log(JSON.stringify(TranBlock, null, 4));
console.log("is Block Chain Valid: " + TranBlock.isChainValid());
