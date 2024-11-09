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

  addEntry(userId, cart) {
    const user = this.data.find((user) => user.uuid === userId);

    const newHistoryEntry = {
      uuid: uuidv4(),
      cart,
      driver: this.driver[Math.floor(Math.random() * this.driver.length)],
      status: "Ongoing",
      rating: null,
    };

    // Add the new entry to the user's history
    user.history.unshift(newHistoryEntry);

    // Save the updated data
    this.saveData(this.data);
  }

  getHistoryByUuid(userId, uuid) {
    const user = this.data.find((user) => user.uuid === userId);
    if (!user) throw new Error("User not found.");

    const historyItem = user.history.find((item) => item.uuid === uuid);
    if (!historyItem) throw new Error("History entry not found.");

    return historyItem;
  }
}

module.exports = HistoryModel;
