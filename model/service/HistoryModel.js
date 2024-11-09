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

  addEntry(cart) {
    const newHistory = {
      uuid: uuidv4(),
      cart,
      driver: this.driver[Math.floor(Math.random() * 5)],
      status: "Ongoing",
      ratting: null,
    };
    this.data.unshift(newHistory);
    this.saveData(this.data);
  }
  getHistoryByUuid(uuid) {
    const historyItem = this.data.find((item) => item.uuid === uuid);
    if (!historyItem) throw new Error("History entry not found.");
    return historyItem;
  }
}

module.exports = HistoryModel;
