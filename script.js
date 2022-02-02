// ==================================Elements==============================
const body = document.querySelector("body");
const mode = document.querySelector(".mode");
const cards = document.querySelector(".cards");
const loader = document.querySelector(".loader");

// =====================Functions==========================
function displayLoader() {
  loader.classList.add("show");
  setTimeout(() => {
    loader.classList.remove("show");
  }, 10000);
}
function hideLoader() {
  loader.classList.remove("show");
}

async function fetchData() {
  try {
    displayLoader();
    const res = await fetch("https://restcountries.com/v3.1/all");
    const data = await res.json();
    if (!res.ok) {
      throw new Error("Something went wrong");
    }
    if (res.ok) {
      hideLoader();
      return data;
    }
  } catch (err) {
    window.alert(err.message);
  }
}

async function displayData() {
  const data = await fetchData();
  console.log(data);
  data.forEach((single) => {
    const html = `<div class="card">
    <div class="image">
      <img src="${single.flags.png}" alt="" />
    </div>
    <div class="info">
      <span class="name">${single.name.common}</span>
      <span class="population"
        ><h4>Population:</h4>
        <p class="ans">${single.population}</p></span
      >
      <span class="region"
        ><h4>Region:</h4>
        <p class="ans">${single.region}</p></span
      >
      <span class="capital"
        ><h4>Capital:</h4>
        <p class="ans">${single.capital}</p></span
      >
    </div>
  </div>`;
    cards.insertAdjacentHTML("beforeend", html);
  });
}

// ==========================Event Listeners============================
mode.addEventListener("click", function () {
  body.classList.toggle("darkBody");
});

window.addEventListener("load", displayData);
