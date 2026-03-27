import { useState, useCallback, useRef } from 'react';
import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

export const useWeather = () => {
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState('');
    const abortRef = useRef(null);

    const fetchWeather = useCallback(async ({ city, lat, lon }) => {
        // Cancel previous request if any
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();

        setLoading(true);
        setError(null);

        try {
            const params = city ? { address: city } : { lat, lon };

            const [weatherRes, forecastRes] = await Promise.all([
                axios.get(`${API_BASE}/weather`, { params, signal: abortRef.current.signal }),
                axios.get(`${API_BASE}/forecast`, { params, signal: abortRef.current.signal }),
            ]);

            setWeather(weatherRes.data);
            setForecast(forecastRes.data);
            setQuery(city || weatherRes.data.city);
        } catch (err) {
            if (axios.isCancel(err)) return;
            const message =
                err.response?.data?.error ||
                (err.code === 'ERR_NETWORK'
                    ? 'Cannot connect to server. Make sure the backend is running.'
                    : 'Failed to fetch weather. Please try again.');
            setError(message);
            setWeather(null);
            setForecast(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return { weather, forecast, loading, error, query, fetchWeather, clearError };
};
