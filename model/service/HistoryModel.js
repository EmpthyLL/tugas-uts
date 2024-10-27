const Model = require("./Model");

class HistoryModel extends Model {
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
