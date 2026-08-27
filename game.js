let selectedWebsite = "";
let selectedPrice = 0;

function scrollToTemplates() {
  document.getElementById("templates").scrollIntoView({
    behavior: "smooth"
  });
}

function order(name, price) {
  selectedWebsite = name;
  selectedPrice = price;

  document.getElementById("modalTitle").textContent = name;
  document.getElementById("modalPrice").textContent =
    "Starting price: $" + price;

  document.getElementById("orderModal").classList.add("show");
}

function showContact() {
  document.getElementById("contact").scrollIntoView({
    behavior: "smooth"
  });
}

function closeModal() {
  document.getElementById("orderModal").classList.remove("show");
}

function submitOrder(event) {
  event.preventDefault();

  const name = document.getElementById("customerName").value;
  const email = document.getElementById("customerEmail").value;
  const message = document.getElementById("customerMessage").value;

  const subject = encodeURIComponent(
    "Website Order - " + selectedWebsite
  );

  const body = encodeURIComponent(
    "Website: " + selectedWebsite +
    "\nPrice: $" + selectedPrice +
    "\n\nCustomer name: " + name +
    "\nCustomer email: " + email +
    "\n\nCustomization request:\n" + message
  );

  /*
    IMPORTANT:
    Replace this email address with YOUR real business email.
  */
  const businessEmail = "YOUR_EMAIL@example.com";

  window.location.href =
    "mailto:" + businessEmail +
    "?subject=" + subject +
    "&body=" + body;
}

window.addEventListener("click", function(event) {
  const modal = document.getElementById("orderModal");

  if (event.target === modal) {
    closeModal();
  }
});
