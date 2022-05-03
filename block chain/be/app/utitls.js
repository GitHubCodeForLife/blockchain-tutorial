function formatString(str) {
  if (str.length > 5) {
    return str.substring(0, 5) + "..." + str.substring(str.length - 5);
  }
  return str + "";
}
function formatTransactions(currentTransaction, transactions, state) {
  for (let j = 1; j < currentTransaction.outputs.length; j++) {
    const transaction = {
      from: formatString(currentTransaction.input.address),
      to: formatString(currentTransaction.outputs[j].address),
      amount: currentTransaction.outputs[j].amount,
      id: currentTransaction.id,
      state: state,
      // convert timestamp to date
      timestamp: new Date(currentTransaction.input.timestamp).toLocaleString(),
    };
    transactions.push(transaction);
  }
}

function formatPendingTransactions(currentTransaction, transactions) {
  formatTransactions(currentTransaction, transactions, "pendding");
}

function formatSuccessTransactions(currentTransaction, transactions) {
  formatTransactions(currentTransaction, transactions, "success");
}

exports.formatString = formatString;
exports.formatPendingTransactions = formatPendingTransactions;
exports.formatSuccessTransactions = formatSuccessTransactions;
