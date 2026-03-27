/**
 * weatherUtils.js — Helper functions for the Weather App
 */

// Map weather condition to gradient background classes
export const getWeatherGradient = (condition, isDay = true) => {
    if (!condition) return 'from-slate-700 via-slate-800 to-slate-900';

    const c = condition.toLowerCase();

    if (c.includes('clear') || c.includes('sunny')) {
        return isDay
            ? 'from-sky-400 via-blue-500 to-indigo-600'
            : 'from-indigo-900 via-blue-950 to-slate-900';
    }
    if (c.includes('cloud')) {
        return isDay
            ? 'from-slate-400 via-slate-500 to-slate-600'
            : 'from-slate-700 via-slate-800 to-slate-900';
    }
    if (c.includes('rain') || c.includes('drizzle')) {
        return 'from-slate-600 via-blue-800 to-slate-900';
    }
    if (c.includes('thunder') || c.includes('storm')) {
        return 'from-gray-700 via-purple-900 to-gray-900';
    }
    if (c.includes('snow') || c.includes('sleet')) {
        return 'from-blue-100 via-blue-200 to-slate-300';
    }
    if (c.includes('mist') || c.includes('fog') || c.includes('haze') || c.includes('smoke')) {
        return 'from-gray-400 via-gray-500 to-gray-600';
    }
    if (c.includes('sand') || c.includes('dust')) {
        return 'from-yellow-600 via-orange-700 to-red-800';
    }

    return 'from-blue-500 via-indigo-600 to-purple-700';
};

// Animated background particles (orbs) config per weather
export const getWeatherOrbs = (condition) => {
    if (!condition) return { color1: 'bg-blue-400', color2: 'bg-purple-400' };
    const c = condition.toLowerCase();

    if (c.includes('clear') || c.includes('sunny')) return { color1: 'bg-yellow-300', color2: 'bg-orange-400' };
    if (c.includes('rain') || c.includes('drizzle')) return { color1: 'bg-blue-400', color2: 'bg-slate-400' };
    if (c.includes('thunder') || c.includes('storm')) return { color1: 'bg-purple-500', color2: 'bg-gray-500' };
    if (c.includes('snow')) return { color1: 'bg-blue-200', color2: 'bg-white' };
    if (c.includes('cloud')) return { color1: 'bg-slate-300', color2: 'bg-slate-400' };
    return { color1: 'bg-blue-400', color2: 'bg-purple-400' };
};

// Format Unix timestamp to readable time
export const formatTime = (unix, timezone = 0) => {
    const date = new Date((unix + timezone) * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
};

// Format Unix timestamp to short day name
export const formatDay = (unix) => {
    const date = new Date(unix * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Format Unix timestamp to short date
export const formatDate = (unix) => {
    const date = new Date(unix * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Determine if it's daytime based on sunrise/sunset
export const isDay = (dt, sunrise, sunset) => dt >= sunrise && dt <= sunset;

// Get wind direction from degrees
export const getWindDirection = (deg) => {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(deg / 45) % 8];
};

// Capitalize first letter of each word
export const capitalize = (str) =>
    str?.replace(/\b\w/g, (c) => c.toUpperCase()) || '';

// UV Index label
export const getUVLabel = (uvi) => {
    if (!uvi) return { label: 'Low', color: 'text-green-400' };
    if (uvi <= 2) return { label: 'Low', color: 'text-green-400' };
    if (uvi <= 5) return { label: 'Moderate', color: 'text-yellow-400' };
    if (uvi <= 7) return { label: 'High', color: 'text-orange-400' };
    if (uvi <= 10) return { label: 'Very High', color: 'text-red-400' };
    return { label: 'Extreme', color: 'text-purple-400' };
};
