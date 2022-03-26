var userFormEl = document.querySelector("#user-form");
var historyButtonsEl = document.querySelector("#history-buttons");
var cityInputEl = document.querySelector("#city");
var APIKey = "d9e5ba7e4082c6b542e25c028b4913b6";
var cityData = [];
var pastSearches = [];

var formSubmitHandler = async function(event) {
  // prevent page from refreshing
  event.preventDefault();

  // get value from input element
  var cityName = cityInputEl.value.trim();

  if (cityName) {
    getWeather();

    // clear old content
    cityInputEl.value = "";
  } else {
    alert("Please enter a city");
  }
};

var buttonClickHandler = async function(event) {

  //get the city name from the button
  city = event.target.textContent.trim();

  getWeather();
};

var getWeather = async function() {

  await setCityData(city);

  // if the city was not found
  if (cityData.length == 0) {
    return;
  }
  
  // format the weather api urls
  var queryURLA = "http://api.openweathermap.org/data/2.5/weather?lat=" + cityData[0] + "&lon=" + cityData[1] + "&units=imperial&appid=" + APIKey;
  var queryURLB = "http://api.openweathermap.org/data/2.5/forecast?lat=" + cityData[0] + "&lon=" + cityData[1] + "&units=imperial&appid=" + APIKey;

  // make a get request to url A
  await fetch(queryURLA)
  .then(function(response) {
    // request was successful
    if (response.ok) {
      console.log("Weather API Response: ");
      console.log(response);
      return response.json();
    } else {
      console.log("Error: " + response.statusText);
    }
  })
  .then(function(data) {
    console.log("Weather API data: " + data);
    console.log(data);
    displayWeatherSummary(data);
  })
  .catch(function(error) {
    console.log("Unable to connect to Weather API");
    console.log(error);
  });

  // make a get request to url B
  await fetch(queryURLB)
  .then(function(response) {
    // request was successful
    if (response.ok) {
      console.log("Weather API 5-day Forecast Response: ");
      console.log(response);
      return response.json();
    } else {
      console.log("Error: " + response.statusText);
    }
  })
  .then(function(data) {
    console.log("Weather API 5-day Forecast data: " + data);
    console.log(data);
    displayForecast(data);
  })
  .catch(function(error) {
    console.log("Unable to connect to 5-Day Forecast Weather API");
    console.log(error);
  });
};

var setCityData = async function(city) {
  //format geocoding url to get info about the city
  var queryURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIKey;

  // make a get request to url
  await fetch(queryURL)
  .then(function(response) {
    // request was successful
    if (response.ok) {
      console.log("Geocoding API Response: ");
      console.log(response);
      

      return response.json();
    } else {
      console.log("Error: " + response.statusText);
    }
  })
  .then(function(data) {
    console.log("Geocoding API data: ");
    console.log(data);

    if (data.length !== 0) {

      // add search to past searches if it's a new city
      if (pastSearches === null) {
        pastSearches = [city];
      }
      else if (pastSearches.indexOf(city) === -1) {
        pastSearches.push(city);
      }
      localStorage.setItem("pastSearches", JSON.stringify(pastSearches));
      loadPastSearches();

      // store latitude and longitude of the city in an array where index 0 = latitude and index 1 = longitude
      // store state and country in index = 2 and index = 3 respectively
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

  return;
}

var displayWeatherSummary = function(data) {

  document.querySelector("#weather-summary-container .card-header").textContent = cityData[2] + ", " + cityData[3] + ", " + cityData[4];
  document.getElementById("weather-icon").setAttribute("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
  document.querySelector("#temp-value").textContent = data.main.temp + " " + String.fromCharCode(176) + "F";
  document.querySelector("#wind-value").textContent = data.wind.speed + " MPH";
  document.querySelector("#humidity-value").textContent = data.main.humidity + "%";
  document.querySelector("#uv-index").textContent = "---";
};

var displayForecast = function(data) {

}

//load the past searches for easy access
var loadPastSearches = function() {
  document.getElementById("history-buttons").innerHTML = "";
  pastSearches = JSON.parse(localStorage.getItem("pastSearches"));
  
  if(pastSearches !== null) {
    for (searchTerm of pastSearches) {
    buttonEl = document.createElement("button");
    buttonEl.className = "btn";
    buttonEl.textContent = searchTerm;
    document.getElementById("history-buttons").appendChild(buttonEl);
    }
  }
}

loadPastSearches();

// add event listeners to form and button container
userFormEl.addEventListener("submit", formSubmitHandler);
historyButtonsEl.addEventListener("click", buttonClickHandler);
