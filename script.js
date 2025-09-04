const apiKey = "09f62f22ff78231e927dc46b18e24fc6"; 

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const weatherResult = document.getElementById("weatherResult");

  if (!city) {
    weatherResult.innerHTML = "<p>Please enter a city name!</p>";
    return;
  }

  weatherResult.innerHTML = "<p>Loading...</p>";

  try {
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!weatherResponse.ok) {
      weatherResult.innerHTML = "<p>City not found ❌</p>";
      return;
    }

    const weatherData = await weatherResponse.json();

    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );

    const forecastData = await forecastResponse.json();

    // Pick 3 days (12:00:00 entries)
    const dailyForecasts = forecastData.list
      .filter(f => f.dt_txt.includes("12:00:00"))
      .slice(0, 3);


    let resultHTML = `
      <h2>${weatherData.name}, ${weatherData.sys.country}</h2>
      <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="Weather Icon">
      <p><strong>${weatherData.main.temp}°C</strong></p>
      <p>${weatherData.weather[0].description}</p>
      <p>Humidity: ${weatherData.main.humidity}% | Wind: ${weatherData.wind.speed} m/s</p>
      <hr>
      <h3>3-Day Forecast 🌤</h3>
      <div class="forecast">
    `;

    dailyForecasts.forEach(day => {
      const date = new Date(day.dt_txt).toDateString();
      const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

      resultHTML += `
        <div class="forecast-day">
          <p><strong>${date}</strong></p>
          <img src="${icon}" alt="Forecast Icon">
          <p>${day.main.temp}°C</p>
          <p>${day.weather[0].description}</p>
        </div>
      `;
    });

    resultHTML += "</div>";
    weatherResult.innerHTML = resultHTML;

  } catch (error) {
    weatherResult.innerHTML = "<p>Something went wrong 😢</p>";
    console.error(error);
  }
}
