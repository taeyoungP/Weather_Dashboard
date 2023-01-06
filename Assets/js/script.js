var resultOutputEl = document.querySelector('#result-output'); //for city
var resultContentEl = document.querySelector('#result-content'); //for 5 days weather
var searchFormEl = document.querySelector('#search-form');
var searchHistoryEl = document.querySelector('#search-history');

var searchHistorys = [];

//Weather API key: f7ba19852d9be6bf54931fa12322d8df
function printResults(weatherData, i){
    //temp wind humidity
    var forecast = document.createElement("ul");
     
        var temp = document.createElement('li');
        var wind = document.createElement('li');
        var humidity = document.createElement('li');
        var weatherIcon = document.createElement('li');

        temp.textContent = weatherData.list[i].main.temp + " F";
        wind.textContent = weatherData.list[i].wind.speed + " MPH";
        humidity.textContent = weatherData.list[i].main.humidity + "%";
        weatherIcon.textContent = weatherData.list[i].weather[0].icon;
        //TODO add Atrributes to list items and make them listed column direction

        forecast.appendChild(weatherIcon); //Icon
        forecast.appendChild(temp);
        forecast.appendChild(wind);
        forecast.appendChild(humidity);
        resultContentEl.append(forecast);
}

function searchApi(city){
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
      resultOutputEl.textContent = data.city.name + " (" + data.list[0].dt_txt + ")";

        resultContentEl.textContent = '';
        console.log(data);

        //add first weather info here then rest of them goes to loop
        //////////////////////TODO: need to nicely format to looks nicer to read...
        var weatherHead = document.createElement("ul");
        weatherHead.setAttribute("id", "weatherHead")
     
        var temp = document.createElement('li');
        var wind = document.createElement('li');
        var humidity = document.createElement('li');

        temp.textContent = data.list[0].main.temp + " F";
        wind.textContent = data.list[0].wind.speed + " MPH";
        humidity.textContent = data.list[0].main.humidity + "%";

        weatherHead.appendChild(temp);
        weatherHead.appendChild(wind);
        weatherHead.appendChild(humidity);
        resultOutputEl.appendChild(weatherHead);


        for(var i=1; i<data.list.length; i++){ //since current weather printed out separately, var i loop from 1 to 6 (5 day forecast)
            printResults(data, i);
        }


    })
    .catch(function (error) {
      console.error(error);
    });
}

function renderHistory() {
  searchHistoryEl.innerHTML = "";
  for(var i=searchHistorys.length-1; i>=0; i--){
    var searchedItem = document.createElement("li");
    var searchedCity = searchHistorys[i];
    searchedItem.textContent = searchedCity;
    searchedItem.setAttribute("data-index", i);
    searchedItem.setAttribute("class", "searched");
    searchedItem.setAttribute("id", searchedCity);

    var button = document.createElement("button");
    button.setAttribute("class", "delete")
    button.textContent = "❌";

    searchedItem.appendChild(button);
    searchHistoryEl.appendChild(searchedItem);
  }
}

function init() {
  var storedHistory = JSON.parse(localStorage.getItem("history"));
  if(storedHistory !== null){
    searchHistorys = storedHistory;
  }

  renderHistory();
}

function storeHistory() {
  localStorage.setItem("history", JSON.stringify(searchHistorys));
}

function handleSearchFormSubmit(event){
    event.preventDefault();

    var searchCity = document.querySelector('.form-input').value;

    if(!searchCity){
        console.log('You need a search input value!');
        return;
    }

    searchHistorys.push(searchCity);

    searchApi(searchCity);

    storeHistory();
    renderHistory();
}

searchHistoryEl.addEventListener("click", function(event){
  var element = event.target;
  if(element.matches(".delete")){
    var index = element.parentElement.getAttribute("data-index");
    searchHistorys.splice(index, 1);

    storeHistory();
    renderHistory();
  }
})

searchHistoryEl.addEventListener("click", function(event){
  var element = event.target;
  console.log(element.id);
  if(element.matches(".searched")){
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
