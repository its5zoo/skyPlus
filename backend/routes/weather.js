const express = require('express');
const axios = require('axios');
const router = express.Router();

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Helper to build weather response object
const buildWeatherResponse = (data) => ({
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    tempMin: Math.round(data.main.temp_min),
    tempMax: Math.round(data.main.temp_max),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    windDeg: data.wind.deg,
    pressure: data.main.pressure,
    visibility: data.visibility,
    condition: data.weather[0].main,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    timezone: data.timezone,
    dt: data.dt,
    uvi: data.uvi || null,
});

// GET /weather?address=London  OR  /weather?lat=51.5&lon=-0.1
router.get('/weather', async (req, res) => {
    try {
        const API_KEY = process.env.OPENWEATHER_API_KEY;
        if (!API_KEY) {
            return res.status(500).json({
                error:
                    'Missing OpenWeather API key. Set OPENWEATHER_API_KEY in backend/.env and restart the server.',
            });
        }
        const { address, city, lat, lon } = req.query;
        let url;

        if (lat && lon) {
            url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        } else if (address || city) {
            url = `${BASE_URL}/weather?q=${encodeURIComponent(address || city)}&units=metric&appid=${API_KEY}`;
        } else {
            return res.status(400).json({ error: 'Please provide a city name or coordinates.' });
        }

        const { data } = await axios.get(url);
        res.json(buildWeatherResponse(data));
    } catch (err) {
        if (err.response?.status === 404) {
            return res.status(404).json({ error: 'City not found. Please check the city name and try again.' });
        }
        if (err.response?.status === 401) {
            return res.status(401).json({ error: 'Invalid API key. Please configure a valid OpenWeatherMap API key.' });
        }
        console.error('Weather error:', err.message);
        res.status(500).json({ error: 'Failed to fetch weather data. Please try again later.' });
    }
});

// GET /forecast?address=London  OR  /forecast?lat=51.5&lon=-0.1
router.get('/forecast', async (req, res) => {
    try {
        const API_KEY = process.env.OPENWEATHER_API_KEY;
        if (!API_KEY) {
            return res.status(500).json({
                error:
                    'Missing OpenWeather API key. Set OPENWEATHER_API_KEY in backend/.env and restart the server.',
            });
        }
        const { address, city, lat, lon } = req.query;
        let url;

        if (lat && lon) {
            url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        } else if (address || city) {
            url = `${BASE_URL}/forecast?q=${encodeURIComponent(address || city)}&units=metric&appid=${API_KEY}`;
        } else {
            return res.status(400).json({ error: 'Please provide a city name or coordinates.' });
        }

        const { data } = await axios.get(url);

        // Build hourly forecast (next 24h = first 8 entries at 3h intervals)
        const hourly = data.list.slice(0, 8).map((item) => ({
            dt: item.dt,
            temp: Math.round(item.main.temp),
            condition: item.weather[0].main,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            iconUrl: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
            humidity: item.main.humidity,
            windSpeed: item.wind.speed,
            pop: Math.round((item.pop || 0) * 100), // precipitation %
        }));

        // Build daily forecast by grouping by day
        const dailyMap = {};
        data.list.forEach((item) => {
            const date = new Date(item.dt * 1000);
            const dayKey = date.toISOString().split('T')[0];
            if (!dailyMap[dayKey]) {
                dailyMap[dayKey] = {
                    dt: item.dt,
                    date: dayKey,
                    temps: [],
                    icons: [],
                    conditions: [],
                    humidity: [],
                    pop: [],
                };
            }
            dailyMap[dayKey].temps.push(item.main.temp);
            dailyMap[dayKey].icons.push(item.weather[0].icon);
            dailyMap[dayKey].conditions.push(item.weather[0].main);
            dailyMap[dayKey].humidity.push(item.main.humidity);
            dailyMap[dayKey].pop.push(item.pop || 0);
        });

        const daily = Object.values(dailyMap)
            .slice(0, 7)
            .map((day) => ({
                dt: day.dt,
                date: day.date,
                tempMin: Math.round(Math.min(...day.temps)),
                tempMax: Math.round(Math.max(...day.temps)),
                icon: day.icons[Math.floor(day.icons.length / 2)],
                iconUrl: `https://openweathermap.org/img/wn/${day.icons[Math.floor(day.icons.length / 2)]}@2x.png`,
                condition: day.conditions[Math.floor(day.conditions.length / 2)],
                humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
                pop: Math.round(Math.max(...day.pop) * 100),
            }));

        res.json({
            city: data.city.name,
            country: data.city.country,
            timezone: data.city.timezone,
            hourly,
            daily,
        });
    } catch (err) {
        if (err.response?.status === 404) {
            return res.status(404).json({ error: 'City not found. Please check the city name and try again.' });
        }
        if (err.response?.status === 401) {
            return res.status(401).json({ error: 'Invalid API key. Please configure a valid OpenWeatherMap API key.' });
        }
        console.error('Forecast error:', err.message);
        res.status(500).json({ error: 'Failed to fetch forecast data. Please try again later.' });
    }
});

module.exports = router;
