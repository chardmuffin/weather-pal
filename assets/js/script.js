var userFormEl = document.querySelector("#user-form");
var historyButtonsEl = document.querySelector("#history-buttons");
var cityInputEl = document.querySelector("#city");
var weatherSummaryContainerEl = document.querySelector("#weather-summary-container");

var formSubmitHandler = function(event) {
  // prevent page from refreshing
  event.preventDefault();

  // get value from input element
  var cityName = cityInputEl.value.trim();

  if (cityName) {
    getWeather(cityName);

    // clear old content
    weatherSummaryContainerEl.textContent = "";
    cityInputEl.value = "";
  } else {
    alert("Please enter a city");
  }
};

var buttonClickHandler = function(event) {

  //get the city name from the button
  
  getWeather(city);
};

var getWeather = function(city) {
  // format the weather api url
  var apiUrl = "";

  // make a get request to url
  fetch(apiUrl)
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
