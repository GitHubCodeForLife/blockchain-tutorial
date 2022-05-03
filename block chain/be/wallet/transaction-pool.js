const Transaction = require("./transaction");
const {
  takeTransactions,
  formatPendingTransactions,
  cleanData,
} = require("../app/utitls");
class TransactionPool {
  constructor() {
    // represents a collections of transactions in the pool
    this.transactions = [];
  }

  /**
   * this method will add a transaction
   * it is possible that the transaction exists already
   * so it will replace the transaction with the new transaction
   * after checking the input id and adding new outputs if any
   * we call this method and replace the transaction in the pool
   */
  updateOrAddTransaction(transaction) {
    // get the transaction while checking if it exists
    let transactionWithId = this.transactions.find(
      (t) => t.id === transaction.id
    );

    if (transactionWithId) {
      this.transactions[this.transactions.indexOf(transactionWithId)] =
        transaction;
    } else {
      this.transactions.push(transaction);
    }
  }

  /**
   * returns a existing transaction from the pool
   * if the inputs matches
   */

  existingTransaction(address) {
    return this.transactions.find((t) => t.input.address === address);
  }

  /**
   * sends valid transactions to the miner
   */

  validTransactions() {
    /**
     * valid transactions are the one whose total output amounts to the input
     * and whose signatures are same
     */
    return this.transactions.filter((transaction) => {
      // reduce function adds up all the items and saves it in variable
      // passed in the arguments, second param is the initial value of the
      // sum total

      console.log({ output: transaction.outputs });

      const outputTotal = transaction.outputs.reduce((total, output) => {
        return total + output.amount;
      }, 0);
      if (transaction.input.amount !== outputTotal) {
        console.log(`Invalid transaction from ${transaction.input.address}`);
        return;
      }
      if (!Transaction.verifyTransaction(transaction)) {
        console.log(`Invalid signature from ${transaction.input.address}`);
        return;
      }

      return transaction;
    });
  }

  clear() {
    this.transactions = [];
  }
  isEmpty() {
    return this.transactions.length === 0;
  }

  //==========================================================
  getAllTransactions() {
    let result = [];
    const transactionsCopy = JSON.parse(JSON.stringify(this.transactions));
    for (let i = 0; i < transactionsCopy.length; i++) {
      let temps = takeTransactions(transactionsCopy[i]);
      result = [...result, ...temps];
    }
    result = cleanData(result);
    return result;
  }

  getTransaction(id, index) {
    const transactionsCopy = JSON.parse(JSON.stringify(this.transactions));
    for (let i = 0; i < transactionsCopy.length; i++) {
      const transaction = transactionsCopy[i];
      if (transaction.id === id) {
        let result = takeTransactions(transaction);
        result = result[index];
        result.timestamp = new Date(result.timestamp).toLocaleString();
        result.status = "pending";
        return result;
      }
    }
    return null;
  }
  getHistoryTransactions(address) {
    let result = [];
    const transactionsCopy = JSON.parse(JSON.stringify(this.transactions));
    for (let i = 0; i < transactionsCopy.length; i++) {
      const transaction = transactionsCopy[i];
      if (transaction.input.address === address) {
        const temps = takeTransactions(transaction);
        result = [...result, ...temps];
      } else if (
        transaction.outputs.find((output) => output.address === address)
      ) {
        const temps = takeTransactions(transaction);
        if (temps[i].from === address || temps[i].to === address) {
          temps[i].status = "success";
          result = [...result, temps[i]];
        }
      }
    }
    result = cleanData(result);
    return result;
  }
}

module.exports = TransactionPool;
