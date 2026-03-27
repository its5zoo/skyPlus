import { motion } from 'framer-motion';

const LoadingSkeleton = () => {
    const SkeletonBlock = ({ className }) => (
        <div className={`shimmer-bg rounded-2xl ${className}`} />
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full space-y-4"
        >
            {/* Main card skeleton */}
            <div className="glass rounded-3xl p-8">
                <div className="flex justify-between items-start mb-8">
                    <div className="space-y-3">
                        <SkeletonBlock className="h-8 w-48" />
                        <SkeletonBlock className="h-5 w-32" />
                    </div>
                    <SkeletonBlock className="h-20 w-20 rounded-full" />
                </div>

                <div className="flex items-end gap-4 mb-6">
                    <SkeletonBlock className="h-24 w-40" />
                    <SkeletonBlock className="h-8 w-32 mb-2" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[...Array(4)].map((_, i) => (
                        <SkeletonBlock key={i} className="h-20" />
                    ))}
                </div>
            </div>

            {/* Hourly skeleton */}
            <div className="glass rounded-3xl p-6">
                <SkeletonBlock className="h-5 w-32 mb-4" />
                <div className="flex gap-3 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                        <SkeletonBlock key={i} className="h-24 w-20 flex-shrink-0" />
                    ))}
                </div>
            </div>

            {/* Daily skeleton */}
            <div className="glass rounded-3xl p-6">
                <SkeletonBlock className="h-5 w-36 mb-4" />
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <SkeletonBlock key={i} className="h-12 w-full" />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default LoadingSkeleton;
