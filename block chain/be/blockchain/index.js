const Block = require("./block");
const { takeTransactions, cleanData, formatBlock } = require("../app/utitls");
class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }
  /**
   * utility function to add block to the blockchain
   * returns the added block
   */

  addBlock(data) {
    const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
    this.chain.push(block);

    return block;
  }

  /**
   * checks if the chain recieved from another miner is valid or not
   */

  isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];
      if (
        block.lastHash !== lastBlock.hash ||
        block.hash !== Block.blockHash(block)
      )
        return false;
    }

    return true;
  }

  /**
   * replace the chain if the chain recieved from another miner
   * is longer and valid
   */

  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      console.log("Recieved chain is not longer than the current chain");
      return;
    } else if (!this.isValidChain(newChain)) {
      console.log("Recieved chain is invalid");
      return;
    }

    console.log("Replacing the current chain with new chain");
    this.chain = newChain;
  }

  //==========================================================
  getAllTransactions() {
    let result = [];
    const chainsCopy = [...this.chain];
    for (let i = 0; i < chainsCopy.length; i++) {
      for (let j = 0; j < chainsCopy[i].data.length; j++) {
        let transaction = chainsCopy[i].data[j];
        let temps = takeTransactions(transaction);
        result = [...result, ...temps];
      }
    }
    result = cleanData(result, "success");
    return result;
  }

  getTransaction(id) {
    for (let i = 0; i < this.chain.length; i++) {
      const block = this.chain[i];
      for (let j = 0; j < block.data.length; j++) {
        const transaction = block.data[j];
        if (transaction.id === id) {
          transaction.state = "success";
          return transaction;
        }
      }
    }
    return null;
  }
  getHistoryTransactions(address) {
    let result = [];
    const chainsCopy = [...this.chain];
    for (let i = 0; i < chainsCopy.length; i++) {
      for (let j = 0; j < chainsCopy[i].data.length; j++) {
        const transaction = chainsCopy[i].data[j];
        if (transaction.input.address === address) {
          const temps = takeTransactions(transaction);
          result = [...result, ...temps];
        } else if (
          transaction.outputs.find((output) => output.address === address)
        ) {
          const temps = takeTransactions(transaction);
          result = [...result, ...temps];
        }
      }
    }
    result = cleanData(result, "success");
    return result;
  }
  getAllBlocks() {
    let blocks = [];
    const chainsCopy = [...this.chain];

    for (let i = chainsCopy.length - 1; i >= 0; i--) {
      blocks = [...blocks, chainsCopy[i]];
    }

    blocks = blocks.map((block) => formatBlock(block));

    return blocks;
  }

  getBlock(hash) {
    for (let i = 0; i < this.chain.length; i++) {
      const block = this.chain[i];
      if (block.hash === hash) {
        return formatBlock(block, true);
      }
    }
    return null;
  }
}

module.exports = Blockchain;
