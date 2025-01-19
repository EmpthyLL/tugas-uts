const eventSource = new EventSource("/api/order/status");
const statusOrder = {
  1: {
    label: "Order Completed",
    description: "The order has been successfully delivered.",
  },
  2: {
    label: "Order Canceled",
    description: "The order was canceled by the user or driver.",
  },
  3: {
    label: "Heading To Mart",
    description: "The driver is heading to the mart.",
  },
  4: {
    label: "Arrived At Mart",
    description: "The driver has arrived at the mart.",
  },
  5: {
    label: "Order Processed",
    description: "The order has been picked and paid for.",
  },
  6: {
    label: "Heading To User",
    description: "The driver is heading to the user.",
  },
  7: {
    label: "Order Arrived",
    description: "The driver has arrived at the user's location.",
  },
};
const HistoryPop = document.getElementById("History-Pop");
const HistoryDot = document.getElementById("HistoryDot");
const NotifPop = document.getElementById("Notif-Pop");
const NotifDot = document.getElementById("NotifDot");
const cancel = document.getElementById("cancel");
const rateDriver = document.getElementById("rateDriver");
const orderDot = document.getElementById("orderDot");
const OrderStatus = document.getElementById("OrderStatus");

eventSource.onmessage = async (event) => {
  const data = JSON.parse(event.data);
  if (data.status !== 1 && data.status !== 2 && data.status >= 5) {
    if (cancel) {
      cancel.classList.add("hidden");
    }
  } else if (data.status === 1) {
    HistoryDot.classList.remove("hidden");
    if (rateDriver) {
      rateDriver.classList.remove("hidden");
    }
  }
  if (orderDot) {
    rateDriver.classList.remove("hidden");
  }
  OrderStatus.innerHTML = `
            <!-- Dynamic Status -->
            <div>
              ${
                data.status === 1
                  ? `
              <span
                class="flex gap-2 border border-green-400 items-center text-green-500 bg-green-100 px-3 py-1 rounded-lg text-sm font-semibold"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-check"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                ${statusOrder[data.status].label}
              </span>`
                  : data.status === 2
                  ? `
              <span
                class="flex gap-2 items-center border border-red-400 text-red-500 bg-red-100 px-3 py-1 rounded-lg text-sm font-semibold"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-circle-x"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m15 9-6 6" />
                  <path d="m9 9 6 6" />
                </svg>
                ${statusOrder[data.status].label}
              </span>`
                  : `
              <span
                class="flex gap-2 items-center border border-yellow-400 text-yellow-500 bg-yellow-100 px-3 py-1 rounded-lg text-sm font-semibold"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-clock-4"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                ${statusOrder[data.status].label}
              </span>`
              }
            </div>

            <span
              class="text-gray-400 text-xs cursor-pointer flex items-center"
              title="${statusOrder[data.status].description}"
              >* 
                ${statusOrder[data.status].description}
            </span>
  `;
  await Promise.allSettled([updateHistory(), updateNotif()]);
};

eventSource.onerror = (error) => {
  console.error("EventSource failed:", error);
};

async function updateHistory() {
  try {
    const res = await axios.get("/api/order");
    if (!res.data.cart || res.data.cart.items.length === 0) {
      HistoryPop.innerHTML = `<p 
                  class="text-sm text-gray-500  flex justify-center items-center mt-2 mb-32" >
                  You haven't done any orders yet.
                  </p>`;
      return;
    }
    let navhtml = `<div>`;
    res.data.forEach((item) => {
      navhtml += `
                  <a
                    href="/${
                      item.status !== 1 || item.status !== 2
                        ? "order"
                        : "history"
                    }/${item.uuid}"
                    class="flex items-center space-x-4 p-4 m-2 bg-white rounded-lg shadow-lg border border-gray-200 transition-transform hover:scale-105 hover:shadow-xl"
                  >
                    <div class="w-full">
                      <p class="text-sm font-semibold text-gray-900">
                        ${formatDate(item.created_at)}
                      </p>

                      <div class="flex items-center mt-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#47a31f"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-shopping-cart"
                        >
                          <circle cx="8" cy="21" r="1" />
                          <circle cx="19" cy="21" r="1" />
                          <path
                            d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
                          />
                        </svg>

                        <p class="text-lg text-gray-900 font-medium ml-3">
                          ${formatCurrency(item.cart.total)}
                        </p>
                      </div>

                      <!-- Status Positioned at the Bottom Right -->
                      <div class="flex justify-end">
                        ${
                          item?.status === 1
                            ? `<span
                          class="flex gap-2 border w-max border-green-400 items-center text-green-500 bg-green-100 px-3 py-1 rounded-lg text-sm font-semibold"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="lucide lucide-check"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          ${item?.status_name}
                        </span>`
                            : item?.status === 2
                            ? `<span
                          class="flex gap-2 items-center w-max border border-red-400 text-red-500 bg-red-100 px-3 py-1 rounded-lg text-sm font-semibold"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="lucide lucide-circle-x"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="m15 9-6 6" />
                            <path d="m9 9 6 6" />
                          </svg>
                          ${item?.status_name}
                        </span>`
                            : `<span
                          class="flex gap-2 items-center border w-max border-yellow-400 text-yellow-500 bg-yellow-100 px-3 py-1 rounded-lg text-sm font-semibold"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="lucide lucide-clock-4"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          ${item?.status_name}
                        </span>`
                        }
                      </div>
                    </div>
                  </a>
                  `;
    });
    navhtml += `
                  <div
                    id="historyViewAll"
                    class="sticky bottom-0 left-0 right-0 py-2 bg-white text-center shadow-md border rounded-t-lg "
                  >
                    <a
                      href="/history"
                      class="text-blue-500 hover:text-blue-700 font-semibold"
                      >View All</a
                    >
                  </div></div>`;
    HistoryPop.innerHTML = navhtml;
  } catch (error) {
    if (error.status === 403) {
      window.location.href = "/sign-in";
    }
  }
}
async function updateNotif() {
  try {
    const res = await axios.get("/api/notif");
    if (!res.data.cart || res.data.cart.items.length === 0) {
      NotifDot.classList.add("hidden");
      NotifPop.innerHTML = `<p 
                  class="text-sm text-gray-500  flex justify-center items-center mt-2 mb-32" >
                  No notifications yet. Stay tuned!
                  </p>`;
      return;
    }
    NotifDot.classList.remove("hidden");
    let navhtml = `<div>`;
    res.data.forEach((item) => {
      navhtml += `
                <a
                  href="${item.navigate}"
                  onclick="handleNotif(event, ${item.id},'${item.navigate}')"
                  class="relative min-h-[84px] flex items-center space-x-4 p-4 bg-white  rounded-lg shadow-md border border-gray-200 m-2 hover:bg-green-300 hover:bg-opacity-80 transition duration-200 ease-in-out"
                >
                  <div
                    class="flex items-center justify-center aspect-square p-2 bg-lime-100 text-lime-500 rounded-full"
                  >
                    ${notifIcon[item.type]}
                  </div>

                  <!-- Tulisan acak di kanan -->

                  <div class="flex-column">
                    <p class="text-sm font-semibold text-gray-700">
                      ${item.title}
                    </p>

                    <p class="text-[12px] text-gray-700">
                      ${item.body}
                    </p>
                  </div>
                  ${
                    !item.is_read
                      ? `<span
                    class="absolute top-2 right-2 w-3 h-3 bg-red-500 border border-white dark:border-gray-800 rounded-full"
                  ></span>`
                      : ""
                  }
                </a>
                  `;
    });
    navhtml += `
                  <div
                    id="notifViewAll"
                    class="sticky bottom-0 left-0 right-0 py-2 bg-white text-center shadow-md border rounded-t-lg"
                  >
                    <a
                      href="/notification"
                      class="text-blue-500 hover:text-blue-700 font-semibold"
                      >View All</a
                    >
                  </div></div>`;
    NotifPop.innerHTML = navhtml;
  } catch (error) {
    if (error.status === 403) {
      window.location.href = "/sign-in";
    }
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
