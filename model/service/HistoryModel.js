const Model = require("./Model");

class HistoryModel extends Model {
  constructor() {
    this.source = "users";
    super();
  }
  getHistoryItems() {
    return this.data;
  }

  addEntry(entry) {
    this.data.push(entry);
    this.saveData(this.data);
  }

  removeEntry(entryId) {
    this.data = this.data.filter((entry) => entry.id !== entryId);
    this.saveData(this.data);
  }
}

module.exports = HistoryModel;
