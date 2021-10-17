export const setPlaceholderText = () => {
  const input = document.getElementById("searchBar__text");
  window.innerWidth < 400
    ? (input.placeholder = "City, State, Country")
    : (input.placeholder = "City, State, Country or Zip Code");
};

export const addSpinner = (element) => {
  animateButton(element);
  setTimeout(animateButton, 1000, element);
};

const animateButton = (element) => {
  element.classList.toggle("none");
  element.nextElementSibling.classList.toggle("block");
  element.nextElementSibling.classList.toggle("none");
};

export const displayError = (headerMsg, srMsg) => {
  updateWeatherLocationHeader(headerMsg);
  updateScreenReaderConfirmation(srMsg);
};

const updateWeatherLocationHeader = (message) => {
  const h1 = document.getElementById("currentForecast__location");
  h1.textContent = message;
};

export const updateScreenReaderConfirmation = (message) => {
  document.getElementById("confirmation").textContent = message;
};

export const displayApiError = (statusCode) => {
  const properMsg = toProperCase(statusCode.message);
  updateWeatherLocationHeader(properMsg);
  updateScreenReaderConfirmation(`${properMsg}. Please try again`);
};

const toProperCase = (text) => {
  const words = text.split(" ");
  const properWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return properWords.join(" ");
};

export const updateDisplay = (weatherJson, locationObj) => {
  fadeDisplay();
  clearDisplay();

  const weatherClass = getWeatherClass(weatherJson.current.weather[0].icon);
  setBGImg(weatherClass);

  const screenReaderWeather = buildScreenReaderWeather(
    weatherJson,
    locationObj
  );
  updateScreenReaderConfirmation(screenReaderWeather);
  updateWeatherLocationHeader(locationObj.getName());
  // current conditions
  const ccArray = createCurrentConditionsDivs(
    weatherJson,
    locationObj.getUnit()
  );
  displayCurrentConditions(ccArray);
  displaySixDayForecast(weatherJson, locationObj.getUnit());
  setFocusOnSearch();
  fadeDisplay();
};

const fadeDisplay = () => {
  const currentConditions = document.getElementById("currentForecast");
  currentConditions.classList.toggle("zero-vis");
  currentConditions.classList.toggle("fade-in");
  // for six day forecast
  const dailyForecast = document.getElementById("dailyForecast");
  dailyForecast.classList.toggle("zero-vis");
  dailyForecast.classList.toggle("fade-in");
};

const clearDisplay = () => {
  const currentConditions = document.getElementById(
    "currentForecast__conditions"
  );
  deleteContents(currentConditions);
  const sixDayForecast = document.getElementById("dailyForecast__contents");
  deleteContents(sixDayForecast);
};

const deleteContents = (parentElement) => {
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
};

const getWeatherClass = (icon) => {
  const firstTwoChars = icon.slice(0, 2);
  const lastChar = icon.slice(2);
  const weatherLookup = {
    "09": "snow",
    10: "rain",
    11: "rain",
    13: "snow",
    50: "fog",
  };
  let weatherClass;
  if (weatherLookup[firstTwoChars]) {
    weatherClass = weatherLookup[firstTwoChars];
  } else if (lastChar === "d") {
    weatherClass = "clouds";
  } else {
    weatherClass = "night";
  }
  return weatherClass;
};

const setBGImg = (weatherClass) => {
  document.documentElement.classList.add(weatherClass);
  document.documentElement.classList.forEach((img) => {
    if (img != weatherClass) document.documentElement.classList.remove(img);
  });
};

const buildScreenReaderWeather = (weatherJson, locationObj) => {
  const location = locationObj.getName();
  const unit = locationObj.getUnit();
  const tempUnit = unit === "imperial" ? "F" : "C";
  return `${weatherJson.current.weather[0].description} and ${Math.round(
    Number(weatherJson.current.temp)
  )}'\u00B0'${tempUnit} in ${location}`;
};

const setFocusOnSearch = () => {
  document.getElementById("searchBar__text").focus();
};

const createCurrentConditionsDivs = (weatherObj, unit) => {
  const tempUnit = unit === "imperial" ? "F" : "C";
  const windUnit = unit === "imperial" ? "mph" : "m/s";
  const icon = createMainDiv(
    weatherObj.current.weather[0].icon,
    weatherObj.current.weather[0].description
  );
  const temp = createElem(
    "div",
    "temp",
    `${Math.round(Number(weatherObj.current.temp))} °${tempUnit}`
  );
  const properDesc = toProperCase(weatherObj.current.weather[0].description);

  const desc = createElem("div", "desc", properDesc);

  const feels = createElem(
    "div",
    "feels",
    `Feel like ${Math.round(
      Number(weatherObj.current.feels_like)
    )} °${tempUnit}`
  );

  const maxTemp = createElem(
    "div",
    "maxTemp",
    `High ${Math.round(Number(weatherObj.daily[0].temp.max))} °${tempUnit}`
  );

  const minTemp = createElem(
    "div",
    "minTemp",
    `Low ${Math.round(Number(weatherObj.daily[0].temp.min))} °${tempUnit}`
  );

  const humidity = createElem(
    "div",
    "humidity",
    `Humidity ${weatherObj.current.humidity}%`
  );

  const wind = createElem(
    "div",
    "wind",
    `Wind ${Math.round(Number(weatherObj.current.wind_speed))} ${windUnit}`
  );

  return [icon, temp, desc, feels, maxTemp, minTemp, humidity, wind];
};

const createMainDiv = (icon, altText) => {
  const iconDiv = createElem("div", "icon");
  iconDiv.id = "icon";
  const faIcon = translateIconToFontAwesome(icon);
  faIcon.araiHidden = true;
  faIcon.title = altText;
  iconDiv.appendChild(faIcon);
  return iconDiv;
};

const createElem = (elemType, divClassName, divText, unit) => {
  const div = document.createElement(elemType);
  div.className = divClassName;
  if (divText) {
    div.textContent = divText;
  }
  if (divClassName === "temp") {
    const unitDiv = document.createElement("div");
    unitDiv.className = "unit";
    unitDiv.textContent = unit;
    div.appendChild(unitDiv);
  }
  return div;
};

const translateIconToFontAwesome = (icon) => {
  const i = document.createElement("i");
  const firstTwoChars = icon.slice(0, 2);
  const lastChar = icon.slice(2);
  switch (firstTwoChars) {
    case "01":
      if (lastChar === "d") {
        i.classList.add("far", "fa-sun");
      } else {
        i.classList.add("far", "fa-moon");
      }
      break;

    case "02":
      if (lastChar === "d") {
        i.classList.add("fas", "fa-cloud-sun");
      } else {
        i.classList.add("fas", "fa-cloud-moon");
      }
      break;

    case "03":
      i.classList.add("fas", "fa-cloud");
      break;

    case "04":
      i.classList.add("fas", "fa-cloud-meatball");
      break;

    case "09":
      i.classList.add("fas", "fa-cloud-rain");
      break;

    case "10":
      if (lastChar === "d") {
        i.classList.add("fas", "fa-cloud-sun-rain");
      } else {
        i.classList.add("fas", "fa-cloud-moon-rain");
      }
      break;

    case "11":
      i.classList.add("fas", "fa-poo-storm");
      break;

    case "13":
      i.classList.add("fas", "fa-snowflake");
      break;

    case "50":
      i.classList.add("fas", "fa-smog");
      break;

    default:
      i.classList.add("far", "fa-question-circle");
  }

  return i;
};

const displayCurrentConditions = (currentConditionsArray) => {
  const ccContainer = document.getElementById("currentForecast__conditions");
  currentConditionsArray.forEach((cc) => {
    ccContainer.appendChild(cc);
  });
};

const displaySixDayForecast = (weatherJson, unit) => {
  const tempUnit = unit === "imperial" ? "F" : "C";
  for (let i = 1; i <= 6; i++) {
    const dfArray = createDailyForecastDivs(weatherJson.daily[i], tempUnit);
    displayDailyForecast(dfArray);
  }
};

const createDailyForecastDivs = (dayWeather, tempUnit) => {
  const dayAbbreviationText = getDayAbbreviation(dayWeather.dt);
  const dayAbbreviation = createElem(
    "p",
    "dayAbbreviation",
    dayAbbreviationText
  );
  const dayIcon = createDailyForecastIcon(
    dayWeather.weather[0].icon,
    dayWeather.weather[0].description
  );
  const dayHigh = createElem(
    "p",
    "dayHigh",
    `${Math.round(Number(dayWeather.temp.max))} °${tempUnit}`
  );
  const dayLow = createElem(
    "p",
    "dayLow",
    `${Math.round(Number(dayWeather.temp.min))} °${tempUnit}`
  );
  return [dayAbbreviation, dayIcon, dayHigh, dayLow];
};

const getDayAbbreviation = (data) => {
  const dateObj = new Date(data * 1000);
  const utcString = dateObj.toUTCString();
  return utcString.slice(0, 3).toUpperCase();
};

const createDailyForecastIcon = (icon, altText) => {
  const img = document.createElement("img");
  if (window.innerWidth < 768 || window.innerHeight < 1025) {
    img.src = `https://openweathermap.org/img/wn/${icon}.png`;
  } else {
    img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
  img.alt = altText;
  return img;
};

const displayDailyForecast = (dfArray) => {
  const dayDiv = createElem("div", "forecastDay");
  dfArray.forEach((el) => {
    dayDiv.appendChild(el);
  });
  const dauilyForecastConatiner = document.getElementById(
    "dailyForecast__contents"
  );
  dauilyForecastConatiner.appendChild(dayDiv);
};
