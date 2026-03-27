import { motion } from 'framer-motion';
import {
    FiDroplet, FiWind, FiEye, FiThermometer,
    FiSunrise, FiSunset, FiHeart,
} from 'react-icons/fi';
import { WiHumidity, WiBarometer } from 'react-icons/wi';
import {
    formatTime, getWindDirection, capitalize, isDay as checkIsDay,
} from '../utils/weatherUtils';

const StatBadge = ({ icon, label, value, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        whileHover={{ scale: 1.04 }}
        className="glass rounded-2xl p-4 flex flex-col gap-2 transition-colors duration-200 cursor-default"
    >
        <div className="text-slate-600 dark:text-white/50 text-sm flex items-center gap-1.5">
            {icon}
            <span>{label}</span>
        </div>
        <div className="text-slate-900 dark:text-white font-semibold text-base">{value}</div>
    </motion.div>
);

const WeatherCard = ({ weather, timezone, onFavorite, isFavorite }) => {
    const dayTime = checkIsDay(weather.dt, weather.sunrise, weather.sunset);

    const containerVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1, y: 0, scale: 1,
            transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="glass-strong rounded-3xl p-6 sm:p-8 relative overflow-hidden"
        >
            {/* Decorative background circle */}
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-slate-900/5 dark:bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-slate-900/5 dark:bg-white/5 pointer-events-none" />

            {/* Header row */}
            <div className="flex items-start justify-between mb-6 relative z-10">
                <div>
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-900 dark:text-white text-3xl sm:text-4xl font-bold"
                    >
                        {weather.city}
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-2 mt-1"
                    >
                        <span className="text-slate-600 dark:text-white/60 text-sm font-medium">{weather.country}</span>
                        <span className="text-slate-400 dark:text-white/30 text-xs">•</span>
                        <span className="text-slate-500 dark:text-white/50 text-xs">{dayTime ? '☀️ Day' : '🌙 Night'}</span>
                    </motion.div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Favorite button */}
                    <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.85 }}
                        onClick={onFavorite}
                        className={`glass rounded-xl p-2.5 transition-colors duration-200
              ${isFavorite ? 'text-red-500 bg-red-500/10' : 'text-slate-500 dark:text-white/60 hover:text-red-500 dark:hover:text-red-300'}`}
                        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <FiHeart className={`text-lg ${isFavorite ? 'fill-current' : ''}`} />
                    </motion.button>

                    {/* Weather icon */}
                    <motion.img
                        initial={{ opacity: 0, rotate: -10, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.15 }}
                        src={weather.iconUrl}
                        alt={weather.condition}
                        className="w-20 h-20 drop-shadow-lg"
                    />
                </div>
            </div>

            {/* Temperature + condition */}
            <div className="flex items-end gap-4 mb-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start"
                >
                    <span className="text-slate-900 dark:text-white text-6xl xs:text-7xl sm:text-8xl font-black leading-none tracking-tighter">
                        {weather.temperature}
                    </span>
                    <span className="text-slate-600 dark:text-white/70 text-3xl xs:text-4xl font-light mt-2">°C</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-3 space-y-0.5"
                >
                    <div className="text-slate-900 dark:text-white font-semibold text-lg capitalize">
                        {capitalize(weather.description)}
                    </div>
                    <div className="text-slate-600 dark:text-white/50 text-sm">
                        Feels like {weather.feelsLike}°C
                    </div>
                    <div className="text-slate-500 dark:text-white/40 text-xs">
                        H:{weather.tempMax}° · L:{weather.tempMin}°
                    </div>
                </motion.div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 relative z-10">
                <StatBadge
                    icon={<FiDroplet />}
                    label="Humidity"
                    value={`${weather.humidity}%`}
                    delay={0.35}
                />
                <StatBadge
                    icon={<FiWind />}
                    label="Wind"
                    value={`${weather.windSpeed} m/s ${getWindDirection(weather.windDeg)}`}
                    delay={0.4}
                />
                <StatBadge
                    icon={<FiEye />}
                    label="Visibility"
                    value={`${(weather.visibility / 1000).toFixed(1)} km`}
                    delay={0.45}
                />
                <StatBadge
                    icon={<FiThermometer />}
                    label="Pressure"
                    value={`${weather.pressure} hPa`}
                    delay={0.5}
                />
            </div>

            {/* Sunrise / Sunset */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="flex flex-col xs:flex-row gap-3 xs:gap-4 relative z-10"
            >
                <div className="flex items-center gap-2 glass rounded-2xl px-4 py-2.5 xs:py-3 flex-1">
                    <FiSunrise className="text-orange-300 text-xl flex-shrink-0" />
                    <div>
                        <div className="text-slate-500 dark:text-white/40 text-[10px] xs:text-xs">Sunrise</div>
                        <div className="text-slate-900 dark:text-white text-xs xs:text-sm font-semibold">
                            {formatTime(weather.sunrise, timezone)}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 glass rounded-2xl px-4 py-2.5 xs:py-3 flex-1">
                    <FiSunset className="text-amber-300 text-xl flex-shrink-0" />
                    <div>
                        <div className="text-slate-500 dark:text-white/40 text-[10px] xs:text-xs">Sunset</div>
                        <div className="text-slate-900 dark:text-white text-xs xs:text-sm font-semibold">
                            {formatTime(weather.sunset, timezone)}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default WeatherCard;
