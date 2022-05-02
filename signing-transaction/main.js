const { BlockChain, Transaction } = require("./blockchain");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const myKey = ec.keyFromPrivate(
  "a18c4fa5b70550333ddc8486bf0c5f4a35542e6587bc1e10be41e63df80399dd"
);
const myWalletAddress = myKey.getPublic("hex");

let TranBlock = new BlockChain();

const tx1 = new Transaction(myWalletAddress, "public key go here  ", 10);
tx1.signTransaction(myKey);

TranBlock.addTransaction(tx1);

console.log("\n Starting the miner");
TranBlock.minePendingTransactions(myWalletAddress);

console.log(
  "\nBalance of address3 is ",
  TranBlock.getBalanceOfAddress(myWalletAddress)
);

console.log("Is Chain valid: ", TranBlock.isChainValid());
console.log(TranBlock.chain);
