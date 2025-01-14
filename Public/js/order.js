const locations = [
  { name: "Alfamart", lat: 3.5784, lng: 98.6789 },
  { name: "Indomaret", lat: 3.5953, lng: 98.6743 },
  { name: "Alfamidi", lat: 3.5952, lng: 98.678 },
  { name: "Circle K", lat: 3.5821, lng: 98.6795 },
  { name: "FamilyMart", lat: 3.5867, lng: 98.6738 },
  { name: "Super Indo", lat: 3.5905, lng: 98.6712 },
  { name: "Lotte Mart", lat: 3.5803, lng: 98.6756 },
  { name: "Hypermart", lat: 3.5889, lng: 98.6765 },
  { name: "Transmart", lat: 3.5842, lng: 98.6801 },
  { name: "Giant Express", lat: 3.5933, lng: 98.6778 },
];
const orderButton = document.getElementById("order");
const confirmButton = document.getElementById("confirm");
const cancelButton = document.getElementById("cancel");
let delivery;

const map = L.map("map").setView([3.5952, 98.678], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const icons = {
  start: L.icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  }),
  user: L.icon({
    iconUrl:
      "https://cdn2.iconfinder.com/data/icons/font-awesome/1792/map-marker-32.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
};

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // distance in kilometers
}

function findClosestMart(userLat, userLng) {
  let closestMart = null;
  let minDistance = Infinity;

  locations.forEach((location) => {
    const distance = calculateDistance(
      userLat,
      userLng,
      location.lat,
      location.lng
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestMart = location;
    }
  });
  return closestMart;
}

function displayRoute(startLat, startLng, endLat, endLng) {
  L.Routing.control({
    waypoints: [L.latLng(startLat, startLng), L.latLng(endLat, endLng)],
    routeWhileDragging: false,
    lineOptions: { styles: [{ color: "blue", opacity: 0.7, weight: 5 }] },
    createMarker: () => null,
  }).addTo(map);

  map.fitBounds([
    [startLat, startLng],
    [endLat, endLng],
  ]);
}

function updateDeliveryAndTotal(distance, item) {
  const deliveryCost = Math.max(Math.round(distance) * 10400 * item, 12000);
  delivery = deliveryCost;
  let currTotal = new Decimal(
    document
      .getElementById("total")
      .innerText.replace("Rp", "")
      .replaceAll(".", "")
      .replace(",", ".")
      .trim()
  );
  currTotal = currTotal.plus(deliveryCost);

  // Format to Rupiah (IDR)
  const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  // Update delivery and total
  document.getElementById("delivery").innerText =
    rupiahFormatter.format(deliveryCost);
  document.getElementById("total").innerText =
    rupiahFormatter.format(currTotal);
}

function handleLocation(lat, lng) {
  const closestMart = findClosestMart(lat, lng);

  if (closestMart) {
    L.marker([lat, lng], { icon: icons.user })
      .addTo(map)
      .bindPopup("You are here")
      .openPopup();

    L.marker([closestMart.lat, closestMart.lng], { icon: icons.start })
      .addTo(map)
      .bindPopup(closestMart.name)
      .openPopup();
  }
}

// Wait until the "Order Driver" button is clicked
function orderDriver(item) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        handleLocation(userLat, userLng);

        // Find closest mart and display route
        const closestMart = findClosestMart(userLat, userLng);

        if (closestMart) {
          displayRoute(userLat, userLng, closestMart.lat, closestMart.lng);

          // Calculate and update delivery and total cost
          const distance = calculateDistance(
            userLat,
            userLng,
            closestMart.lat,
            closestMart.lng
          );
          updateDeliveryAndTotal(distance, item);
          orderButton.classList.add("hidden");
          confirmButton.classList.remove("hidden");
          cancelButton.classList.add("hidden");
        }
      },
      () => {
        window.location.reload();
      }
    );
  } else {
    window.location.reload();
  }
}

async function confirmOrder() {
  const html = `<div class="flex items-center justify-center space-x-2">
          <div class="h-6 w-6 animate-spin rounded-full border-4 border-green-300 border-t-transparent"> </div>
          <span>Looking for Driver...</span>
        </div>`;
  confirmButton.innerHTML = html;
  confirmButton.disabled = true;
  const res = await axios.post("/api/order", { delivery });
  console.log(res.data);
}
async function cancelOrder(created_at) {
  const html = `<div class="flex items-center justify-center space-x-2">
          <div class="h-6 w-6 animate-spin rounded-full border-4 border-green-300 border-t-transparent"> </div>
          <span>Looking for Driver...</span>
        </div>`;
  confirmButton.innerHTML = html;
  confirmButton.disabled = true;
  const res = await axios.delete("/api/order/", { delivery });
  console.log(res.data);
}
