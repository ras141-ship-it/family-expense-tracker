
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Tag, AlertCircle } from 'lucide-react';

const MostBoughtProduct = ({ purchases }) => {
  const stats = useMemo(() => {
    if (!purchases || purchases.length === 0) return null;

    const counts = {};
    const prices = {};

    purchases.forEach(p => {
      const name = p.name.trim(); // Case sensitive intentionally or convert toLower if needed
      const key = name.toLowerCase();
      
      if (!counts[key]) {
        counts[key] = { count: 0, name: name }; // Keep original name
        prices[key] = 0;
      }
      counts[key].count++;
      prices[key] += parseFloat(p.price);
    });

    let maxKey = null;
    let maxCount = 0;

    Object.keys(counts).forEach(key => {
      if (counts[key].count > maxCount) {
        maxCount = counts[key].count;
        maxKey = key;
      }
    });

    if (!maxKey) return null;

    const totalPurchases = purchases.length;
    const percentage = ((maxCount / totalPurchases) * 100).toFixed(1);
    const averagePrice = prices[maxKey] / maxCount;

    return {
      name: counts[maxKey].name,
      count: maxCount,
      percentage,
      averagePrice
    };
  }, [purchases]);

  if (!stats) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 h-full flex flex-col justify-center items-center text-center"
      >
        <div className="bg-white/5 p-4 rounded-full mb-4">
          <Trophy className="w-8 h-8 text-white/30" />
        </div>
        <p className="text-white/60">Pas assez de données pour déterminer le produit favori.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 h-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-32 bg-amber-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Produit Favori</h2>
      </div>

      <div className="relative z-10">
        <div className="mb-6">
          <span className="text-white/60 text-sm font-medium uppercase tracking-wider">Top #1</span>
          <h3 className="text-4xl font-bold text-white mt-1 break-words">{stats.name}</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/20 rounded-xl p-4 backdrop-blur-sm border border-white/5">
            <div className="flex items-center gap-2 mb-2 text-amber-200">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Fréquence</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.count} <span className="text-sm text-white/50 font-normal">fois</span></p>
            <p className="text-xs text-white/40 mt-1">{stats.percentage}% des achats</p>
          </div>

          <div className="bg-black/20 rounded-xl p-4 backdrop-blur-sm border border-white/5">
            <div className="flex items-center gap-2 mb-2 text-amber-200">
              <Tag className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Prix Moyen</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(stats.averagePrice)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MostBoughtProduct;
