const fs = require("fs");
const path = require("path");

class Model {
  constructor(source) {
    this.source = `./model/json/${source}.json`;
    this.dirExist();
    this.data = this.loadData();
  }

  dirExist() {
    const dirPath = path.dirname(this.source);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    if (!fs.existsSync(this.source)) {
      fs.writeFileSync(this.source, "[]");
    }
  }

  loadData() {
    const rawData = fs.readFileSync(this.source, "utf8");
    return JSON.parse(rawData);
  }

  saveData() {
    fs.writeFileSync(this.source, JSON.stringify(this.data, null, 2));
  }
}

module.exports = Model;
