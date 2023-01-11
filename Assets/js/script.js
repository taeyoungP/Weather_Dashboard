var resultOutputEl = document.querySelector('#result-output'); //for city
var resultContentEl = document.querySelector('#result-content'); //for 5 days weather
var searchFormEl = document.querySelector('#search-form');
var searchHistoryEl = document.querySelector('#search-history');
var fiveForecastEl = document.querySelector('#five-forecast');

var searchHistorys = [];

//Display date
function displayDate(day) {
  var todayDate = day.getMonth()+1 + "/" + day.getDate() + "/" + day.getFullYear();
  return todayDate;
}

//Weather API key: f7ba19852d9be6bf54931fa12322d8df
//Print 5 day forecast
function printResults(weatherData, i) {
  //temp wind humidity
  var day = new Date(weatherData.list[i].dt*1000+(weatherData.city.timezone*1000));
  var todayDate = displayDate(day);

  var date = document.createElement('li');
  date.textContent = todayDate;

  var forecast = document.createElement("ul");
  forecast.setAttribute("class", "bg-primary text-white forecast");

  var temp = document.createElement('li');
  var wind = document.createElement('li');
  var humidity = document.createElement('li');
  var weatherIcon = document.createElement('li');
  var weatherIconImg = document.createElement('img');

  temp.textContent = "Temp: " + weatherData.list[i].main.temp + " ℉";
  wind.textContent = "Wind: " + weatherData.list[i].wind.speed + " MPH";
  humidity.textContent = "Humidity: " + weatherData.list[i].main.humidity + " %";

  date.setAttribute("class", "weatherInfo date");
  temp.setAttribute("class", "weatherInfo");
  wind.setAttribute("class", "weatherInfo");
  humidity.setAttribute("class", "weatherInfo");

  var iconUrl = "http://openweathermap.org/img/w/" + weatherData.list[i].weather[0].icon + ".png";
  weatherIconImg.setAttribute("src", iconUrl);
  weatherIcon.appendChild(weatherIconImg);

  forecast.appendChild(date);
  forecast.appendChild(weatherIcon); //Icon
  forecast.appendChild(temp);
  forecast.appendChild(wind);
  forecast.appendChild(humidity);
  resultContentEl.append(forecast);
}

//Fetch openweathermap api and display today's weather
function searchApi(city) {
  resultOutputEl.innerHTML = ""; //empty all elements' inner contents before putting new weather info
  fiveForecastEl.innerHTML = "";
  resultContentEl.innerHTML = "";

  var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city
    + "&units=imperial&appid=f7ba19852d9be6bf54931fa12322d8df";

  console.log(queryUrl);

  fetch(queryUrl)
    .then(function (response) {
      if (!response.ok) {
        console.log('No results found!');
        resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
        
        //throw response.json();
        throw new Error("The data is not available"); //of response not okay, throw error msg
      }
      return response.json();
    })
    .then(function (data) {
      //Get date from date data
      //https://stackoverflow.com/questions/62376115/how-to-obtain-open-weather-api-date-time-from-city-being-fetched
      //https://stackoverflow.com/questions/65746475/how-to-get-data-info-from-openweathermap-api-dt
      //https://www.w3schools.com/jsref/jsref_getmonth.asp
      var day = new Date(data.list[0].dt*1000+(data.city.timezone*1000));
      var todayDate = displayDate(day);
      console.log(day);

      console.log(data);
      //add first weather info here then rest of them goes to loop
      var weatherHead = document.createElement("ul");
      weatherHead.setAttribute("id", "weatherHead")

      var cityDate = document.createElement('li');
      var temp = document.createElement('li');
      var wind = document.createElement('li');
      var humidity = document.createElement('li');

      var weatherIconImg = document.createElement('img');
      var iconUrl = "http://openweathermap.org/img/w/" + data.list[0].weather[0].icon + ".png";
      weatherIconImg.setAttribute("src", iconUrl);
      weatherIconImg.setAttribute("id", "IconImg");

      cityDate.textContent = data.city.name + " (" + todayDate + ")";
      temp.textContent = "Temp: " + data.list[0].main.temp + " ℉";
      wind.textContent = "Wind: " + data.list[0].wind.speed + " MPH";
      humidity.textContent = "Humidity: " + data.list[0].main.humidity + " %";

      cityDate.setAttribute("id", "cityDate");
      cityDate.setAttribute("style", "")
      temp.setAttribute("class", "weatherInfo");
      wind.setAttribute("class", "weatherInfo");
      humidity.setAttribute("class", "weatherInfo");

      cityDate.appendChild(weatherIconImg);

      weatherHead.appendChild(cityDate);
      weatherHead.appendChild(temp);
      weatherHead.appendChild(wind);
      weatherHead.appendChild(humidity);
      resultOutputEl.appendChild(weatherHead);

      fiveForecastEl.textContent = "5-Day Forecast: ";
    
      //First data index[0] already has been displayed and there are total 40 weathers in data list
      //Because of timezone difference from different locations, increment by 7 to grab mid day weather info for 5 day forecast
      for (var i = 8; i < data.list.length; i+=7) { 
        printResults(data, i);
      }

    })
    .catch(function (error) {
      console.error(error); //catch error msg and log it
    });
}

function renderHistory() {
  searchHistoryEl.innerHTML = "";
  for (var i = searchHistorys.length - 1; i >= 0; i--) { //loop thru backwards so most recent history shows on the top
    var searchedItem = document.createElement("li");
    var searchedCity = searchHistorys[i];
    searchedItem.textContent = searchedCity;
    searchedItem.setAttribute("data-index", i);
    searchedItem.setAttribute("class", "searched btn btn-info btn-block bg-gray");
    searchedItem.setAttribute("id", searchedCity);

    var button = document.createElement("button");
    button.setAttribute("class", "delete bg-gray")
    button.textContent = "❌";

    searchedItem.appendChild(button);
    searchHistoryEl.appendChild(searchedItem);
  }
}

function init() {
  var storedHistory = JSON.parse(localStorage.getItem("history"));
  if (storedHistory !== null) {
    searchHistorys = storedHistory;
  }

  renderHistory();
}

function storeHistory() {
  localStorage.setItem("history", JSON.stringify(searchHistorys));
}

// Make first letter of the word Uppercase and rest of them as lowercase
// Used code from: https://stackoverflow.com/questions/4878756/how-to-capitalize-first-letter-of-each-word-like-a-2-word-city //
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var searchCity = document.querySelector('.form-input').value;

  if (!searchCity) {
    console.log('You need a search input value!');
    return;
  }

  var city = toTitleCase(searchCity);

  //Check if arrayList arleady has city. If yes, move searched city to the end of the array, else push new city name
  if(searchHistorys.includes(city)){
    //https://stackoverflow.com/questions/24909371/move-item-in-array-to-last-position
    searchHistorys.push(searchHistorys.splice(searchHistorys.indexOf(city), 1)[0]);
    //console.log("city already exist in history");
  }else {
    searchHistorys.push(city);
  }
  
  searchApi(searchCity);

  document.querySelector('.form-input').value = '';

  storeHistory();
  renderHistory();
}

//Delete history button 
searchHistoryEl.addEventListener("click", function (event) {
  var element = event.target;
  if (element.matches(".delete")) {
    var index = element.parentElement.getAttribute("data-index");
    searchHistorys.splice(index, 1);

    storeHistory();
    renderHistory();
  }
})

//Search city from the history list
searchHistoryEl.addEventListener("click", function (event) {
  var element = event.target;
  console.log(element.id);
  if (element.matches(".searched")) {
    var city = element.id;
    searchApi(city);
  }
})

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
init();
