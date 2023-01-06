var resultOutputEl = document.querySelector('#result-output'); //for city
var resultContentEl = document.querySelector('#result-content'); //for 5 days weather
var searchFormEl = document.querySelector('#search-form');
var searchHistoryEl = document.querySelector('#search-history');
var fiveForecastEl = document.querySelector('#five-forecast');

var searchHistorys = [];

function displayDate(date) {
  var tempDate = date.split(' ')[0];
  var tempDate = tempDate.split('-'); //[year, month, date]
  var todayDate = tempDate[1] + "/" + tempDate[2] + "/" + tempDate[0];
  return todayDate;
}

//Weather API key: f7ba19852d9be6bf54931fa12322d8df
function printResults(weatherData, i) {
  //temp wind humidity
  var todayTime = weatherData.list[i].dt_txt;
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

  date.setAttribute("class", "weatherInfo");
  temp.setAttribute("class", "weatherInfo");
  wind.setAttribute("class", "weatherInfo");
  humidity.setAttribute("class", "weatherInfo");

  var iconUrl = "http://openweathermap.org/img/w/" + weatherData.list[i].weather[0].icon + ".png";
  weatherIconImg.setAttribute("src", iconUrl);
  weatherIcon.appendChild(weatherIconImg);
  //TODO add Atrributes to list items and make them listed column direction

  forecast.appendChild(date);
  forecast.appendChild(weatherIcon); //Icon
  forecast.appendChild(temp);
  forecast.appendChild(wind);
  forecast.appendChild(humidity);
  resultContentEl.append(forecast);
}

function searchApi(city) {
  var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city
    + "&cnt=6&units=imperial&appid=f7ba19852d9be6bf54931fa12322d8df";

  console.log(queryUrl);

  fetch(queryUrl)
    .then(function (response) {
      if (!response.ok) {
        console.log('No results found!');
        resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
        throw response.json();
      }

      return response.json();
    })
    .then(function (data) {
      resultOutputEl.innerHTML="";

      var todayTime = data.list[0].dt_txt;
      var todayDate = displayDate(todayTime);
      

      console.log(data);
      
      //add first weather info here then rest of them goes to loop
      //////////////////////TODO: need to nicely format to looks nicer to read...
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


      resultContentEl.innerHTML = "";
      resultContentEl.textContent = "5-Day Forecast: ";
      for (var i = 1; i < data.list.length; i++) { //since current weather printed out separately, var i loop from 1 to 6 (5 day forecast)
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

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var searchCity = document.querySelector('.form-input').value;

  if (!searchCity) {
    console.log('You need a search input value!');
    return;
  }

  searchHistorys.push(searchCity);

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

///TODO
///Make local storage for array list of searched city names and display below
// the search for City form (set and get local storage***)
//(maybe set each attribute data="cityname"?)
//****Make sure to make conditional statement to check if the list is empty or not */
/* Also check if the item already exist in the list
Maybe I delete again and append to the end of the arraylist
then prints out history array list backwward.. so it will appear on the top of
button lists.... */

// When displaying, make each of list items to button
//Add click event on button and when clicked, get that city name
//and call searchApi function
