function formatString(str) {
  if (str.length > 5) {
    return str.substring(0, 5) + "..." + str.substring(str.length - 5);
  }
  return str + "";
}
function formatTransactions(currentTransaction, state) {
  const copyCurrentTransaction = { ...currentTransaction };
  const result = {
    from: formatString(copyCurrentTransaction.from),
    to: formatString(copyCurrentTransaction.to),
    amount: copyCurrentTransaction.amount,
    id: copyCurrentTransaction.id,
    state: state,
    timestamp: new Date(copyCurrentTransaction.timestamp).toLocaleString(),
  };
  return result;
}

function formatPendingTransactions(currentTransaction) {
  return formatTransactions(currentTransaction, "pendding");
}

function formatSuccessTransactions(currentTransaction) {
  return formatTransactions(currentTransaction, "success");
}

function takeTransactions(transaction) {
  let result = [];
  for (let j = 1; j < transaction.outputs.length; j++) {
    const temp = {
      id: transaction.id,
      from: transaction.input.address,
      amount: transaction.outputs[j].amount,
      to: transaction.outputs[j].address,
      timestamp: transaction.input.timestamp,
    };
    result = [...result, temp];
  }
  return result;
}

function cleanData(transactions, type = "pending") {
  transactions = transactions.sort((a, b) => {
    return b.timestamp - a.timestamp;
  });
  transactions = transactions.map((transaction) => {
    if (type === "pending") {
      return formatPendingTransactions(transaction);
    } else {
      return formatSuccessTransactions(transaction);
    }
  });
  return transactions;
}
function formatBlock(block, isDetail = false) {
  if (typeof block.timestamp !== "string")
    block.timestamp = new Date(block.timestamp).toLocaleString();
  if (block.data.length > 0) {
    block.miner =
      isDetail == false
        ? formatString(block.data[1].outputs[0].address)
        : block.data[1].outputs[0].address;
  } else {
    block.miner = "System";
  }
  return block;
}

exports.formatString = formatString;
exports.formatPendingTransactions = formatPendingTransactions;
exports.formatSuccessTransactions = formatSuccessTransactions;
exports.takeTransactions = takeTransactions;
exports.cleanData = cleanData;
exports.formatBlock = formatBlock;
