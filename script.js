// ==================================Elements=======================
const body = document.querySelector("body");
const mode = document.querySelector(".mode");
const cards = document.querySelector(".cards");
const loader = document.querySelector(".loader");
const regions = document.querySelector("#regions");
const input = document.querySelector(".input");
const main = document.querySelector("main");
const mainPage = document.querySelector(".mainPage");

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

async function fetchByBorder(name) {
  try {
    displayLoader();
    const res = await fetch(`https://restcountries.com/v3.1/alpha/${name}`);
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
  const html = `
  <a href="#${single.name.common}" class="detail">
  <div class="card">
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
  </div>
  </a>`;
  cards.insertAdjacentHTML("beforeend", html);
}

function displayDetailsView(country) {
  // console.log(country.borders.length);
  const html = `  <section id="#${country.name.common}" class="pageDetail">
  <a href="#mainPage" class="back">
    <button class="backBtn"><i class="fas fa-arrow-left"></i>Back</button>
  </a>
  <div class="about">
    <div class="flagImage">
      <img src="${country.flags.png}" alt="" />
    </div>
    <div class="details">
      <h2>${country.name.common}</h2>
      <div class="inner">
        <div class="one">
          <span class="capital"
            ><h4>Native Name:</h4>
            <p class="ans">${
              Object.values(country.name.nativeName)[0].common
            }</p></span
          >
          <span class="capital"
            ><h4>Population:</h4>
            <p class="ans">${country.population}</p></span
          >
          <span class="capital"
            ><h4>Region:</h4>
            <p class="ans">${country.region}</p></span
          >
          <span class="capital"
            ><h4>Sub Region:</h4>
            <p class="ans">${country.subregion}</p></span
          >
          <span class="capital"
            ><h4>Capital:</h4>
            <p class="ans">${country.capital}</p></span
          >
        </div>
        <div class="two">
          <span class="capital"
            ><h4>Top Level Domain:</h4>
            <p class="ans">${country.tld[0]}</p></span
          >
          <span class="capital"
            ><h4>Currencies:</h4>
            <p class="ans">Euro</p></span
          >
          <span class="capital"
            ><h4>Languages</h4>
            <p class="ans">${Object.values(country.languages).join(
              ", "
            )}</p></span
          >
        </div>
      </div>
      <div class="borderCountries">
        <h4>Border Countries:</h4>
      
      </div>
    </div>
  </div>
</section>`;
  return html;
}

async function displayDetails(data) {
  main.innerHTML = "";
  mainPage.classList.add("hidden");
  const country = await fetchByName(data.toLowerCase());
  // console.log(country);
  const elemToView = displayDetailsView(country[0]);
  main.insertAdjacentHTML("beforeend", elemToView);
  let borderCountries = country[0].borders;

  const parent = document.querySelector(".borderCountries");
  borderCountries.forEach((ele) => {
    fetchByBorder(ele).then((border) => {
      const tag = document.createElement("a");
      tag.classList.add("neighbour");
      tag.setAttribute("href", `#${border[0].name.common}`);
      tag.textContent = border[0].name.common;
      parent.append(tag);
    });
  });
}

async function displayData() {
  const data = await fetchData();
  // console.log(data);
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
window.addEventListener("hashchange", () => {
  if (window.location.hash.slice(1) === "mainPage") {
    const pageDetail = document.querySelector(".pageDetail");
    pageDetail.remove();
    mainPage.classList.remove("hidden");
    main.append(mainPage);
  } else {
    displayDetails(window.location.hash.slice(1));
  }
});
window.addEventListener("load", () => {
  displayData();
});
