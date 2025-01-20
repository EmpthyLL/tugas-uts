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
const notifCon = document.getElementById("notificationContent");

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateHistory(data.history);
  updateNotif(data.notif);
  if (data.status !== 1 && data.status !== 2 && data.status >= 5) {
    if (cancel) {
      delete cancel;
      cancel.classList.add("hidden");
    }
  } else if (data.status === 1) {
    HistoryDot.classList.remove("hidden");
    if (rateDriver) {
      rateDriver.classList.remove("hidden");
    }
  }
  if (orderDot) {
    orderDot.classList.remove("hidden");
  }
  if (OrderStatus) {
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
  }
};

eventSource.onerror = (error) => {
  console.error("EventSource failed:", error);
};

function updateHistory(data) {
  let navhtml = `<div>`;
  data?.slice(0, 10)?.forEach((item) => {
    navhtml += `
                  <a
                    href="/${
                      item.status !== 1 && item.status !== 2
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
}
function updateNotif(data) {
  const notifIcon = {
    home: `
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
                style="width: 24px; height: 24px; flex-shrink: 0;"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>`,
    register: `
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
                class="lucide lucide-id-card"
                style="width: 24px; height: 24px; flex-shrink: 0;"
              >
                <path d="M16 10h2" />
                <path d="M16 14h2" />
                <path d="M6.17 15a3 3 0 0 1 5.66 0" />
                <circle cx="9" cy="11" r="2" />
                <rect x="2" y="5" width="20" height="14" rx="2" />
              </svg>`,
    becomemember: `<svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                  style="width: 24px; height: 24px; flex-shrink: 0;"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                  />
                </svg>`,
    welcomemember: `
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
                        class="lucide lucide-party-popper"
                        style="width: 24px; height: 24px; flex-shrink: 0;"
                      >
                        <path d="M5.8 11.3 2 22l10.7-3.79" />
                        <path d="M4 3h.01" />
                        <path d="M22 8h.01" />
                        <path d="M15 2h.01" />
                        <path d="M22 20h.01" />
                        <path
                          d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"
                        />
                        <path
                          d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"
                        />
                        <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7" />
                        <path
                          d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"
                        />
                      </svg>`,
    profile: `<svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                    style="width: 24px; height: 24px; flex-shrink: 0;"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>`,
    profileemail: `<svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-at-sign"
                        style="width: 24px; height: 24px; flex-shrink: 0;"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
                      </svg>`,
    profilephone: `<svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-phone"
                        style="width: 24px; height: 24px; flex-shrink: 0;"
                      >
                        <path
                          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                        />
                      </svg>`,
    topup: `
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
                style="width: 24px; height: 24px; flex-shrink: 0;"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                />
              </svg>`,
    needtopup: `
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                  style="width: 24px; height: 24px; flex-shrink: 0;"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                  />
                </svg>`,
    inprocess: `
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                      style="width: 24px; height: 24px; flex-shrink: 0;"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                      />`,
    complete: `
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                      style="width: 24px; height: 24px; flex-shrink: 0;"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
                      />
                    </svg>`,
    cancel: `
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                      style="width: 24px; height: 24px; flex-shrink: 0;"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                      />
                    </svg>`,
    confirm: `
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                    style="width: 24px; height: 24px; flex-shrink: 0;"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                    />
                  </svg>`,
    store: `
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
            class="lucide lucide-store"
            style="width: 24px; height: 24px; flex-shrink: 0;"
          >
            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
            <path d="M2 7h20" />
            <path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
          </svg>
        `,
    arived: `
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
                class="lucide lucide-map-pinned"
                style="width: 24px; height: 24px; flex-shrink: 0;"
              >
                <path
                  d="M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0"
                />
                <circle cx="12" cy="8" r="2" />
                <path
                  d="M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712"
                />
              </svg>`,
  };
  NotifDot.classList.remove("hidden");
  let navhtml = `<div>`;
  data?.slice(0, 10)?.forEach((item) => {
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

  let menuHTML = "";
  const currentUrl = new URL(window.location);
  const tab = currentUrl.searchParams.get("tab");
  if (tab === "order" && notifCon) {
    data.forEach((item) => {
      menuHTML += `
                <a
                  href="${item.navigate}"
                  onclick="handleNotif(event,${item.id},'${item.navigate}')"
                  class="relative min-h-[84px] flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md border border-gray-200 m-2 hover:bg-green-300 hover:bg-opacity-80 transition duration-200 ease-in-out"
                >
                  <div
                    class="flex items-center justify-center aspect-square p-2 bg-lime-100 text-lime-500 rounded-full"
                  >
                    ${notifIcon[item.type]}
                  </div>

                  <!-- Text container -->
                  <div class="flex flex-col flex-1">
                    <p class="text-sm font-semibold text-gray-700">${
                      item.title
                    }</p>

                    <div class="flex justify-between items-end mt-1">
                      <p class="text-[12px] text-gray-700">${item.body}</p>
                      <p class="text-[12px] text-gray-400">
                        ${formatDate(item.created_at)}
                      </p>
                    </div>
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
      notifCon.innerHTML = menuHTML;
    });
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}
