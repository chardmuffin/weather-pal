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

  var date = new Date(data.current.dt * 1000).toLocaleDateString("en-US");

  document.querySelector("#weather-summary-container .card-header").textContent = cityData[2] + ", " + cityData[3] + ", " + cityData[4] + " - " + date;
  document.getElementById("weather-icon").setAttribute("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png");
  document.querySelector("#temp-value").textContent = data.current.temp + " " + String.fromCharCode(176) + "F";
  document.querySelector("#wind-value").textContent = data.current.wind_speed + " MPH";
  document.querySelector("#humidity-value").textContent = data.current.humidity + "%";
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

  currentDate = new Date(data.current.dt * 1000);
  

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
