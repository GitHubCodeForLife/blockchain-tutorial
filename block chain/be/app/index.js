require("dotenv").config();
const express = require("express");
const Blockchain = require("../blockchain/index");
const bodyParser = require("body-parser");
const P2pserver = require("./p2p-server");
const Miner = require("./miner");
const path = require("path");
const Wallet = require("../wallet/index");
const TransactionPool = require("../wallet/transaction-pool");
const Account = require("./account");
const { formatString } = require("./utitls");
const ChainUtil = require("../chain-util");

//get the port from the user or set the default port
const HTTP_PORT = process.env.HTTP_PORT || 3001;

//create a new app
const app = express();

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

//using the blody parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//using public file
app.use(express.static("public"));

// create a new blockchain instance
const blockchain = new Blockchain();

// create a new wallet
// const wallet = new Wallet();
let wallet = null;

// create a new transaction pool which will be later
// decentralized and synchronized using the peer to peer server
const transactionPool = new TransactionPool();

// create a p2p server instance with the blockchain and the transaction pool
const p2pserver = new P2pserver(blockchain, transactionPool);

// create a miner
// const miner = new Miner(blockchain, transactionPool, wallet, p2pserver);
let miner = null;

// ====================================Authentication========================================
const requireLogin = (req, res, next) => {
  if (!wallet) {
    return res.redirect("/login");
  }
  next();
};

const requireNotLogin = (req, res, next) => {
  if (wallet) {
    return res.redirect("/");
  }
  next();
};
// ====================================Authentication========================================

//EXPOSED APIs
//api to get the blocks
app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});

//api to add blocks
app.post("/api/mine", (req, res) => {
  const block = blockchain.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);

  /**
   * use the synchain method to synchronise the
   * state of the blockchain
   */
  p2pserver.syncChain();
  res.redirect("/api/blocks");
});

// api to start mining
app.get("/api/mine-transactions", (req, res) => {
  if (transactionPool.isEmpty()) {
    return res.status(400).json({
      message: "Cannot mine because there are no transactions",
    });
  }
  const block = miner.mine();
  console.log(`New block added: ${block.toString()}`);
  return res.status(200).json({
    note: "New block mined successfully",
    block: block,
  });
});

// api to view transaction in the transaction pool
app.get("/api/transactions", (req, res) => {
  res.json(transactionPool.transactions);
});

// create transactions
app.post("/api/transact", (req, res) => {
  const { recipient, amount } = req.body;
  console.log(`Recipient: ${recipient} | Amount: ${amount}`);
  const transaction = wallet.createTransaction(
    recipient,
    parseInt(amount),
    blockchain,
    transactionPool
  );
  p2pserver.broadcastTransaction(transaction);
  res.redirect("/api/transactions");
});

// get public key
app.get("/api/public-key", (req, res) => {
  res.json({ publicKey: wallet.publicKey });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const isLogin = account.login(username, password);

  if (isLogin) {
    wallet = new Wallet(username);
    miner = new Miner(blockchain, transactionPool, wallet, p2pserver);
    res.status(200).json({
      message: "Login Success",
      publicKey: wallet.publicKey,
      balance: wallet.calculateBalance(blockchain),
    });
  } else {
    res.status(401).json({ message: "Login Failed" });
  }
});

app.post("/api/register", (req, res) => {
  const username = ChainUtil.genKeyPair().getPrivate("hex");
  const password = req.body.password;
  account.saveToFile(username, password);
  res.json({
    username,
    password,
  });
});

// app server configurations
app.listen(HTTP_PORT, () => {
  console.log(`listening on port ${HTTP_PORT}`);
});

// p2p server configuration
p2pserver.listen();

//===================================== MVC =====================================
// VIEW CONTROLLER
const account = new Account();
// account.saveToFile(wallet.publicKey);

app.get("/", requireLogin, (req, res) => {
  res.render("index", {
    title: "Test",
    chains: JSON.stringify(blockchain.chain),
    publicKey: wallet.publicKey,
    balance: wallet.calculateBalance(blockchain),
    isLogin: true,
  });
});

app.get("/register", requireNotLogin, (req, res) => {
  res.render("wallet/register", { title: "Register", isLogin: false });
});

app.get("/login", requireNotLogin, (req, res) => {
  res.render("wallet/login", { title: "Login", isLogin: false });
});

app.get("/logout", requireLogin, (req, res) => {
  wallet = null;
  miner = null;
  res.redirect("/login");
});
app.get("/history", (req, res) => {
  let chains = blockchain.getAllChains();
  const pendingTransactions = transactionPool.getAllTransactions();
  const successTransactions = blockchain.getAllTransactions();

  const transactions = [...pendingTransactions, ...successTransactions];
  const isLogin = wallet ? true : false;
  res.render("history/index", {
    title: "History",
    chains,
    transactions,
    isLogin,
  });
});

app.get("/block/:id", (req, res) => {
  const { id } = req.params;
  const chain = JSON.stringify(blockchain.getBlock(id));
  const isLogin = wallet ? true : false;
  res.render("detail", {
    title: "Blocks",
    content: chain,
    isLogin,
  });
});

app.get("/transaction/:id", (req, res) => {
  const { id } = req.params;
  let transaction = blockchain.getTransaction(id);
  const penddingTransactions = transactionPool.getTransaction(id);

  transaction = transaction ? transaction : penddingTransactions;
  transaction = JSON.stringify(transaction);

  const isLogin = wallet ? true : false;
  res.render("detail", {
    title: "Transactions",
    content: transaction,
    isLogin,
  });
});
