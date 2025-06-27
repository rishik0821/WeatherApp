// Modern Weather App JavaScript

class WeatherApp {
  constructor() {
    this.apiKey = "48f323e7b8abb7a06d17dd2c1f0073d8";
    this.baseUrl = "https://api.openweathermap.org/data/2.5/weather";
    this.currentParticleSystem = null;
    this.elements = {};
    this.init();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 60000); // Update every minute
  }

  cacheElements() {
    this.elements = {
      cityInput: document.getElementById("city-input"),
      searchBtn: document.getElementById("search-btn"),
      weatherDisplay: document.getElementById("weather-display"),
      errorMessage: document.getElementById("error-message"),
      loading: document.getElementById("loading"),
      cityName: document.getElementById("city-name"),
      dateTime: document.getElementById("date-time"),
      weatherIcon: document.getElementById("weather-icon"),
      temperature: document.getElementById("temperature"),
      description: document.getElementById("description"),
      feelsLike: document.getElementById("feels-like"),
      humidity: document.getElementById("humidity"),
      windSpeed: document.getElementById("wind-speed"),
      uvIndex: document.getElementById("uv-index"),
      sunrise: document.getElementById("sunrise"),
      sunset: document.getElementById("sunset"),
      particles: document.getElementById("particles"),
    };
  }

  bindEvents() {
    this.elements.searchBtn.addEventListener("click", () =>
      this.handleSearch()
    );
    this.elements.cityInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.handleSearch();
    });
    this.elements.cityInput.addEventListener("input", () => this.clearError());
  }

  updateDateTime() {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    this.elements.dateTime.textContent = now.toLocaleDateString(
      "en-US",
      options
    );
  }

  async handleSearch() {
    const city = this.elements.cityInput.value.trim();
    if (!city) return;

    try {
      this.showLoading();
      this.clearError();

      const weatherData = await this.fetchWeatherData(city);
      this.displayWeatherData(weatherData);
      this.applyWeatherTheme(weatherData);
    } catch (error) {
      console.error("Weather fetch error:", error);
      this.showError();
    }
  }

  async fetchWeatherData(city) {
    const response = await fetch(
      `${this.baseUrl}?q=${city}&appid=${this.apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather data not found for ${city}`);
    }

    return await response.json();
  }

  displayWeatherData(data) {
    const {
      name,
      main: { temp, feels_like, humidity },
      weather: [{ main: weatherMain, description, icon }],
      wind: { speed },
      sys: { sunrise, sunset },
    } = data;

    // Update weather display
    this.elements.cityName.textContent = name;
    this.elements.temperature.textContent = `${Math.round(temp)}°`;
    this.elements.description.textContent = description;
    this.elements.feelsLike.textContent = `${Math.round(feels_like)}°C`;
    this.elements.humidity.textContent = `${humidity}%`;
    this.elements.windSpeed.textContent = `${Math.round(speed * 3.6)} km/h`;

    // Weather icon
    this.elements.weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    this.elements.weatherIcon.alt = description;

    // Sun times
    this.elements.sunrise.textContent = this.formatTime(sunrise);
    this.elements.sunset.textContent = this.formatTime(sunset);

    // UV Index (placeholder - would need additional API call)
    this.elements.uvIndex.textContent = this.calculateUVIndex(
      temp,
      weatherMain
    );

    this.hideLoading();
    this.elements.weatherDisplay.classList.remove("hidden");
  }

  formatTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  calculateUVIndex(temp, weatherMain) {
    // Simple UV index estimation based on weather conditions
    if (weatherMain === "Clear" && temp > 20) return "High";
    if (weatherMain === "Clear" && temp > 10) return "Moderate";
    if (weatherMain === "Clouds") return "Low";
    return "Very Low";
  }

  applyWeatherTheme(data) {
    const weatherMain = data.weather[0].main.toLowerCase();
    const isDay = this.isDayTime(data.sys.sunrise, data.sys.sunset);

    // Clear existing theme
    document.body.className = "";

    // Apply new theme
    switch (weatherMain) {
      case "clear":
        document.body.classList.add("sunny");
        this.createSunParticles();
        break;
      case "rain":
      case "drizzle":
        document.body.classList.add("rainy");
        this.createRainParticles();
        break;
      case "snow":
        document.body.classList.add("snowy");
        this.createSnowParticles();
        break;
      case "clouds":
        document.body.classList.add("cloudy");
        break;
      case "thunderstorm":
        document.body.classList.add("thunderstorm");
        this.createRainParticles();
        this.createLightningEffect();
        break;
      default:
        document.body.classList.add("sunny");
    }
  }

  isDayTime(sunrise, sunset) {
    const now = Date.now() / 1000;
    return now >= sunrise && now < sunset;
  }

  createRainParticles() {
    this.clearParticles();

    this.currentParticleSystem = setInterval(() => {
      const particle = document.createElement("div");
      particle.className = "particle-rain";
      particle.style.left = Math.random() * 100 + "vw";
      particle.style.animationDuration = Math.random() * 0.5 + 0.5 + "s";
      particle.style.opacity = Math.random() * 0.6 + 0.4;

      this.elements.particles.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 1000);
    }, 50);
  }

  createSnowParticles() {
    this.clearParticles();
    const snowflakes = ["❄", "❅", "❆", "✦", "✧", "✩"];

    this.currentParticleSystem = setInterval(() => {
      const particle = document.createElement("div");
      particle.className = "particle-snow";
      particle.textContent =
        snowflakes[Math.floor(Math.random() * snowflakes.length)];
      particle.style.left = Math.random() * 100 + "vw";
      particle.style.animationDuration = Math.random() * 2 + 2 + "s";
      particle.style.fontSize = Math.random() * 8 + 12 + "px";
      particle.style.opacity = Math.random() * 0.8 + 0.2;

      this.elements.particles.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 4000);
    }, 200);
  }

  createSunParticles() {
    this.clearParticles();

    // Create floating sun particles
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const particle = document.createElement("div");
        particle.className = "particle-sun";
        particle.style.left = Math.random() * 100 + "vw";
        particle.style.top = Math.random() * 70 + 15 + "vh";
        particle.style.animationDelay = Math.random() * 2 + "s";
        particle.style.animationDuration = Math.random() * 2 + 3 + "s";

        this.elements.particles.appendChild(particle);

        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, 8000);
      }, i * 300);
    }
  }

  createLightningEffect() {
    // Create occasional lightning flashes
    const createFlash = () => {
      if (Math.random() < 0.3) {
        const flash = document.createElement("div");
        flash.style.position = "fixed";
        flash.style.top = "0";
        flash.style.left = "0";
        flash.style.width = "100vw";
        flash.style.height = "100vh";
        flash.style.background = "rgba(255, 255, 255, 0.9)";
        flash.style.zIndex = "1000";
        flash.style.pointerEvents = "none";
        flash.style.opacity = "0";
        flash.style.transition = "opacity 0.1s ease";

        document.body.appendChild(flash);

        setTimeout(() => {
          flash.style.opacity = "1";
          setTimeout(() => {
            flash.style.opacity = "0";
            setTimeout(() => {
              if (flash.parentNode) {
                flash.parentNode.removeChild(flash);
              }
            }, 100);
          }, 100);
        }, 10);
      }
    };

    // Random lightning flashes
    const lightningTimer = setInterval(
      createFlash,
      Math.random() * 5000 + 2000
    );

    // Clear after 30 seconds
    setTimeout(() => clearInterval(lightningTimer), 30000);
  }

  clearParticles() {
    if (this.currentParticleSystem) {
      clearInterval(this.currentParticleSystem);
      this.currentParticleSystem = null;
    }
    this.elements.particles.innerHTML = "";
  }

  showLoading() {
    this.elements.loading.classList.remove("hidden");
    this.elements.weatherDisplay.classList.add("hidden");
    this.elements.searchBtn.disabled = true;
  }

  hideLoading() {
    this.elements.loading.classList.add("hidden");
    this.elements.searchBtn.disabled = false;
  }

  showError() {
    this.hideLoading();
    this.elements.weatherDisplay.classList.add("hidden");
    this.elements.errorMessage.classList.remove("hidden");

    // Clear theme and particles
    document.body.className = "";
    this.clearParticles();

    // Auto-hide error after 5 seconds
    setTimeout(() => {
      this.elements.errorMessage.classList.add("hidden");
    }, 5000);
  }

  clearError() {
    this.elements.errorMessage.classList.add("hidden");
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new WeatherApp();
});

// Enhanced interactions for all devices
document.addEventListener("DOMContentLoaded", () => {
  // Detect if device supports hover (desktop vs mobile)
  const supportsHover = window.matchMedia("(hover: hover)").matches;

  // Add appropriate interactions for cards
  const cards = document.querySelectorAll(
    ".detail-card, .main-weather-card, .sun-times-card"
  );
  cards.forEach((card) => {
    if (supportsHover) {
      // Desktop hover effects
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-2px) scale(1.02)";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0) scale(1)";
      });
    } else {
      // Mobile touch effects
      card.addEventListener("touchstart", () => {
        card.style.transform = "scale(0.98)";
      });

      card.addEventListener("touchend", () => {
        setTimeout(() => {
          card.style.transform = "scale(1)";
        }, 150);
      });
    }
  });

  // Enhanced search button with touch support
  const searchBtn = document.getElementById("search-btn");

  // Ripple effect for all interactions
  const createRipple = (e) => {
    const ripple = document.createElement("span");
    const rect = searchBtn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.position = "absolute";
    ripple.style.borderRadius = "50%";
    ripple.style.background = "rgba(255, 255, 255, 0.6)";
    ripple.style.transform = "scale(0)";
    ripple.style.animation = "ripple 0.6s linear";
    ripple.style.width = size + "px";
    ripple.style.height = size + "px";
    ripple.style.left = "50%";
    ripple.style.top = "50%";
    ripple.style.marginLeft = -(size / 2) + "px";
    ripple.style.marginTop = -(size / 2) + "px";

    searchBtn.style.position = "relative";
    searchBtn.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  };

  searchBtn.addEventListener("click", createRipple);
  searchBtn.addEventListener("touchstart", createRipple);

  // Touch feedback for search button
  if (!supportsHover) {
    searchBtn.addEventListener("touchstart", () => {
      searchBtn.style.transform = "scale(0.95)";
    });

    searchBtn.addEventListener("touchend", () => {
      setTimeout(() => {
        searchBtn.style.transform = "scale(1)";
      }, 150);
    });
  }

  // Improve input focus on mobile
  const cityInput = document.getElementById("city-input");
  cityInput.addEventListener("focus", () => {
    // Scroll input into view on mobile keyboards
    setTimeout(() => {
      cityInput.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  });

  // Handle viewport changes (mobile keyboard)
  let initialViewportHeight = window.innerHeight;
  window.addEventListener("resize", () => {
    // Detect if keyboard is open (viewport height significantly reduced)
    const currentHeight = window.innerHeight;
    const heightDifference = initialViewportHeight - currentHeight;

    if (heightDifference > 150) {
      // Keyboard is likely open - adjust layout
      document.body.style.height = currentHeight + "px";
    } else {
      // Keyboard closed - restore layout
      document.body.style.height = "auto";
    }
  });
});

// Add ripple animation keyframes
const style = document.createElement("style");
style.textContent = `
  @keyframes ripple {
      to {
          transform: scale(4);
          opacity: 0;
      }
  }
`;
document.head.appendChild(style);
