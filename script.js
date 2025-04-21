// API Configuration
const API_KEY = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherInfo = document.getElementById('weatherInfo');
const errorMessage = document.getElementById('errorMessage');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weatherIcon');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const feelsLike = document.getElementById('feelsLike');
const pressure = document.getElementById('pressure');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');

// Weather icon mapping
const weatherIcons = {
    '01d': 'fas fa-sun',
    '01n': 'fas fa-moon',
    '02d': 'fas fa-cloud-sun',
    '02n': 'fas fa-cloud-moon',
    '03d': 'fas fa-cloud',
    '03n': 'fas fa-cloud',
    '04d': 'fas fa-cloud',
    '04n': 'fas fa-cloud',
    '09d': 'fas fa-cloud-rain',
    '09n': 'fas fa-cloud-rain',
    '10d': 'fas fa-cloud-sun-rain',
    '10n': 'fas fa-cloud-moon-rain',
    '11d': 'fas fa-bolt',
    '11n': 'fas fa-bolt',
    '13d': 'fas fa-snowflake',
    '13n': 'fas fa-snowflake',
    '50d': 'fas fa-smog',
    '50n': 'fas fa-smog'
};

// Event Listeners
searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});

async function getWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        if (response.ok) {
            displayWeather(data);
            updateBackground(data.weather[0].main);
        } else {
            showError(data.message || 'Error fetching weather data');
        }
    } catch (error) {
        showError('Error connecting to the weather service');
        console.error('Error:', error);
    }
}

function displayWeather(data) {
    // Hide error message if it was shown
    errorMessage.classList.add('hidden');
    
    // Update main weather information
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = data.weather[0].description;
    
    // Set weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.className = weatherIcons[iconCode] || 'fas fa-question';
    
    // Update detailed weather information
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${data.wind.speed} m/s`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    pressure.textContent = `${data.main.pressure} hPa`;
    
    // Convert Unix timestamps to readable time
    const sunriseTime = new Date(data.sys.sunrise * 1000);
    const sunsetTime = new Date(data.sys.sunset * 1000);
    
    sunrise.textContent = sunriseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    sunset.textContent = sunsetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Show weather information
    weatherInfo.classList.remove('hidden');
}

function updateBackground(weatherCondition) {
    const body = document.body;
    let gradient = '';
    
    switch(weatherCondition.toLowerCase()) {
        case 'clear':
            gradient = 'linear-gradient(135deg, #00b4db, #0083b0)';
            break;
        case 'clouds':
            gradient = 'linear-gradient(135deg, #6c7a89, #2c3e50)';
            break;
        case 'rain':
            gradient = 'linear-gradient(135deg, #4b6cb7, #182848)';
            break;
        case 'snow':
            gradient = 'linear-gradient(135deg, #e0e0e0, #b0bec5)';
            break;
        case 'thunderstorm':
            gradient = 'linear-gradient(135deg, #2c3e50, #000000)';
            break;
        default:
            gradient = 'linear-gradient(135deg, #00b4db, #0083b0)';
    }
    
    body.style.background = gradient;
}

function showError(message) {
    weatherInfo.classList.add('hidden');
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
} 