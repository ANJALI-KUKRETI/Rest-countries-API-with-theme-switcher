// ==================================Elements=======================
const body = document.querySelector("body");
const mode = document.querySelector(".mode");
const cards = document.querySelector(".cards");
const loader = document.querySelector(".loader");
const regions = document.querySelector("#regions");
const input = document.querySelector(".input");

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

async function fetchByName(name) {
  try {
    displayLoader();
    const res = await fetch(`https://restcountries.com/v3.1/name/${name}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error("Oops! This country doesn't exist");
    }
    if (res.ok) {
      hideLoader();
      return data;
    }
  } catch (err) {
    window.alert(err.message);
  }
}
function displayCards(single) {
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
}
async function displayData() {
  const data = await fetchData();
  console.log(data);
  data.forEach((single) => {
    displayCards(single);
  });
}

async function displayRegionWise(e) {
  cards.innerHTML = "";
  console.log(e.target.value);
  const data = await fetchData();

  data.forEach((single) => {
    if (single.region === e.target.value) {
      displayCards(single);
    }
  });
}
input.addEventListener("keyup", async function (e) {
  try {
    if (e.keyCode === 13) {
      cards.innerHTML = "";
      const val = input.value.toLowerCase();
      if (val.length > 0) {
        const country = await fetchByName(val);
        displayCards(country[0]);
      } else if (val.length === 0) {
        throw new Error("Please enter a country name");
      } else {
        throw new Error("Oops! This country doesn't exist");
      }
      input.value = "";
    }
  } catch (err) {
    window.alert(err.message);
  }
});
// ==========================Event Listeners============================
mode.addEventListener("click", function () {
  body.classList.toggle("darkBody");
});
regions.addEventListener("click", (e) => {
  displayRegionWise(e);
});
window.addEventListener("load", displayData);
