var userFormEl = document.querySelector("#user-form");
var historyButtonsEl = document.querySelector("#history-buttons");
var cityInputEl = document.querySelector("#city");
var APIKey = "d9e5ba7e4082c6b542e25c028b4913b6";

var formSubmitHandler = function(event) {
  // prevent page from refreshing
  event.preventDefault();

  // get value from input element
  var cityName = cityInputEl.value.trim();

  if (cityName) {
    getWeather(cityName);

    // clear old content
    document.querySelector("#weather-summary-container .card-header").textContent = "-----------------";
    document.querySelector("#weather-icon").className = "";
    document.querySelector("#temp-value").textContent = "---";
    document.querySelector("#wind-value").textContent = "---";
    document.querySelector("#humidity-value").textContent = "---";
    document.querySelector("#uv-index").textContent = "---";
    cityInputEl.value = "";
  } else {
    alert("Please enter a city");
  }
};

var buttonClickHandler = function(event) {

  //get the city name from the button
  city = event.target.textContent.trim();

  getWeather(city);
};

var getWeather = function(city) {
  // format the weather api url
  var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

  // make a get request to url
  fetch(queryURL)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        console.log(response);
        response.json().then(function(data) {
          console.log(data);
          displayWeatherSummary(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function(error) {
      alert("Unable to connect to Weather API");
    });
};

var displayWeatherSummary = function(data) {

  // check if api returned any weather data

};

// add event listeners to form and button container
userFormEl.addEventListener("submit", formSubmitHandler);
historyButtonsEl.addEventListener("click", buttonClickHandler);
