let selectedWebsite = "";
let selectedPrice = 0;


/* NAVIGATION */

function goTo(section) {

  const element =
    document.getElementById(section);

  if (!element) return;

  element.scrollIntoView({
    behavior: "smooth"
  });

}


/* ORDER */

function order(name, price) {

  selectedWebsite = name;

  selectedPrice = price;

  document.getElementById(
    "modalTitle"
  ).textContent = name;

  document.getElementById(
    "modalPrice"
  ).textContent =
    "Starting price: $" + price;

  document.getElementById(
    "orderModal"
  ).classList.add("show");

}


/* CLOSE ORDER */

function closeModal() {

  document.getElementById(
    "orderModal"
  ).classList.remove("show");

}


/* LIVE PREVIEW */

function previewSite(type) {

  const container =
    document.getElementById(
      "previewWebsite"
    );

  let html = "";


  /* BUSINESS */

  if (type === "business") {

    html = `

      <div class="demo-site business-demo">

        <div class="demo-nav">

          <strong>
            BUSINESS PRO
          </strong>

          <div>

            <a href="#">Home</a>
            <a href="#">Services</a>
            <a href="#">Contact</a>

          </div>

        </div>


        <div class="demo-hero">

          <h1>
            Grow your business
            with confidence.
          </h1>

          <p>
            A professional website designed
            to help your business attract
            more customers.
          </p>

          <button class="demo-button">
            Get Started
          </button>

        </div>


        <div class="demo-cards">

          <div class="demo-card">

            <h2>
              Professional
            </h2>

            <p>
              Build trust with a modern
              online presence.
            </p>

          </div>


          <div class="demo-card">

            <h2>
              Responsive
            </h2>

            <p>
              Looks great on phones,
              tablets and computers.
            </p>

          </div>


          <div class="demo-card">

            <h2>
              Fast
            </h2>

            <p>
              Lightweight and ready
              for your customers.
            </p>

          </div>

        </div>

      </div>

    `;

  }


  /* CREATOR */

  if (type === "creator") {

    html = `

      <div class="demo-site creator-demo">

        <div class="demo-nav">

          <strong>
            CREATOR HUB
          </strong>

          <div>

            <a href="#">Home</a>
            <a href="#">Videos</a>
            <a href="#">About</a>

          </div>

        </div>


        <div class="demo-hero">

          <h1>
            Create.
            Share.
            Grow.
          </h1>

          <p>
            Your personal home on the internet
            for videos, gaming, projects and more.
          </p>

          <button class="demo-button">
            Explore My Work
          </button>

        </div>


        <div class="demo-cards">

          <div class="demo-card">

            <h2>
              Gaming
            </h2>

            <p>
              Showcase your gaming content.
            </p>

          </div>


          <div class="demo-card">

            <h2>
              Videos
            </h2>

            <p>
              Highlight your latest videos.
            </p>

          </div>


          <div class="demo-card">

            <h2>
              Community
            </h2>

            <p>
              Give your audience one place
              to find you.
            </p>

          </div>

        </div>

      </div>

    `;

  }


  /* RESTAURANT */

  if (type === "restaurant") {

    html = `

      <div class="demo-site restaurant-demo">

        <div class="demo-nav">

          <strong>
            TASTE HOUSE
          </strong>

          <div>

            <a href="#">Home</a>
            <a href="#">Menu</a>
            <a href="#">Contact</a>

          </div>

        </div>


        <div class="demo-hero">

          <h1>
            Taste something
            unforgettable.
          </h1>

          <p>
            Fresh ingredients, delicious food
            and an experience worth remembering.
          </p>

          <button class="demo-button">
            View Menu
          </button>

        </div>


        <div class="demo-cards">

          <div class="demo-card">

            <h2>
              Starters
            </h2>

            <p>
              Fresh dishes to begin your meal.
            </p>

          </div>


          <div class="demo-card">

            <h2>
              Main Course
            </h2>

            <p>
              Our chef's signature dishes.
            </p>

          </div>


          <div class="demo-card">

            <h2>
              Desserts
            </h2>

            <p>
              Finish your meal with something sweet.
            </p>

          </div>

        </div>

      </div>

    `;

  }


  container.innerHTML = html;


  document.getElementById(
    "previewModal"
  ).classList.add("show");

}


/* CLOSE PREVIEW */

function closePreview() {

  document.getElementById(
    "previewModal"
  ).classList.remove("show");

}


/* SEND ORDER */

function submitOrder(event) {

  event.preventDefault();


  const name =
    document.getElementById(
      "customerName"
    ).value;

  const email =
    document.getElementById(
      "customerEmail"
    ).value;

  const message =
    document.getElementById(
      "customerMessage"
    ).value;


  /*
    CHANGE THIS TO YOUR BUSINESS EMAIL.
    Do this yourself; don't send credentials here.
  */

  const businessEmail =
    "YOUR_EMAIL@example.com";


  const subject =
    encodeURIComponent(
      "WEBFORGE Order - " +
      selectedWebsite
    );


  const body =
    encodeURIComponent(

      "WEBFORGE ORDER\n\n" +

      "Website: " +
      selectedWebsite +

      "\nPrice: $" +
      selectedPrice +

      "\n\nCustomer name: " +
      name +

      "\nCustomer email: " +
      email +

      "\n\nCustomization request:\n" +
      message

    );


  window.location.href =
    "mailto:" +
    businessEmail +
    "?subject=" +
    subject +
    "&body=" +
    body;

}


/* OUTSIDE CLICK */

window.addEventListener(
  "click",
  function(event) {

    const orderModal =
      document.getElementById(
        "orderModal"
      );

    const previewModal =
      document.getElementById(
        "previewModal"
      );


    if (event.target === orderModal) {
      closeModal();
    }


    if (event.target === previewModal) {
      closePreview();
    }

  }
);
