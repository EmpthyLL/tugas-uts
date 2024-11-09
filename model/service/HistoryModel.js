const Model = require("./Model");
const { v4: uuidv4 } = require("uuid");

class HistoryModel extends Model {
  constructor() {
    super("users");
    this.driver = [
      { name: "John Doe", vehicle: "BK 5342 AAA" },
      { name: "Jane Smith", vehicle: "BK 5678 AMD" },
      { name: "Robert Brown", vehicle: "BK 9101 ALZ" },
      { name: "Emily Davis", vehicle: "BK 1122 AIF" },
      { name: "Michael Johnson", vehicle: "BK 3344 AOJ" },
    ];
  }
  getHistoryItems() {
    return this.data;
  }

  addEntry(items) {
    const newHistory = {
      uuid: uuidv4(),
      items,
      driver: null,
    };
    this.data.push(entry);
    this.saveData(this.data);
  }
}

module.exports = HistoryModel;
