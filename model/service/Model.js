const fs = require("fs");
const path = require("path");

class Model {
  constructor() {
    this.dir = `./json/${this.source}.json`;
    this.dirExist();
    this.data = this.loadData();
  }

  dirExist() {
    const dirPath = path.dirname(this.dir);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    if (!fs.existsSync(this.dir)) {
      fs.writeFileSync(this.dir, "[]");
    }
  }

  loadData() {
    const rawData = fs.readFileSync(this.dir, "utf8");
    return JSON.parse(rawData);
  }

  saveData(data) {
    fs.writeFileSync(this.dir, JSON.stringify(data, null, 2));
  }
}

module.exports = Model;
