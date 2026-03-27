import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import Logo from './assets/logo.svg';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import FavoriteCities from './components/FavoriteCities';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorCard from './components/ErrorCard';
import { useWeather } from './hooks/useWeather';
import { getWeatherGradient, getWeatherOrbs } from './utils/weatherUtils';
import { STORAGE_KEY } from './components/FavoriteCities';

const APP_NAME = 'SkyPulse';

function App() {
  const { weather, forecast, loading, error, query, fetchWeather, clearError } = useWeather();
  const [dark, setDark] = useState(() => localStorage.getItem('theme') !== 'light');
  const [geoLoading, setGeoLoading] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
  });

  // Keep favorites in sync so WeatherCard knows isFavorite
  useEffect(() => {
    const sync = () => {
      try { setFavorites(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []); } catch { /**/ }
    };
    window.addEventListener('toggle-favorite', sync);
    return () => window.removeEventListener('toggle-favorite', sync);
  }, []);

  // Dark mode toggle
  useEffect(() => {
    const root = document.documentElement;
    if (dark) { root.classList.add('dark'); localStorage.setItem('theme', 'dark'); }
    else { root.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
  }, [dark]);

  // Geolocation
  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        fetchWeather({ lat: coords.latitude, lon: coords.longitude });
        setGeoLoading(false);
      },
      () => setGeoLoading(false),
      { timeout: 10000 }
    );
  }, [fetchWeather]);

  // Auto-detect location on first load
  useEffect(() => { handleGeolocate(); }, []);

  const handleSearch = useCallback((city) => fetchWeather({ city }), [fetchWeather]);

  const handleFavoriteToggle = useCallback(() => {
    if (weather?.city) {
      window.dispatchEvent(new CustomEvent('toggle-favorite', { detail: weather.city }));
    }
  }, [weather]);

  const isFavorite = weather ? favorites.includes(weather.city) : false;

  const condition = weather?.condition || '';
  const gradient = getWeatherGradient(condition);
  const orbs = getWeatherOrbs(condition);

  return (
    <div
      className={[
        'relative min-h-screen transition-all duration-700',
        dark
          ? `bg-gradient-to-br ${gradient}`
          : 'bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-100',
      ].join(' ')}
    >
      {/* Animated orbs */}
      <motion.div
        className={[
          'absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none',
          orbs.color1,
          dark ? 'opacity-20 blur-3xl' : 'opacity-15 blur-2xl',
        ].join(' ')}
        animate={{ x: [0, 30, 0], y: [0, -30, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={[
          'absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full pointer-events-none',
          orbs.color2,
          dark ? 'opacity-20 blur-3xl' : 'opacity-15 blur-2xl',
        ].join(' ')}
        animate={{ x: [0, -25, 0], y: [0, 25, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className={[
          'absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full pointer-events-none',
          dark ? 'bg-white opacity-5 blur-3xl' : 'bg-indigo-500 opacity-[0.08] blur-2xl',
        ].join(' ')}
        style={{ transform: 'translate(-50%, -50%)' }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Main content */}
      <div className="relative z-10 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-3">
              <img
                src={Logo}
                alt={APP_NAME}
                className="h-9 w-9 select-none"
                draggable="false"
              />
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {APP_NAME}
                </h1>
              <p className="text-slate-600 dark:text-white/40 text-xs mt-0.5">
                Real-time weather, beautifully
              </p>
              </div>
            </div>

            {/* Dark mode toggle */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDark((d) => !d)}
              className="glass rounded-2xl p-3 transition-all duration-200 hover:bg-slate-900/5 dark:hover:bg-white/20"
              title="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {dark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiSun className="text-xl text-yellow-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiMoon className="text-xl text-indigo-600 dark:text-blue-200" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>

          {/* Search bar */}
          <div className="mb-4">
            <SearchBar
              onSearch={handleSearch}
              onGeolocate={handleGeolocate}
              loading={loading}
              geoLoading={geoLoading}
            />
          </div>

          {/* Favorites */}
          <div className="mb-6">
            <FavoriteCities
              currentCity={weather?.city}
              onSelect={(city) => handleSearch(city)}
            />
          </div>

          {/* Content area */}
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div key="skeleton" exit={{ opacity: 0 }}>
                <LoadingSkeleton />
              </motion.div>
            )}

            {!loading && error && (
              <motion.div key="error">
                <ErrorCard message={error} onRetry={clearError} />
              </motion.div>
            )}

            {!loading && !error && !weather && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="text-center py-20"
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-7xl sm:text-8xl mb-6"
                >
                  🌍
                </motion.div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold mb-2">
                  Check the Weather
                </h2>
                <p className="text-slate-600 dark:text-white/40 text-sm">
                  Search for a city or allow location access to get started.
                </p>
              </motion.div>
            )}

            {!loading && !error && weather && (
              <motion.div
                key={weather.city}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <WeatherCard
                  weather={weather}
                  timezone={forecast?.timezone || weather.timezone}
                  onFavorite={handleFavoriteToggle}
                  isFavorite={isFavorite}
                />
                <HourlyForecast
                  hourly={forecast?.hourly}
                  timezone={forecast?.timezone || weather.timezone}
                />
                <DailyForecast daily={forecast?.daily} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-slate-500/80 dark:text-white/20 text-xs mt-10"
          >
            Powered by OpenWeatherMap · Made with love 5zoo🫶
          </motion.p>
        </div>
      </div>
    </div>
  );
}

export default App;
