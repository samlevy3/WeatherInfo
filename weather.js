const inputField = document.querySelector('#input');
const submit = document.querySelector('#submit');
const responseField = document.querySelector('#responseField');
const image = document.querySelector('.image');
const url = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather'
const apiKey = '&appid=321f7bacdcf9dcb2c33b175133b1cac0';
const query = "?q=";

async function getWeather() {
    try {
	const city = inputField.value;
	const endpoint = '' + url + query + city + apiKey;
	const response = await fetch(endpoint, {mode: 'cors'});
	const jsonResponse = await response.json();
	if (response.ok) {
	    renderResponse(jsonResponse);
	} else {
	    renderError(jsonResponse);
	}
    } catch (err) {
	responseField.innterHtml = `<div>${err}</div>`;
    }
}

const displayWeather = (event) => {
  event.preventDefault();
  while(responseField.firstChild){
      responseField.removeChild(responseField.firstChild);
  }
  getWeather();
}

function renderResponse(response) {
    try {
	let offset = response.timezone;
	let time = getTime(offset);
	let timeHours = time.getHours();
	let sunrise = getSunTime(response.sys.sunrise + offset);
	let sunset = getSunTime(response.sys.sunset + offset);
	if (timeHours >= sunrise.getHours() && timeHours <= 17) {
	    image.style.backgroundImage = "url('images/day.jpg')";
	} else if (timeHours > 17 && timeHours <= sunset.getHours()){
	    image.style.backgroundImage = "url('images/evening.jpg')";
	} else {
	    image.style.backgroundImage = "url('images/night.jpg')";
	}
	responseField.innerHTML = `<div>Temperature in ${response.name} is ${convertTemp(response.main.temp)} \xB0F. <br> 
The time is: ${time.toLocaleTimeString()}<img src=https://openweathermap.org/img/wn/${response.weather[0].icon}@4x.png width=200px height=200px></div>`;	
    } catch (error) {
	responseField.innerHTML = `<div>${error}</div>`;
    }
}

function renderError(error) {
    responseField.innerHTML = `<p>Error: ${error.message}</p>`;
}

function convertTemp(temp) {
    return Math.round((temp - 273.15) * 9/5 + 32);
}

function getTime(utcOffset) {
    let date = new Date(Date.now());
    let offset = date.getTimezoneOffset() * 60000;
    let utcDate = new Date(Date.now() + offset + utcOffset * 1000);
    return utcDate;
}

function getSunTime(utcTime) {
    let time = new Date()
    let offset = time.getTimezoneOffset() * 60000;
    return new Date(utcTime * 1000 + offset);
}

submit.addEventListener('click', displayWeather);
