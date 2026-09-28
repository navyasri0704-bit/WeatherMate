let currentWeather = null;
let latitude = null;
let longitude = null;
let cityName = "";
let liveRefreshTimer = null;
let lastSearchQuery = "";
let liveClockTimer = null;
const LIVE_REFRESH_MS = 60 * 1000;


window.onload = () => {
    document.getElementById("locationName").textContent = "Search a location";
    document.getElementById("app").classList.add("hidden");
    document.getElementById("loading").classList.add("hidden");
};

async function searchLocation() {
    const input = document.getElementById("locationSearch");
    const status = document.getElementById("searchStatus");
    const query = input.value.trim();
    lastSearchQuery = query;

    if (!query) {
        status.textContent = "Please enter a city or location.";
        return;
    }

    status.textContent = "Searching for " + query + "...";
    document.getElementById("app").classList.add("hidden");
    currentWeather = null;
    document.getElementById("loading").classList.remove("hidden");

    try {
        const geoUrl =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;

        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("Location not found");
        }

        // Prefer a result whose name closely matches the typed city.
        const lowerQuery = query.toLowerCase();
        const result =
            geoData.results.find(r => r.name.toLowerCase() === lowerQuery) ||
            geoData.results[0];

        latitude = result.latitude;
        longitude = result.longitude;

        cityName = [
            result.name,
            result.admin1,
            result.country
        ].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(", ");

        document.getElementById("locationName").textContent = cityName;

        await getCurrentWeather();

        startLiveRefresh();

        status.textContent = "Current weather for " + cityName;
    } catch (error) {
        console.error(error);
        document.getElementById("loading").classList.add("hidden");
        document.getElementById("app").classList.add("hidden");
        status.textContent = "Location not found. Please try another city.";
    }
}



function updateHeroLiveTime() {
    const hero = document.getElementById("todayDate");
    if (!hero || !currentWeather) return;

    const now = new Date();
    hero.textContent =
        "Current • Updated " + now.toLocaleString([], {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
}

function updateLiveTime() {
    updateHeroLiveTime();
    const el = document.getElementById("liveUpdateTime");
    if (!el) return;

    if (currentWeather) {
        const now = new Date();
        el.textContent =
            "🔴 Live • Updated: " + now.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            });
    } else {
        el.textContent = "Live weather updates";
    }
}

function startLiveRefresh() {
    if (liveRefreshTimer) {
        clearInterval(liveRefreshTimer);
    }

    liveRefreshTimer = setInterval(async () => {
        const toggle = document.getElementById("liveToggle");

        if (!toggle || !toggle.checked || !latitude || !longitude) {
            return;
        }

        try {
            await getCurrentWeather(true);
        } catch (error) {
            console.error("Live weather update failed:", error);
        }
    }, LIVE_REFRESH_MS);
}

async function getCurrentWeather(silentUpdate = false) {
    // Current conditions are requested directly for the coordinates
    // returned by the location search. No default city or daily
    // temperature is used.
    const weatherUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m` +
        `&hourly=temperature_2m,precipitation_probability,weather_code` +`&past_days=1` +
        `&timezone=auto`;

    const response = await fetch(weatherUrl);
    if (!response.ok) throw new Error("Weather service unavailable");

    const data = await response.json();
    currentWeather = data;

    displayCurrentWeather(data);
    generateCurrentDetails(data);
    generateHourlyForecast(data);
    generateWeatherComparison(data);
    updateLiveMap();
    updateLiveAirQuality();

    document.getElementById("loading").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    updateLiveTime();

    if (!silentUpdate) {
        document.getElementById("searchStatus").textContent =
            "🔴 Live weather • Updated " + new Date().toLocaleTimeString();
    } else {
        document.getElementById("searchStatus").textContent =
            "🔴 Live • Updated " + new Date().toLocaleTimeString();
    }
}
function displayCurrentWeather(data) {
    const c = data.current;

    // Use the API's actual current temperature field.
const currentTemp = Number(c.temperature_2m);
document.getElementById("temperature").textContent =
        Number.isFinite(currentTemp) ? currentTemp.toFixed(1) : "--";

    document.getElementById("feelsLike").textContent =
        Math.round(c.apparent_temperature);

    document.getElementById("humidity").textContent =
        c.relative_humidity_2m + "%";

    document.getElementById("wind").textContent =
        Math.round(c.wind_speed_10m) + " km/h";

    // This card is now current precipitation, not a forecast percentage.
    document.getElementById("rainChance").textContent =
        Number(c.precipitation || 0).toFixed(1) + " mm";

    document.getElementById("uv").textContent = "--";
    document.getElementById("uvLarge").textContent = "--";

    const liveNow = new Date();

document.getElementById("todayDate").textContent =
        "Current • Updated " + liveNow.toLocaleString([], {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });

    document.getElementById("weatherDescription").textContent =
        getWeatherDescription(c.weather_code);

    // Update the main weather icon from the actual current WMO code.
    const icon = document.querySelector(".weather-icon");
    icon.textContent = getWeatherIcon(c.weather_code, c.is_day);
}
function getWeatherDescription(code) {
    if (code === 0) return "Clear Sky ☀️";
    if (code <= 3) return "Partly Cloudy 🌤️";
    if (code <= 48) return "Cloudy ☁️";
    if (code <= 67) return "Rainy 🌧️";
    if (code <= 77) return "Snowy ❄️";
    if (code <= 82) return "Rain Showers 🌦️";
    if (code >= 95) return "Thunderstorm ⛈️";
    return "Mixed Weather";
}

function getWeatherIcon(code, isDay) {
    if (code === 0) return isDay ? "☀️" : "🌙";
    if (code <= 3) return isDay ? "🌤️" : "☁️";
    if (code <= 48) return "☁️";
    if (code <= 67) return "🌧️";
    if (code <= 77) return "❄️";
    if (code <= 82) return "🌦️";
    if (code >= 95) return "⛈️";
    return "🌤️";
}

function generateCurrentDetails(data) {
    const c = data.current;
    const temp = Number(c.temperature_2m);
    const feels = Number(c.apparent_temperature);
    const rain = Number(c.precipitation || 0);
    const humidity = Number(c.relative_humidity_2m);

    document.getElementById("rainAdvice").textContent =
        rain > 0 ? `🌧️ Rain now: ${rain.toFixed(1)} mm` : "☀️ No current precipitation";

    document.getElementById("outfitAdvice").textContent =
        `🌡️ ${temp.toFixed(1)}°C now • Feels like ${feels.toFixed(1)}°C`;

    document.getElementById("activityAdvice").textContent =
        rain > 0 ? "🌧️ Outdoor activity may be affected by current rain." :
        temp >= 35 ? "🥵 It is currently hot; choose a cooler time." :
        "😊 Current conditions are suitable for outdoor activity.";

    const outfitTitle = document.getElementById("outfitTitle");
    const outfitDetails = document.getElementById("outfitDetails");

    if (rain > 0) {
        outfitTitle.textContent = "Rain-Ready Outfit";
        outfitDetails.textContent = `Current temperature ${temp.toFixed(1)}°C. Carry an umbrella and wear comfortable weather-appropriate clothing.`;
    } else if (temp >= 35) {
        outfitTitle.textContent = "Hot Weather Outfit";
        outfitDetails.textContent = `Current temperature ${temp.toFixed(1)}°C. Choose light, breathable clothing and stay hydrated.`;
    } else if (temp >= 28) {
        outfitTitle.textContent = "Light Summer Outfit";
        outfitDetails.textContent = `Current temperature ${temp.toFixed(1)}°C. Light, breathable clothing should be comfortable.`;
    } else {
        outfitTitle.textContent = "Comfortable Outfit";
        outfitDetails.textContent = `Current temperature ${temp.toFixed(1)}°C. Comfortable casual clothing should be suitable.`;
    }

    const status = document.getElementById("activityStatus");
    const emoji = document.getElementById("activityEmoji");
    const text = document.getElementById("activityText");

    if (rain > 0) {
        status.textContent = "Rain Now";
        status.style.color = "#e53935";
        emoji.textContent = "🌧️";
        text.textContent = `Current temperature is ${temp.toFixed(1)}°C. Rain is currently reported.`;
    } else if (temp >= 35) {
        status.textContent = "Very Warm";
        status.style.color = "#e67e22";
        emoji.textContent = "🥵";
        text.textContent = `It is currently ${temp.toFixed(1)}°C. Avoid intense outdoor activity.`;
    } else {
        status.textContent = "Good";
        status.style.color = "#238636";
        emoji.textContent = "😊";
        text.textContent = `It is currently ${temp.toFixed(1)}°C with ${humidity}% humidity.`;
    }
}

function generateHourlyForecast(data) {
    const container = document.getElementById("hourlyForecast");
    container.innerHTML = "";

    // The first hourly values are for the selected location only.
    for (let i = 0; i < Math.min(12, data.hourly.time.length); i++) {
        const time = new Date(data.hourly.time[i]).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });

        const rain = data.hourly.precipitation_probability[i];
        const temperature = Math.round(data.hourly.temperature_2m[i]);

        const card = document.createElement("div");
        card.className = "hour-card";

        card.innerHTML = `
            <div>${time}</div>
            <strong>${temperature}°C</strong>
            <div>${getWeatherIcon(data.hourly.weather_code[i], true)}</div>
            <div>${rain}% rain chance</div>
        `;

        container.appendChild(card);
    }
}


function generateWeatherComparison(data) {
    const hourly = data.hourly;

    if (!hourly || !hourly.time || !hourly.temperature_2m) {
        document.getElementById("yesterdayTemp").textContent = "--";
        document.getElementById("todayTemp").textContent = "--";
        document.getElementById("temperatureDifference").textContent = "Data unavailable";
        return;
    }

    // Find the hourly record closest to the API's current observation time.
    const currentTime = new Date(data.current.time).getTime();

    let currentIndex = 0;
    let smallestDifference = Infinity;

    hourly.time.forEach((time, index) => {
        const difference = Math.abs(new Date(time).getTime() - currentTime);
        if (difference < smallestDifference) {
            smallestDifference = difference;
            currentIndex = index;
        }
    });

    // The API has one full previous day because past_days=1 was requested.
    // Find the value exactly 24 hours before the current observation.
    const yesterdayTarget = currentTime - (24 * 60 * 60 * 1000);

    let yesterdayIndex = -1;
    smallestDifference = Infinity;

    hourly.time.forEach((time, index) => {
        const difference = Math.abs(new Date(time).getTime() - yesterdayTarget);
        if (difference < smallestDifference) {
            smallestDifference = difference;
            yesterdayIndex = index;
        }
    });

    const currentTemp = Number(hourly.temperature_2m[currentIndex]);
    const yesterdayTemp =
        yesterdayIndex >= 0 ? Number(hourly.temperature_2m[yesterdayIndex]) : NaN;

    document.getElementById("todayTemp").textContent =
        Number.isFinite(currentTemp) ? currentTemp.toFixed(1) : "--";

    document.getElementById("yesterdayTemp").textContent =
        Number.isFinite(yesterdayTemp) ? yesterdayTemp.toFixed(1) : "--";

    if (Number.isFinite(currentTemp) && Number.isFinite(yesterdayTemp)) {
        const difference = currentTemp - yesterdayTemp;

        if (Math.abs(difference) < 0.05) {
            document.getElementById("temperatureDifference").textContent =
                "Almost the same";
        } else if (difference > 0) {
            document.getElementById("temperatureDifference").textContent =
                `${difference.toFixed(1)}°C warmer`;
        } else {
            document.getElementById("temperatureDifference").textContent =
                `${Math.abs(difference).toFixed(1)}°C cooler`;
        }
    } else {
        document.getElementById("temperatureDifference").textContent =
            "Comparison unavailable";
    }
}

async function updateLiveAirQuality() {
    if (latitude === null || longitude === null) return;
    try {
        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone&timezone=auto`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("AQI unavailable");
        const data = await response.json();
        const aqi = Number(data.current.us_aqi);
        document.getElementById("aqi").textContent = Number.isFinite(aqi) ? Math.round(aqi) : "--";
        document.getElementById("aqiStatus").textContent =
            !Number.isFinite(aqi) ? "Live AQI unavailable" :
            aqi <= 50 ? "Good" :
            aqi <= 100 ? "Moderate" :
            aqi <= 150 ? "Unhealthy for sensitive groups" : "Unhealthy";

        const uvUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=uv_index&forecast_days=1&timezone=auto`;
        const uvResponse = await fetch(uvUrl);
        const uvData = await uvResponse.json();
        const now = Date.now();
        let best = 0, bestDiff = Infinity;
        uvData.hourly.time.forEach((time, i) => {
            const diff = Math.abs(new Date(time).getTime() - now);
            if (diff < bestDiff) { bestDiff = diff; best = Number(uvData.hourly.uv_index[i]); }
        });
        document.getElementById("uv").textContent = Number.isFinite(best) ? best.toFixed(1) : "--";
        document.getElementById("uvLarge").textContent = Number.isFinite(best) ? best.toFixed(1) : "--";
        document.getElementById("uvStatus").textContent =
            best <= 2 ? "Low" : best <= 5 ? "Moderate" : best <= 7 ? "High" : best <= 10 ? "Very high" : "Extreme";
    } catch (e) {
        document.getElementById("aqi").textContent = "--";
        document.getElementById("aqiStatus").textContent = "Live AQI unavailable";
    }
}

function updateLiveMap() {
    const map = document.getElementById("weatherMap");
    if (!map || latitude === null || longitude === null) return;
    const d = 0.12;
    map.src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-d}%2C${latitude-d}%2C${longitude+d}%2C${latitude+d}&layer=mapnik&marker=${latitude}%2C${longitude}`;
}

function handleEnter(event) {
    if (event.key === "Enter") {
        searchLocation();
    }
}

document.addEventListener("change", (event) => {
    if (event.target && event.target.id === "liveToggle") {
        if (event.target.checked) {
            startLiveRefresh();
            if (latitude && longitude) {
                getCurrentWeather(true).catch(console.error);
            }
        } else if (liveRefreshTimer) {
            clearInterval(liveRefreshTimer);
            liveRefreshTimer = null;
            document.getElementById("searchStatus").textContent =
                "Live updates paused.";
        }
    }
});

if (!liveClockTimer) { liveClockTimer = setInterval(updateLiveTime, 1000); }

if (!window.heroClockTimer) { window.heroClockTimer = setInterval(updateHeroLiveTime, 1000); }
