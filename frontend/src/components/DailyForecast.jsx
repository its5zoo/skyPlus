import { motion } from 'framer-motion';
import { formatDay, formatDate } from '../utils/weatherUtils';

const TempBar = ({ min, max, globalMin, globalMax }) => {
    const range = globalMax - globalMin || 1;
    const leftPercent = ((min - globalMin) / range) * 100;
    const widthPercent = ((max - min) / range) * 100;

    return (
        <div className="relative h-1.5 w-full bg-slate-900/10 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${widthPercent}%`, marginLeft: `${leftPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 to-orange-400"
            />
        </div>
    );
};

const DailyForecast = ({ daily }) => {
    if (!daily?.length) return null;

    const globalMin = Math.min(...daily.map((d) => d.tempMin));
    const globalMax = Math.max(...daily.map((d) => d.tempMax));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="glass rounded-3xl p-6"
        >
            <h3 className="text-slate-700 dark:text-white/70 text-sm font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
                <span>📅</span> 7-Day Forecast
            </h3>

            <div className="space-y-1">
                {daily.map((day, idx) => (
                    <motion.div
                        key={day.dt}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.06 + 0.1, duration: 0.4 }}
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)', scale: 1.01 }}
                        className="flex items-center gap-4 rounded-2xl px-3 py-3 transition-all duration-200 cursor-default"
                    >
                        {/* Day name */}
                        <div className="w-12 flex-shrink-0">
                            <span className="text-slate-900 dark:text-white font-semibold text-sm">
                                {idx === 0 ? 'Today' : formatDay(day.dt)}
                            </span>
                        </div>

                        {/* Icon + condition */}
                        <div className="flex items-center gap-2 w-28 flex-shrink-0">
                            <img src={day.iconUrl} alt={day.condition} className="w-8 h-8" />
                            <span className="text-slate-600 dark:text-white/50 text-xs hidden sm:block">{day.condition}</span>
                        </div>

                        {/* Precip */}
                        <div className="w-12 flex-shrink-0 text-center">
                            {day.pop > 0 ? (
                                <span className="text-blue-300 text-xs">💧{day.pop}%</span>
                            ) : (
                                <span className="text-slate-400 dark:text-white/20 text-xs">—</span>
                            )}
                        </div>

                        {/* Temp bar */}
                        <div className="flex-1 flex items-center gap-3">
                            <span className="text-slate-600 dark:text-white/50 text-sm w-8 text-right">{day.tempMin}°</span>
                            <div className="flex-1">
                                <TempBar
                                    min={day.tempMin}
                                    max={day.tempMax}
                                    globalMin={globalMin}
                                    globalMax={globalMax}
                                />
                            </div>
                            <span className="text-slate-900 dark:text-white text-sm font-semibold w-8">{day.tempMax}°</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default DailyForecast;
