const iconDisplay = document.querySelector(".weather-icon img");
const temperatureDisplayBox = document.querySelector(".temperature-value");
const temperatureDisplay = document.querySelector(".temperature-value p");
const temperatureDescription = document.querySelector(".temperature-description p");
const locationDisplay = document.querySelector(".location p");
const notificationDisplay = document.querySelector(".notification");
//API key
const apiKey = "000577dc5197ccd925222a4ab8efec8d";
// we get data in kelvin, so we need to convert it
const kelvin = 273.15;

//object where we store data about weather
const weather = {
    unit: "celsius"
}

//getting geolocation
if("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(success, error);
} else {
    notificationDisplay.style.display = "block";
    notificationDisplay.innerHTML = `<p>Browser Doesn't Support Geocation</p>`;
}

// getting geolocation - success
function success(position) {
    // collecting coordinates
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    // getting data and display
    getWeatherData(latitude, longitude);
}


// getting geolocation - error
function error(err) {
    notificationDisplay.style.display = "block";
    notificationDisplay.innerHTML = `<p>${err.message}</p>`;
}

// fetching data from weather API
function getWeatherData(latitude, longitude) {
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    fetch(apiURL)
        .then((res)=>{
            //data is in json format so I need to parse it
            const data = res.json();
            return data;
        })
        .then((data)=>{
            //collecting data to object
            weather.temperature = Math.floor(data.main.temp - kelvin);
            weather.description = data.weather[0].description;
            weather.icon = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(()=>{
            displayWeatherData();
        })
}


//this function will display data we stored in object
function displayWeatherData(){
    iconDisplay.src = `icons/${weather.icon}.png`;
    temperatureDisplay.innerHTML = `${weather.temperature} °<span>C</span>`;
    temperatureDescription.innerHTML = weather.description;
    locationDisplay.innerHTML = `${weather.city}, ${weather.country}`;
}

//change from celsius to fahrenheit and reverse
temperatureDisplayBox.addEventListener("click", ()=>{
    if(weather.unit === "celsius"){
        let fahrenheit = Math.floor(((weather.temperature * 9) / 5) +32);
        temperatureDisplay.innerHTML = `${fahrenheit} °<span>F</span>`;
        weather.unit = "fahrenheit";
    } else if (weather.unit === "fahrenheit"){
        temperatureDisplay.innerHTML = `${weather.temperature} °<span>C</span>`;
        weather.unit = "celsius";
    }
});
