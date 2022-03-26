var userFormEl = document.querySelector("#user-form");
var historyButtonsEl = document.querySelector("#history-buttons");
var cityInputEl = document.querySelector("#city");
var APIKey = "d9e5ba7e4082c6b542e25c028b4913b6";
var cityData = [];
var pastSearches = [];

var formSubmitHandler = function(event) {
  // prevent page from refreshing
  event.preventDefault();

  var city = cityInputEl.value.trim();

  if (city) {
    getWeather(city);
  } else {
    alert("Please enter a city");
  }
};

var buttonClickHandler = function(event) {

  // if misclick between buttons
  if (event.target.tagName === "DIV") {
    return;
  }

  city = event.target.textContent.trim();
  getWeather(city);
};

var getWeather = async function(city) {

  await setCityData(city);

  // if the city was not found
  if (cityData.length == 0) {
    return;
  }
  
  // format the weather api urls
  var queryURLA = "http://api.openweathermap.org/data/2.5/onecall?lat=" + cityData[0] + "&lon=" + cityData[1] + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + APIKey;

  // make a get request to url
  await fetch(queryURLA)
  .then(function(response) {
    // request was successful
    if (response.ok) {
      console.log(response);
      return response.json();
    } else {
      console.log("Error: " + response.statusText);
    }
  })
  .then(function(data) {
    console.log("Weather data: ");
    console.log(data);
    displayWeatherSummary(data);
    displayForecast(data);
  })
  .catch(function(error) {
    console.log("Unable to connect to Weather API");
    console.log(error);
  });
};

// sets the city name, state, country, longitude and latitude in the global var cityData array
var setCityData = async function(city) {
  //format geocoding url to get info about the city
  var queryURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIKey;

  // make a get request to url
  await fetch(queryURL)
  .then(function(response) {
    // request was successful
    if (response.ok) {
      console.log(response);
      

      return response.json();
    } else {
      console.log("Error: " + response.statusText);
    }
  })
  .then(function(data) {
    console.log("Geocoding data: ");
    console.log(data);

    if (data.length !== 0) {

      // add search to past searches if it's a new city
      if (pastSearches === null) {
        pastSearches = [data[0].name];
      }
      else if (pastSearches.indexOf(city) === -1) {
        pastSearches.push(data[0].name);
      }

      // remove oldest search item if more than 10 items
      if (pastSearches.length == 11) {
        pastSearches.shift();
      }

      //save to local storage, refresh list of past searches
      localStorage.setItem("pastSearches", JSON.stringify(pastSearches));
      loadPastSearches();

      // store latitude and longitude of the city in an array where index 0 = latitude and index 1 = longitude
      // store city, state and country in index = 2, 3, 4 respectively
      cityData = [data[0].lat, data[0].lon, data[0].name, data[0].state, data[0].country];
    }
    else {
      alert("City not found.");
      cityData = [];
    }
  })
  .catch(function(error) {
    console.log("Unable to connect to Geocoding API");
    console.log(error);
  });
}

// display general summary of today's weather at the specified city
var displayWeatherSummary = function(data) {

  var uvi = data.current.uvi
  var uviEl = document.querySelector("#uv-index");

  var date = new Date(data.daily[0].dt * 1000).toLocaleDateString("en-US");

  document.querySelector("#weather-summary-container .card-header-med").textContent = cityData[2] + ", " + cityData[3] + ", " + cityData[4] + " - " + date;
  document.getElementById("weather-icon").setAttribute("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@4x.png");
  document.getElementById("temp-value").textContent = data.current.temp + " " + String.fromCharCode(176) + "F";
  document.getElementById("wind-value").textContent = data.current.wind_speed + " MPH";
  document.getElementById("humidity-value").textContent = data.current.humidity + "%";
  uviEl.textContent = uvi;

  if (uvi < 3) {
    uviEl.setAttribute("style", "background-color: lightgreen;");
  }
  else if (uvi < 6) {
    uviEl.setAttribute("style", "background-color: yellow;")
  }
  else if (uvi < 8) {
    uviEl.setAttribute("style", "background-color: orange;")
  }
  else if (uvi < 11) {
    uviEl.setAttribute("style", "background-color: red;")
  }
  else {
    uviEl.setAttribute("style", "background-color: purple;")
  }
};

var displayForecast = function(data) {

  fiveDayForecastEl = document.getElementById("five-day-forecast");
  fiveDayForecastEl.innerHTML = "";

  //next 5 days of forecast are index 1-5 in the api data
  for (var i = 1; i <= 5; i++) {

    var dateHeaderEl = document.createElement("h4");
    dateHeaderEl.className = "card-header-med";
    var today = new Date(data.daily[i].dt * 1000)
    dateHeaderEl.textContent= today.toLocaleDateString("en-US");

    var dayCardEl = document.createElement("div");
    dayCardEl.className = "weather-card col-auto";

    var uvi = data.daily[i].uvi;
    var pEl = document.createElement("p");
    pEl.innerHTML = "Temp: " + data.daily[i].temp.day + "</br>Wind: " + data.daily[i].wind_speed+ "MPH</br>Humidity: " + data.daily[i].humidity + "%</br>UV Index: <span id='uvi-daily-"+ i +"'>"+ uvi + "</span>";

    var dayIconEl = document.createElement("img");
    dayIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");
    dayIconEl.setAttribute("style", "float: right;");

    dayCardEl.append(dateHeaderEl, pEl, dayIconEl);
    
    fiveDayForecastEl.appendChild(dayCardEl);

    uviEl = document.getElementById("uvi-daily-" + i);
    if (uvi < 3) {
      uviEl.setAttribute("style", "background-color: lightgreen; color: var(--dark)");
    }
    else if (uvi < 6) {
      uviEl.setAttribute("style", "background-color: yellow; color: var(--dark)")
    }
    else if (uvi < 8) {
      uviEl.setAttribute("style", "background-color: orange; color: var(--dark)")
    }
    else if (uvi < 11) {
      uviEl.setAttribute("style", "background-color: red; color: var(--dark)")
    }
    else {
      uviEl.setAttribute("style", "background-color: purple; color: var(--dark)")
    }
  }
}

//load the past searches for easy access
var loadPastSearches = function() {
  document.getElementById("history-buttons").innerHTML = "";
  pastSearches = JSON.parse(localStorage.getItem("pastSearches"));
  
  if(pastSearches !== null) {
    for (var i = pastSearches.length - 1; i >= 0; i--) {
    buttonEl = document.createElement("button");
    buttonEl.className = "btn";
    buttonEl.textContent = pastSearches[i];
    document.getElementById("history-buttons").appendChild(buttonEl);
    }
  }
}

loadPastSearches();

// add event listeners to form and button container
userFormEl.addEventListener("submit", formSubmitHandler);
historyButtonsEl.addEventListener("click", buttonClickHandler);
