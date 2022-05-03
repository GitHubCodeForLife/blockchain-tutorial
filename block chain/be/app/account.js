const fs = require("fs");
const url = "./blockchain.json";
class Account {
  constructor() {
    this.readFromFile();
  }
  saveToFile(username, password) {
    const newUser = { username: username, password: password };
    this.accounts = [...this.accounts, newUser];
    fs.writeFileSync(url, JSON.stringify(this.accounts));
  }

  readFromFile() {
    this.accounts = fs.readFileSync(url, "utf8");
    this.accounts = JSON.parse(this.accounts);
  }

  login(username, password) {
    this.readFromFile();
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
