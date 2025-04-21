// API Configuration
const API_KEY = 'e625564bc0144c7ad01abe166f42baec'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherInfo = document.getElementById('weatherInfo');
const errorMessage = document.getElementById('errorMessage');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');

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
    
    // Update weather information
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `Temperature: ${Math.round(data.main.temp)}°C`;
    description.textContent = `Weather: ${data.weather[0].description}`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    wind.textContent = `Wind Speed: ${data.wind.speed} m/s`;

    // Show weather information
    weatherInfo.classList.remove('hidden');
}

function showError(message) {
    weatherInfo.classList.add('hidden');
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
} 