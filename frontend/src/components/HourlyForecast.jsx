import { useRef } from 'react';
import { motion } from 'framer-motion';
import { formatTime } from '../utils/weatherUtils';

const HourlyForecast = ({ hourly, timezone }) => {
    const scrollRef = useRef(null);

    if (!hourly?.length) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="glass rounded-3xl p-6"
        >
            <h3 className="text-slate-700 dark:text-white/70 text-sm font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
                <span>⏱</span> Hourly Forecast
            </h3>

            <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto pb-2 forecast-scroll"
                style={{ scrollbarWidth: 'thin' }}
            >
                {hourly.map((item, idx) => (
                    <motion.div
                        key={item.dt}
                        initial={{ opacity: 0, scale: 0.85, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 + 0.1, type: 'spring', stiffness: 200, damping: 20 }}
                        whileHover={{ scale: 1.08, y: -4 }}
                        className={`flex-shrink-0 flex flex-col items-center gap-2 glass rounded-2xl px-4 py-4 
              cursor-default transition-colors duration-200 hover:bg-slate-900/5 dark:hover:bg-white/15 min-w-[70px]
              ${idx === 0 ? 'bg-slate-900/5 dark:bg-white/15 border-slate-900/15 dark:border-white/30' : ''}`}
                    >
                        <span className="text-slate-600 dark:text-white/50 text-xs font-medium">
                            {idx === 0 ? 'Now' : formatTime(item.dt, timezone)}
                        </span>
                        <img
                            src={item.iconUrl}
                            alt={item.condition}
                            className="w-10 h-10 drop-shadow"
                        />
                        <span className="text-slate-900 dark:text-white font-bold text-base">{item.temp}°</span>
                        {item.pop > 0 && (
                            <span className="text-blue-300 text-xs">💧 {item.pop}%</span>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default HourlyForecast;
