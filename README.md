# 🌦️ WeatherMate — Smart Live Weather Dashboard

> **WeatherMate** is a modern, responsive and interactive weather dashboard that provides real-time weather information, hourly forecasts, air-quality data, UV index, smart outfit recommendations, activity suggestions and location-based weather visualization — all in one place.

---

## ✨ Live Weather. Smart Insights. Better Decisions.

WeatherMate is designed to make weather information **simple, visual and useful**.

Instead of displaying only temperature and weather conditions, WeatherMate provides additional insights such as:

- 🌡️ Current temperature
- 💧 Humidity
- 🌬️ Wind speed
- 🌧️ Current precipitation
- 🕐 Live hourly weather
- 👕 Smart outfit suggestions
- 🏃 Daily activity recommendations
- 🌿 Air Quality Index
- ☀️ UV Index
- 🗺️ Live weather map
- ⚠️ Weather alerts
- 📊 Today vs Yesterday comparison
- 🔴 Automatic live weather updates

---

## 🎯 Project Objective

The main objective of WeatherMate is to create a **simple and user-friendly weather platform** that goes beyond basic weather information.

The application collects live weather information based on the user's searched location and converts the data into useful recommendations that can help users decide:

> **What is the weather like? What should I wear? Can I go outside? Is the air quality safe? What is happening around my location?**

---

## 🚀 Features

### 🌡️ 1. Live Current Weather

Search for any supported city or location and view its current weather conditions.

Displays:

- Current temperature
- Feels-like temperature
- Humidity
- Wind speed
- Precipitation
- Weather condition
- Day/Night indicator
- Last updated time

---

### 🔎 2. Location Search

Users can search for a city or location using the search bar.

The application uses location coordinates returned by the geocoding service and loads weather information specifically for the selected location.

**Example:**

```text
Sattenapalle
Hyderabad
Bengaluru
Chennai
Delhi
Mumbai
```

Press **Enter** or click **Search** to load the weather.

---

### 🔴 3. Live Weather Updates

WeatherMate includes a Live Mode.

When Live Mode is enabled:

```text
Weather Data
     ↓
Selected Location
     ↓
Live API Request
     ↓
Weather Dashboard Updated
```

The application automatically refreshes the selected location's weather every **60 seconds**.

Users can also pause live updates whenever required.

---

### 🕐 4. Live Hourly Timeline

WeatherMate displays hourly weather information including:

- Time
- Temperature
- Weather condition
- Rain probability

This allows users to understand how the weather is expected to change throughout the upcoming hours.

---

### 👕 5. Smart Outfit Suggestion

WeatherMate converts current weather conditions into simple clothing recommendations.

For example:

```text
🌧️ Rain
↓
Rain-Ready Outfit

🌡️ High Temperature
↓
Hot Weather Outfit

☀️ Warm Weather
↓
Light Summer Outfit

🌤️ Comfortable Conditions
↓
Comfortable Outfit
```

The recommendation considers:

- Current temperature
- Feels-like temperature
- Current precipitation

---

### 🏃 6. Daily Activity Advisor

The Activity Advisor analyzes current weather conditions and provides an easy-to-understand activity recommendation.

Examples:

```text
😊 Good
Current conditions are suitable for outdoor activity.
```

```text
🌧️ Rain Now
Outdoor activity may be affected by current rain.
```

```text
🥵 Very Warm
Avoid intense outdoor activity during very hot conditions.
```

---

### 🌿 7. Air Quality & UV Index

WeatherMate provides live environmental information for the selected location.

#### Air Quality

Displays:

- US AQI
- Air quality status

#### UV Index

Displays:

- Current/nearest UV value
- UV risk level

Possible UV levels include:

```text
Low
Moderate
High
Very High
Extreme
```

---

### 🗺️ 8. Live Weather Map

WeatherMate includes an interactive location map.

The map automatically updates according to the searched location.

The selected coordinates are used to display the location marker.

---

### ⚠️ 9. Weather Alerts

The dashboard provides a dedicated weather-alert section so users can quickly identify important weather information.

---

### 📊 10. Today vs Yesterday Comparison

WeatherMate compares the selected location's temperature with the corresponding time from the previous day.

This helps users understand whether the current temperature is:

- Higher
- Lower
- Similar

to the previous day's temperature.

---
## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| 🟧 HTML5 | Website structure |
| 🎨 CSS3 | Styling and responsive UI |
| 🟨 JavaScript | Application logic and API integration |
| 🌤️ Open-Meteo API | Weather and forecast data |
| 📍 Open-Meteo Geocoding API | Location search |
| 🌿 Open-Meteo Air Quality API | Air quality information |
| 🗺️ OpenStreetMap | Weather location map |
| ⭐ Font Awesome | Icons |
| 💻 VS Code | Development environment |

---

## 🏗️ Project Architecture

```text
                    ┌─────────────────────┐
                    │      WeatherMate    │
                    │     Web Interface   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Location Search   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Geocoding API       │
                    │ City → Coordinates  │
                    └──────────┬──────────┘
                               │
                               ▼
              ┌─────────────────────────────────┐
              │        Weather Services         │
              ├─────────────────────────────────┤
              │ Current Weather                 │
              │ Hourly Forecast                 │
              │ Air Quality                     │
              │ UV Index                        │
              └───────────────┬─────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ JavaScript Analysis │
                    ├─────────────────────┤
                    │ Outfit Suggestion   │
                    │ Activity Advisor    │
                    │ Weather Comparison  │
                    │ Weather Alerts      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  WeatherMate UI     │
                    │ Live Dashboard      │
                    └─────────────────────┘
```

---

## 📂 Project Structure

```text
WeatherMate/
│
├── index.html
│
├── style.css
│
├── script.js
│
└── README.md

## Run
Open `index.html` in a browser, preferably with VS Code Live Server.

```

## 🌐 Internet Requirement

WeatherMate requires an internet connection because the application retrieves live information from external APIs.

The main services used are:

- Open-Meteo Weather API
- Open-Meteo Geocoding API
- Open-Meteo Air Quality API
- OpenStreetMap

---

## 🔐 Privacy

WeatherMate does not require:

- User registration
- Passwords
- Personal profiles
- Payment information
- A database

The application works directly with publicly accessible weather services.

---

## 🚧 Future Enhancements

Possible future improvements include:

- 🌍 Multi-city weather comparison
- 🔔 Browser weather notifications
- 🌧️ Severe weather notifications
- 📅 7-day forecast
- 🌡️ Temperature charts
- 🌙 Automatic dark mode
- 📍 Browser-based current location
- ⭐ Favorite locations
- 📊 Weather history
- 🎙️ Voice-based weather queries
- 📱 Progressive Web App support
- 🌐 Multi-language support

---

## 🎓 Project Use Case

WeatherMate can be used as:

- 🎓 College mini project
- 💻 Frontend development project
- 🌐 JavaScript project
- 🌤️ API integration project
- 📱 Responsive web application
- 🧑‍💻 Portfolio project
- 🚀 GitHub showcase project

---

## 📄 License

This project is created for educational and portfolio purposes.

---

### 🌦️ WeatherMate

**Know the weather. Understand the conditions. Plan your day.**

> *A simple weather dashboard designed to turn live weather data into useful everyday insights.*