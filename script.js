document.addEventListener('DOMContentLoaded', () => {
  const cityInput = document.getElementById("city-input");
  const getWeather = document.getElementById("get-weather-btn");
  const weatherInfo = document.getElementById("weather-info");
  const cityNameDisplay = document.getElementById("city-name");
  const temperatureDisplay = document.getElementById("temperature");
  const descriptionDisplay = document.getElementById("description");
  const errorMessage = document.getElementById("error-message");
  const APIKey = "48f323e7b8abb7a06d17dd2c1f0073d8";
  getWeather.addEventListener("click", async () => { 
    const city = cityInput.value.trim();
    if (!city) {
      return;
    }
    try {
      const data = await fetchWeatherData(city);
      displayWeatherData(data);

    } catch (error) {
      showError();
    }


  });
  async function fetchWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`;
    const response = await fetch(url);
    console.log(typeof response);
    console.log("RESPONSE", response);
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    return data;
  }
  function displayWeatherData(data) {
    console.log(data);
    const { name, main, weather } = data;
    cityNameDisplay.textContent = name;
    temperatureDisplay.textContent = `${main.temp} °C`;
    descriptionDisplay.textContent = weather[0].description;
    weatherInfo.classList.remove('hidden');
    errorMessage.classList.add('hidden');
  
    
  }
  function showError() {
    weatherInfo.classList.add('hidden');
    errorMessage.classList.remove('hidden');
    
  }

  

});