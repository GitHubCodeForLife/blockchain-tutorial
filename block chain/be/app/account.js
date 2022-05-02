const fs = require("fs");
const url = "./blockchain.json";
class Account {
  constructor() {
    this.accounts = this.readFromFile();
    this.accounts = JSON.parse(this.accounts);
  }

  saveToFile(username, password) {
    const newUser = { username: username, password: password };
    this.accounts = [...this.accounts, newUser];
    fs.writeFileSync(url, JSON.stringify(this.accounts));
  }

  readFromFile() {
    return fs.readFileSync(url, "utf8");
  }

  login(username, password) {
    for (let i = 0; i < this.accounts.length; i++) {
      const account = this.accounts[i];
      if (account.username === username && account.password === password) {
        return true;
      }
    }
    return false;
  }
}

module.exports = Account;
