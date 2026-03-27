import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMapPin, FiX } from 'react-icons/fi';

const SearchBar = ({ onSearch, onGeolocate, loading, geoLoading }) => {
    const [value, setValue] = useState('');
    const [focused, setFocused] = useState(false);
    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = value.trim();
        if (trimmed) onSearch(trimmed);
    };

    const handleClear = () => {
        setValue('');
        inputRef.current?.focus();
    };

    useEffect(() => {
        const handler = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-2xl mx-auto"
        >
            <form onSubmit={handleSubmit} className="relative flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-3">
                {/* Search input */}
                <motion.div
                    className="relative flex-1"
                    animate={{ scale: focused ? 1.01 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <div
                        className={`flex items-center glass rounded-2xl px-4 py-3.5 gap-3 transition-all duration-300
              ${focused ? 'border-slate-900/15 dark:border-white/40 bg-white/85 dark:bg-white/15 glow' : 'border-slate-900/10 dark:border-white/20 bg-white/70 dark:bg-white/10'}`}
                    >
                        <motion.div
                            animate={{ rotate: loading ? 360 : 0 }}
                            transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: 'linear' }}
                        >
                            <FiSearch className="text-slate-500 dark:text-white/70 text-lg flex-shrink-0" />
                        </motion.div>

                        <input
                            ref={inputRef}
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            placeholder="Search for a city..."
                            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-white/40 outline-none text-base font-medium"
                            disabled={loading}
                        />

                        <AnimatePresence>
                            {value && (
                                <motion.button
                                    type="button"
                                    onClick={handleClear}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{ duration: 0.15 }}
                                    className="text-slate-500 hover:text-slate-900 dark:text-white/50 dark:hover:text-white transition-colors p-0.5"
                                >
                                    <FiX className="text-sm" />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        <kbd className="hidden sm:flex items-center text-slate-500/80 dark:text-white/30 text-xs px-2 py-0.5 rounded-md border border-slate-900/10 dark:border-white/20">
                            ↵
                        </kbd>
                    </div>
                </motion.div>

                {/* Search button */}
                <motion.button
                    type="submit"
                    disabled={loading || !value.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-slate-900 dark:text-white font-semibold text-sm
                     transition-all duration-200 hover:bg-slate-900/5 dark:hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed
                     whitespace-nowrap flex items-center justify-center gap-2"
                >
                    <FiSearch className="xs:hidden" />
                    <span className="hidden xs:inline">{loading ? 'Searching...' : 'Search'}</span>
                    <span className="xs:hidden">{loading ? '...' : 'Search'}</span>
                </motion.button>

                {/* Geo button */}
                <motion.button
                    type="button"
                    onClick={onGeolocate}
                    disabled={geoLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Use my location"
                    className="glass rounded-2xl p-3 sm:p-3.5 text-slate-900 dark:text-white transition-all duration-200
                     hover:bg-slate-900/5 dark:hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 flex items-center justify-center"
                >
                    <motion.div
                        animate={{ scale: geoLoading ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: 0.8, repeat: geoLoading ? Infinity : 0 }}
                    >
                        <FiMapPin className="text-lg" />
                    </motion.div>
                </motion.button>
            </form>
        </motion.div>
    );
};

export default SearchBar;
