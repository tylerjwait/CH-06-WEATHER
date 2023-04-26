var weatherSite = `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid='cb6bbead9040ae04e45583ff34a94722`;
var searchButton = document.getElementById("search-button");

localStorage.setItem("cities", "");
document.getElementById("input-area").focus();
document.getElementById("sec-five-day-forecast").style.visibility = "hidden";
document.getElementById("div-today-weather").style.visibility = "hidden";



function citySearches(event) {
    event.preventDefault();
    var cityInput = document.getElementById("input-area");

    if (cityInput.value.trim() === "") {
        alert("Please input a City Name");
        return;
    }

    if (localStorage.getItem("cities") === "") {
        var searchedCities = new Array();
        searchedCities[0] = cityInput.value.trim();
        localStorage.setItem("cities", JSON.stringify(searchedCities));
    } else {
        var newSearchedCities = JSON.parse(localStorage.getItem("cities"));
        for (i=0; i<newSearchedCities.length; i++) {
            if (newSearchedCities[i] === cityInput.value.trim()) {
                alert("This city has been searched previously. Please click the button corresponding with this City Name.");
                return;
            }
        }
        newSearchedCities[newSearchedCities.length] = cityInput.value.trim();
        localStorage.setItem("cities", JSON.stringify(newSearchedCities));
    }

    getWeatherInfo(cityInput.value.trim());
    cityInput.value = "";
    cityInput.focus();
    searchHistory();
}

function searchHistory() {
   var storedCityButtons = JSON.parse(localStorage.getItem("cities"));
   var divCities = document.getElementById("search-history");
   
   divCities.innerHTML = "";
   
   $.each(storedCityButtons,function(key,val) {
    let btn = document.createElement("button");
    btn.innerHTML = val;
    btn.className = "button is-dark block";
    btn.onclick = function() {
        getWeatherInfo(btn.innerHTML);
    }
    divCities.appendChild(btn);
   }) 
}

function getWeatherInfo(cityName) {
    var weatherApiKey = "cb6bbead9040ae04e45583ff34a94722";
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + weatherApiKey + "&units=imperial")
    .then(function(resp) {
        return resp.json();
    })
    .then(function(data) {
        displayWeather(data);
    })
}

function displayWeather(data) {
    console.log(data);
    document.getElementById("city-name").innerHTML = data.city.name;
    document.getElementById("current-temp").innerHTML = "Temperature: " + data.list[0].main.temp + " degrees F";
    document.getElementById("current-wind").innerHTML = "Wind: " + data.list[0].wind.speed + " mph";
    document.getElementById("current-hum").innerHTML = "Humidity: " + data.list[0].main.humidity + "%";


    for (i=1; i<=5; i++) {
        document.getElementById("day-" + i).innerHTML = "";
        var nextDayCounter = (i * 8) - 1;
       
        let hDate = document.createElement("h2");
        hDate.innerHTML = data.list[nextDayCounter].dt_txt;
        document.getElementById("day-" + i).appendChild(hDate);

        let pTemp = document.createElement("p");
        pTemp.innerHTML = "Temperature: " + data.list[nextDayCounter].main.temp + " degrees F";
        document.getElementById("day-" + i).appendChild(pTemp);

        let pWind = document.createElement("p");
        pWind.innerHTML = "Wind: " + data.list[nextDayCounter].wind.speed + " mph";
        document.getElementById("day-" + i).appendChild(pWind);
        
        let pHum = document.createElement("p");
        pHum.innerHTML = "Humidity: " + data.list[nextDayCounter].main.humidity + "%";
        document.getElementById("day-" + i).appendChild(pHum);

    }

    document.getElementById("sec-five-day-forecast").style.visibility = "visible";
    document.getElementById("div-today-weather").style.visibility = "visible";
}


searchButton.addEventListener("click", citySearches);