const Block = require("./block");
const {
  formatTransactions,
  formatSuccessTransactions,
  formatString,
} = require("../app/utitls");
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
  getAllTransactions() {
    let transactions = [];
    for (let i = 1; i < this.chain.length; i++) {
      const block = this.chain[i];
      for (let j = 0; j < block.data.length; j++) {
        const currentTransaction = block.data[j];
        formatSuccessTransactions(currentTransaction, transactions);
      }
    }

    return transactions;
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
  getAllChains() {
    let chains = [...this.chain];
    chains = chains.map((chain) => {
      chain.timestamp = new Date(chain.timestamp).toLocaleString();
      chain.miner =
        chain.data.length > 1 ? chain.data[1].outputs[0].address : "";
      chain.miner = formatString(chain.miner);
      return chain;
    });
    return chains;
  }

  getBlock(hash) {
    for (let i = 0; i < this.chain.length; i++) {
      const block = this.chain[i];
      if (block.hash === hash) {
        return block;
      }
    }
    return null;
  }
}

module.exports = Blockchain;
