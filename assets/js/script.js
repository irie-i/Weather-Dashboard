function initPage() {
    const cityEl = document.getElementById("enter-city");
    const searchEl = document.getElementById("search-btn");
    const clearEl = document.getElementById("clear-btn");
    const nameEl = document.getElementById("city-name");
    const picEl = document.getElementById("current-pic");
    const tempEl = document.getElementById("temperature");
    const humidityEl = document.getElementById("humidity");
    const windEl = document.getElementById("wind-speed");
    const uvEl = document.getElementById("UV-index");
    const historyEl = document.getElementById("history");
    var fivedayEl = document.getElementById("fiveday");
    var todayweatherEl = document.getElementById("current-weather");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

    const APIKey = "e685d10cedf0167b79a9d39d41a569b3";

    function checkWeather(cityName) {
        // request from open weather api for current weather
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        axios.get(queryURL)
            .then(function (response) {
                console.log(response)

                todayweatherEl.classList.remove("d-none");

                // Parse data to display current weather
                const currentDate = new Date(response.data.dt * 1000);
                console.log(currentDate)
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
                let weatherPic = response.data.weather[0].icon;
                picEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
                picEl.setAttribute("alt", response.data.weather[0].description);
                tempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
                humidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
                windEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";

                // Gets UV Index
                let lat = response.data.coord.lat;
                let lon = response.data.coord.lon;
                let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
                axios.get(UVQueryURL)
                    .then(function (response) {
                        let UVIndex = document.createElement("span");

                        // UV index color changes based on value
                        if (response.data[0].value < 4) {
                            UVIndex.setAttribute("class", "badge badge-success");
                        }
                        else if (response.data[0].value < 8) {
                            UVIndex.setAttribute("class", "badge badge-warning");
                        }
                        else {
                            UVIndex.setAttribute("class", "badge badge-danger");
                        }
                        console.log(response.data[0].value)
                        UVIndex.innerHTML = response.data[0].value;
                        uvEl.innerHTML = "UV Index: ";
                        uvEl.append(UVIndex);
                    });


            });
    }

    //  PullsHistory from local storage
    searchEl.addEventListener("click", function () {
        const searchTerm = cityEl.value;
        checkWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        recallHistory();
    })

    // Button to clear history
    clearEl.addEventListener("click", function () {
        localStorage.clear();
        searchHistory = [];
        recallHistory();
    })

    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }

    function recallHistory() {
        historyEl.innerHTML = "";
        for (let i = 0; i < searchHistory.length; i++) {
            const historyItem = document.createElement("input");
            historyItem.setAttribute("type", "text");
            historyItem.setAttribute("readonly", true);
            historyItem.setAttribute("class", "form-control d-block bg-white");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click", function () {
                checkWeather(historyItem.value);
            })
            historyEl.append(historyItem);
        }
    }

    recallHistory();
    if (searchHistory.length > 0) {
        checkWeather(searchHistory[searchHistory.length - 1]);
    }

}

initPage();