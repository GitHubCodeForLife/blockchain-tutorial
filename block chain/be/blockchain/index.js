const Block = require("./block");
const {
  takeTransactions,
  cleanData,
  formatBlock,
  takeTransactionReward,
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

  //==========================================================
  getAllTransactions() {
    let result = [];
    const chainsCopy = JSON.parse(JSON.stringify(this.chain));

    for (let i = 0; i < chainsCopy.length; i++) {
      for (let j = 0; j < chainsCopy[i].data.length; j++) {
        let transaction = chainsCopy[i].data[j];
        let temps = takeTransactions(transaction);
        if (j == 1) temps = [...temps, takeTransactionReward(transaction)];
        result = [...result, ...temps];
      }
    }
    result = cleanData(result, "success");
    return result;
  }

  getTransaction(id, index) {
    const chainsCopy = JSON.parse(JSON.stringify(this.chain));
    for (let i = 0; i < chainsCopy.length; i++) {
      const block = chainsCopy[i];
      for (let j = 0; j < block.data.length; j++) {
        const transaction = block.data[j];
        if (transaction.id === id) {
          let result = takeTransactions(transaction);
          if (j === 1) result = [...result, takeTransactionReward(transaction)];
          result = result[index];
          result.timestamp = new Date(result.timestamp).toLocaleString();
          result.status = "success";
          return result;
        }
      }
    }
    return null;
  }
  getHistoryTransactions(address) {
    let result = [];
    //Deep copy
    //Shallow copy
    //
    const chainsCopy = JSON.parse(JSON.stringify(this.chain));
    for (let i = 0; i < chainsCopy.length; i++) {
      for (let j = 0; j < chainsCopy[i].data.length; j++) {
        const transaction = chainsCopy[i].data[j];
        if (transaction.input.address === address) {
          const temps = takeTransactions(transaction);
          result = [...result, ...temps];
        } else if (
          transaction.outputs.find((output) => output.address === address)
        ) {
          let temps = takeTransactions(transaction);
          if (j == 1) temps = [...temps, takeTransactionReward(transaction)];

          console.log("Temps: " + JSON.stringify(temps));
          for (let i = 0; i < temps.length; i++) {
            if (temps[i].from === address || temps[i].to === address) {
              temps[i].status = "success";
              result = [...result, temps[i]];
            }
          }
        }
      }
    }
    result = cleanData(result, "success");
    return result;
  }
  getAllBlocks() {
    let blocks = [];
    const chainsCopy = JSON.parse(JSON.stringify(this.chain));

    for (let i = chainsCopy.length - 1; i >= 0; i--) {
      blocks = [...blocks, chainsCopy[i]];
    }

    blocks = blocks.map((block) => formatBlock(block));

    return blocks;
  }

  getBlock(hash) {
    const chainsCopy = JSON.parse(JSON.stringify(this.chain));
    for (let i = 0; i < chainsCopy.length; i++) {
      const block = chainsCopy[i];
      if (block.hash === hash) {
        return { ...formatBlock(block, true) };
      }
    }
    return null;
  }
}

module.exports = Blockchain;
