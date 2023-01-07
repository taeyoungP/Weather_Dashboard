var resultOutputEl = document.querySelector('#result-output'); //for city
var resultContentEl = document.querySelector('#result-content'); //for 5 days weather
var searchFormEl = document.querySelector('#search-form');
var searchHistoryEl = document.querySelector('#search-history');
var fiveForecastEl = document.querySelector('#five-forecast');

var searchHistorys = [];

function displayDate(date) {
  var tempDate = date.split('T')[0];
  var tempDate = tempDate.split('-'); //[year, month, date]
  var todayDate = tempDate[1] + "/" + tempDate[2] + "/" + tempDate[0];
  return todayDate;
}

//Weather API key: f7ba19852d9be6bf54931fa12322d8df
function printResults(weatherData, i) {
  //temp wind humidity
  var day = new Date(weatherData.list[i].dt*1000+(weatherData.city.timezone*1000));
  var todayTime = day.toISOString();
  var todayDate = displayDate(todayTime);

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

function searchApi(city) {
  resultOutputEl.innerHTML = "";
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
        
        //searchHistorys.pop();
        //storeHistory();
        //renderHistory();

        throw response.json();
      }

      return response.json();
    })
    .then(function (data) {

      //resultOutputEl.innerHTML="";

      //var todayTime = data.list[0].dt_txt;
      //https://stackoverflow.com/questions/62376115/how-to-obtain-open-weather-api-date-time-from-city-being-fetched
      //https://stackoverflow.com/questions/65746475/how-to-get-data-info-from-openweathermap-api-dt
      var day = new Date(data.list[0].dt*1000+(data.city.timezone*1000));
      var todayTime = day.toISOString();
      var todayDate = displayDate(todayTime);

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


      //resultContentEl.innerHTML = "";
      //fiveForecastEl.innerHTML = "";
      fiveForecastEl.textContent = "5-Day Forecast: ";
      //resultContentEl.textContent = "5-Day Forecast: ";

      //First data index[0] already has been displayed, and data list length is total 40.
      //Therefore, increment by 8, thus starting i from 7(as index starts from 0)*
      for (var i = 7; i < data.list.length; i+=8) { 
        printResults(data, i);
      }

    })
    .catch(function (error) {
      console.error(error);
    });
}

function renderHistory() {
  searchHistoryEl.innerHTML = "";
  for (var i = searchHistorys.length - 1; i >= 0; i--) {
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

// https://stackoverflow.com/questions/4878756/how-to-capitalize-first-letter-of-each-word-like-a-2-word-city //
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

  searchHistorys.push(toTitleCase(searchCity));
  searchApi(searchCity);

  storeHistory();
  renderHistory();
}

searchHistoryEl.addEventListener("click", function (event) {
  var element = event.target;
  if (element.matches(".delete")) {
    var index = element.parentElement.getAttribute("data-index");
    searchHistorys.splice(index, 1);

    storeHistory();
    renderHistory();
  }
})

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
