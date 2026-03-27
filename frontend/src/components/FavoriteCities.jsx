import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar } from 'react-icons/fi';

const STORAGE_KEY = 'weather_favorites';

const FavoriteCities = ({ currentCity, onSelect }) => {
    const [favorites, setFavorites] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch {
            return [];
        }
    });

    // Expose add/remove via custom event so WeatherCard's heart button can call it
    useEffect(() => {
        const handler = (e) => {
            const city = e.detail;
            setFavorites((prev) => {
                let next;
                if (prev.includes(city)) {
                    next = prev.filter((c) => c !== city);
                } else {
                    next = [city, ...prev].slice(0, 10);
                }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                return next;
            });
        };
        window.addEventListener('toggle-favorite', handler);
        return () => window.removeEventListener('toggle-favorite', handler);
    }, []);

    if (!favorites.length) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 items-center"
        >
            <span className="text-slate-600 dark:text-white/40 text-xs flex items-center gap-1">
                <FiStar className="text-yellow-400" /> Favorites
            </span>

            <AnimatePresence mode="popLayout">
                {favorites.map((city) => (
                    <motion.button
                        key={city}
                        layout
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.93 }}
                        onClick={() => onSelect(city)}
                        className={`group flex items-center gap-1.5 glass rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200
              ${city === currentCity
                                ? 'bg-slate-900/5 dark:bg-white/25 text-slate-900 dark:text-white border-slate-900/15 dark:border-white/40'
                                : 'text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/15'
                            }`}
                    >
                        {city}
                        <span
                            role="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.dispatchEvent(new CustomEvent('toggle-favorite', { detail: city }));
                            }}
                            className="text-slate-500 dark:text-white/30 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors ml-0.5"
                            title="Remove"
                        >
                            <FiX className="text-xs" />
                        </span>
                    </motion.button>
                ))}
            </AnimatePresence>
        </motion.div>
    );
};

export { STORAGE_KEY };
export default FavoriteCities;
