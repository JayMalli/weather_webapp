import {
  addSpinner,
  displayError,
  updateScreenReaderConfirmation,
  displayApiError,
  setPlaceholderText,
  updateDisplay,
} from "./domFunctions.js";

import CurrentLocation from "./currentLocation.js";

import { logout } from "./firebase.js";

import {
  setLocationObject,
  getHomeLocation,
  cleanText,
  getCoordsFromApi,
  getweatherFromCoords,
} from "./dataFunctions.js";

document.addEventListener("DOMContentLoaded", () => {
  let obj = sessionStorage.getItem("authUser");
  if (obj == null) {
    window.location = "login.html";
  }
});

const currentLoc = new CurrentLocation();

// log out button
const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", logout);

const initApp = () => {
  // add listeners

  // for geolocation button
  const geoButton = document.getElementById("getLocation");
  geoButton.addEventListener("click", getGeoWeather);

  // for home button
  const homeButton = document.getElementById("home");
  homeButton.addEventListener("click", loadWeather);

  // for save button
  const saveButton = document.getElementById("saveLocation");
  saveButton.addEventListener("click", saveLocation);

  // for unit button
  const unitButton = document.getElementById("unit");
  unitButton.addEventListener("click", setUniPref);

  // for unit button
  const refreshButton = document.getElementById("refresh");
  refreshButton.addEventListener("click", refreshWeather);

  // for serch button
  const locationEntry = document.getElementById("searchBar__form");
  locationEntry.addEventListener("submit", submitNewLocation);

  // set up
  setPlaceholderText();
  // load waether
  loadWeather();
};

document.addEventListener("DOMContentLoaded", () => {});

document.addEventListener("DOMContentLoaded", initApp);

/* Geo Location Button */

const getGeoWeather = (event) => {
  if (event) {
    if (event.type == "click") {
      // add spinner
      const mapIcon = document.querySelector(".fa-map-marker-alt");
      addSpinner(mapIcon);
    }
  }
  if (!navigator.geolocation) return geoError();
  navigator.geolocation.getCurrentPosition(gesoSuccess, geoError);
};

const geoError = (errObj) => {
  const errMsg = errObj ? errObj.message : "Geolocation not supported";
  displayError(errMsg, errMsg);
};

const gesoSuccess = (position) => {
  const myCoordObj = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    name: `Lat:${position.coords.latitude}  Long:${position.coords.longitude}`,
  };

  // set location object
  setLocationObject(currentLoc, myCoordObj);

  // update data and display
  updateDataAndDisplay(currentLoc);
};

const loadWeather = (event) => {
  const savedLocation = getHomeLocation();
  if (!savedLocation && !event) return getGeoWeather();
  if (!savedLocation && event.type === "click") {
    displayError(
      "No Home location saved.",
      "Sorry, Please save your home location first."
    );
  } else if (savedLocation && !event) {
    displayHomeLocationWeather(savedLocation);
  } else {
    const homeIcon = document.querySelector(".fa-home");
    addSpinner(homeIcon);
    displayHomeLocationWeather(savedLocation);
  }
};

const displayHomeLocationWeather = (home) => {
  if (typeof home === "string") {
    const locationJson = JSON.parse(home);
    const myCoordsObj = {
      lat: locationJson.lat,
      lon: locationJson.lon,
      name: locationJson.name,
      unit: locationJson.unit,
    };
    setLocationObject(currentLoc, myCoordsObj);
    updateDataAndDisplay(currentLoc);
  }
};

const saveLocation = () => {
  if (currentLoc.getLat() && currentLoc.getLon()) {
    const saveIcon = document.querySelector(".fa-save");
    addSpinner(saveIcon);
    const location = {
      name: currentLoc.getName(),
      unit: currentLoc.getUnit(),
      lat: currentLoc.getLat(),
      lon: currentLoc.getLon(),
    };
    localStorage.setItem("defaultWeatherLocation", JSON.stringify(location));
    updateScreenReaderConfirmation(
      `Saved ${currentLoc.getName()} as home location.`
    );
  }
};

const setUniPref = () => {
  const unitIcon = document.querySelector(".fa-chart-bar");
  addSpinner(unitIcon);
  currentLoc.toggleUnit();
  updateDataAndDisplay(currentLoc);
};

const refreshWeather = () => {
  const refreshIcon = document.querySelector(".fa-sync-alt");
  addSpinner(refreshIcon);
  updateDataAndDisplay(currentLoc);
};

const submitNewLocation = async (event) => {
  event.preventDefault();
  const text = document.getElementById("searchBar__text").value;
  const entryText = cleanText(text);
  if (!entryText) return;
  const locationIcon = document.querySelector(".fa-search");
  addSpinner(locationIcon);
  const coordsData = await getCoordsFromApi(entryText, currentLoc.getUnit());
  if (coordsData) {
    if (coordsData.cod === 200) {
      // work with API data
      const myCoordsObj = {
        lat: coordsData.coord.lat,
        lon: coordsData.coord.lon,
        name: coordsData.sys.country
          ? `${coordsData.name},${coordsData.sys.country}`
          : coordsData.name,
      };
      // success
      setLocationObject(currentLoc, myCoordsObj);
      updateDataAndDisplay(currentLoc);
    } else {
      // error
      displayApiError(coordsData);
    }
  } else {
    displayError("Connection Error", "Connection Error");
  }
};

const updateDataAndDisplay = async (locationObj) => {
  const weatherJson = await getweatherFromCoords(locationObj);
  if (weatherJson) updateDisplay(weatherJson, locationObj);
};
