const Model = require("./Model");

class TransactionModel extends Model {
  constructor() {
    this.source = "transaction";
    super();
  }
}

module.exports = TransactionModel;
