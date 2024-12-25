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

    user.balance -= cart.total;

    user.cart = {
      items: [],
      cart_total: 0,
      tax: 0,
      member_discount: 0,
      delivery: 0,
      total: 0,
    };

    const newHistoryEntry = {
      uuid: uuidv4(),
      cart,
      driver: this.driver[Math.floor(Math.random() * this.driver.length)],
      status: "Ongoing", // Default status is "Ongoing"
      rating: null, // No rating by default
    };

    // Add the new entry to the user's history
    user.history.unshift(newHistoryEntry);

    this.saveData(this.data);

    return newHistoryEntry.uuid;
  }

  updateStatus(userId, uuid, newStatus) {
    const user = this.data.find((user) => user.uuid === userId);
    if (!user) throw new Error("User not found.");

    const historyItem = user.history.find((item) => item.uuid === uuid);
    if (!historyItem) throw new Error("History entry not found.");

    // Update the status of the history item
    historyItem.status = newStatus;

    // Save the updated data
    this.saveData(this.data);

    return historyItem; // Return the updated history item
  }

  orderDone(userId, uuid) {
    const user = this.data.find((user) => user.uuid === userId);

    // Update the status of the order to "Completed"
    this.updateStatus(userId, uuid, "Completed");

    this.saveData(this.data);

    return { status: "Completed", uuid }; // Return a success message with the UUID
  }

  orderCancel(userId, uuid) {
    const user = this.data.find((user) => user.uuid === userId);
    const historyItem = user.history.find((item) => item.uuid === uuid);

    if (!user) throw new Error("User not found.");
    if (!historyItem) throw new Error("History entry not found.");

    // Refund the user's balance by adding the order's total back
    user.balance += historyItem.cart.total;

    // Update the order status to "Cancelled"
    this.updateStatus(userId, uuid, "Cancelled");

    // Save the updated data
    this.saveData(this.data);

    return {
      status: "Cancelled",
      uuid,
      refundedAmount: historyItem.cart.total,
    }; // Return a success message with refunded amount
  }

  rateDriver(userId, uuid, rating) {
    const user = this.data.find((user) => user.uuid === userId);
    if (!user) throw new Error("User not found.");

    const historyItem = user.history.find((item) => item.uuid === uuid);
    if (!historyItem) throw new Error("History entry not found.");
    if (historyItem.status !== "Completed")
      throw new Error("Order must be completed to rate the driver.");

    // Ensure the rating is between 1 and 5
    if (rating < 1 || rating > 5)
      throw new Error("Rating must be between 1 and 5.");

    // Set the driver's rating
    historyItem.rating = rating;

    // Save the updated data
    this.saveData(this.data);

    return { status: "Rating submitted", uuid, rating };
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
