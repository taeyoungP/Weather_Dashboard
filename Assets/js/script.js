var resultOutputEl = document.querySelector('#result-output'); //for city
var resultContentEl = document.querySelector('#result-content'); //for 5 days weather
var searchFormEl = document.querySelector('#search-form');


//Weather API key: f7ba19852d9be6bf54931fa12322d8df
function printResults(weatherData, i){
    //temp wind humidity
    var weatherHead = document.createElement("ul");
     
        var temp = document.createElement("li");
        var wind = document.createElement("li");
        var humidity = document.createElement("li");

        temp = weatherData.list[i].main.temp + " F";
        wind = weatherData.list[i].wind.speed + " MPH";
        humidity = weatherData.list[i].main.humidity + "%";
        //TODO add Atrributes to list items and make them listed column direction

        weatherHead.append(temp);
        weatherHead.append(wind);
        weatherHead.append(humidity);
        resultContentEl.append(weatherHead);
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
     
        var temp = document.createElement("li");
        var wind = document.createElement("li");
        var humidity = document.createElement("li");

        temp = data.list[0].main.temp + " F";
        wind = data.list[0].wind.speed + " MPH";
        humidity = data.list[0].main.humidity + "%";

        weatherHead.append(temp);
        weatherHead.append(wind);
        weatherHead.append(humidity);
        resultOutputEl.append(weatherHead);


        for(var i=1; i<data.list.length; i++){ //since current weather printed out separately, var i loop from 1 to 6 (5 day forecast)
            printResults(data, i);
        }


    })
    .catch(function (error) {
      console.error(error);
    });
}

function handleSearchFormSubmit(event){
    event.preventDefault();

    var searchCity = document.querySelector('.form-input').value;

    if(!searchCity){
        console.log('You need a search input value!');
        return;
    }

    searchApi(searchCity);
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);

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
