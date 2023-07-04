const fs = require("fs");

class Database {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = [];
    this.readDataFromFile();
  }

  readDataFromFile() {
    try {
      const jsonData = fs.readFileSync(this.filePath, "utf8");
      this.data = JSON.parse(jsonData);
    } catch (error) {
      console.log("Error reading JSON file:", error);
      this.data = [];
    }
  }

  writeDataToFile() {
    const jsonData = JSON.stringify(this.data, null, 2);
    fs.writeFileSync(this.filePath, jsonData, "utf8");
  }

  getUserByUsername(username) {
    return this.data.find((user) => user.username === username);
  }

  getUserByEmail(email) {
    return this.data.find((user) => user.email === email);
  }

  addUser(user) {
    this.data.push(user);
    this.writeDataToFile();
  }

  updateUser(user) {
    const index = this.data.findIndex((u) => u.email === user.email);
    if (index !== -1) {
      this.data[index] = user;
      this.writeDataToFile();
    }
  }
}

module.exports = Database;
