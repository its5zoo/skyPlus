import { motion } from 'framer-motion';
import { FiAlertCircle, FiRefreshCw, FiWifi } from 'react-icons/fi';

const ErrorCard = ({ message, onRetry }) => {
    const isNetworkError = message?.toLowerCase().includes('connect') || message?.toLowerCase().includes('network');

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="glass rounded-3xl p-10 text-center max-w-md mx-auto"
        >
            {/* Icon */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 mb-6"
            >
                <motion.div
                    animate={{ rotate: [0, -5, 5, -5, 0] }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    {isNetworkError ? (
                        <FiWifi className="text-4xl text-red-400" />
                    ) : (
                        <FiAlertCircle className="text-4xl text-red-400" />
                    )}
                </motion.div>
            </motion.div>

            <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-900 dark:text-white text-2xl font-bold mb-3"
            >
                {isNetworkError ? 'Connection Error' : 'City Not Found'}
            </motion.h3>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-slate-600 dark:text-white/60 text-sm mb-8 leading-relaxed"
            >
                {message}
            </motion.p>

            {onRetry && (
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onRetry}
                    className="inline-flex items-center gap-2 btn-glass"
                >
                    <FiRefreshCw className="text-sm" />
                    Try Again
                </motion.button>
            )}
        </motion.div>
    );
};

export default ErrorCard;
