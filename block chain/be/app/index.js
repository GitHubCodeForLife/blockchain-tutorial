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
//EXPOSED APIs

//api to get the blocks
app.get("/blocks", (req, res) => {
  res.json(blockchain.chain);
});

//api to add blocks
app.post("/mine", (req, res) => {
  const block = blockchain.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);

  /**
   * use the synchain method to synchronise the
   * state of the blockchain
   */
  p2pserver.syncChain();
  res.redirect("/blocks");
});

// api to start mining
app.get("/mine-transactions", (req, res) => {
  const block = miner.mine();
  console.log(`New block added: ${block.toString()}`);
  res.redirect("/blocks");
});

// api to view transaction in the transaction pool
app.get("/transactions", (req, res) => {
  res.json(transactionPool.transactions);
});

// create transactions
app.post("/transact", (req, res) => {
  console.log(req.body);
  const { recipient, amount } = req.body;

  console.log(`Recipient: ${recipient} | Amount: ${amount}`);
  const transaction = wallet.createTransaction(
    recipient,
    parseInt(amount),
    blockchain,
    transactionPool
  );
  p2pserver.broadcastTransaction(transaction);
  res.redirect("/transactions");
});

// get public key
app.get("/public-key", (req, res) => {
  res.json({ publicKey: wallet.publicKey });
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

app.get("/test", (req, res) => {
  res.render("index", {
    title: "Test",
    chains: JSON.stringify(blockchain.chain),
    publicKey: wallet.publicKey,
    balance: wallet.calculateBalance(blockchain),
  });
});

app.get("/history", (req, res) => {
  let chains = [...blockchain.chain];
  let transactions = [...transactionPool.transactions];

  chains = chains.map((chain) => {
    if (
      chain.data != null &&
      chain.data != undefined &&
      chain.data.length > 0
    ) {
      chain.miner = chain.data[0].outputs[0].address;
      chain.miner = formatString(chain.miner);
    }

    chain.hash = formatString(chain.hash);
    chain.lastHash = formatString(chain.lastHash);

    return chain;
  });
  //from to
  //amount
  //id
  transactions = transactions.map((transaction) => {
    transaction.from = formatString(transaction.outputs[0].address);
    transaction.to = formatString(transaction.outputs[1].address);
    transaction.amount = transaction.outputs[1].amount;
    transaction.id = formatString(transaction.id);
    return transaction;
  });

  res.render("history/index", { title: "History", chains, transactions });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const isLogin = account.login(username, password);

  if (isLogin) {
    wallet = new Wallet(username);
    miner = new Miner(blockchain, transactionPool, wallet, p2pserver);
    res.send("Login Success");
  } else {
    res.send("Invalid username or password");
  }
});

app.get("/register", (req, res) => {
  const username = ChainUtil.genKeyPair().getPrivate("hex");
  const password = "admin";
  account.saveToFile(username, password);
  res.json({
    username,
    password,
  });
});
