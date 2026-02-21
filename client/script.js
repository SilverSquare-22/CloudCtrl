document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const input = document.querySelector(".form-control");

  const errorLabel = document.createElement("div");
  errorLabel.className = "error-label";
  form.appendChild(errorLabel);

  const weatherBox = document.createElement("div");
  weatherBox.className = "weather-card";
  form.appendChild(weatherBox);

  function setBackgroundByWeather(mainWeather) {
    let gradient;

    switch (mainWeather.toLowerCase()) {
      case "clear":
        gradient = "linear-gradient(90deg, #f9d423, #ff4e50)";
        break;
      case "clouds":
        gradient = "linear-gradient(90deg, #bdc3c7, #2c3e50)";
        break;
      case "rain":
      case "drizzle":
        gradient = "linear-gradient(90deg, #4facfe, #00f2fe)";
        break;
      case "thunderstorm":
        gradient = "linear-gradient(90deg, #6441A5, #2a0845)";
        break;
      case "snow":
        gradient = "linear-gradient(90deg, #83a4d4, #b6fbff)";
        break;
      case "mist":
      case "fog":
      case "haze":
        gradient = "linear-gradient(90deg, #d7d2cc, #304352)";
        break;
      default:
        gradient = "linear-gradient(90deg, #7F00FF, #E100FF)";
    }

    document.body.style.backgroundImage = gradient;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = input.value.trim();

    errorLabel.style.display = "none";
    weatherBox.style.display = "none";

    if (!city) {
      errorLabel.textContent = "Please enter a city name.";
      errorLabel.style.display = "block";
      return;
    }

    try {
      const res = await fetch(`/api?city=${encodeURIComponent(city)}`);

      if (!res.ok) throw new Error("City not found");

      const data = await res.json();

      const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      const celsiusTemp = data.main.temp;
      const feelsLikeC = data.main.feels_like;
      const fahrenheitTemp = (celsiusTemp * 9 / 5 + 32).toFixed(1);
      const feelsLikeF = (feelsLikeC * 9 / 5 + 32).toFixed(1);

      weatherBox.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <img src="${icon}" alt="${data.weather[0].description}">
        <p class="weather-main">${data.weather[0].main} - ${data.weather[0].description}</p>
        <p>🌡 <strong>${celsiusTemp}°C / ${fahrenheitTemp}°F</strong> 
           (Feels like: ${feelsLikeC}°C / ${feelsLikeF}°F)</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>🌬 Wind: ${data.wind.speed} m/s</p>
      `;

      weatherBox.style.display = "block";
      weatherBox.classList.add("fade-in");

      setBackgroundByWeather(data.weather[0].main);

    } catch (err) {
      errorLabel.textContent = "City not found. Please check the name.";
      errorLabel.style.display = "block";
    }
  });
});