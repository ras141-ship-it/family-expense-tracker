
import React from 'react';
import { motion } from 'framer-motion';
import { Banknote, TrendingUp, ShoppingBag } from 'lucide-react';

const FinancialSummary = ({ stats }) => {
  const { totalSpent, count, averagePrice } = stats || { totalSpent: 0, count: 0, averagePrice: 0 };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'XOF',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const cards = [
    {
      title: "Total Dépensé",
      value: formatCurrency(totalSpent),
      icon: Banknote,
      color: "from-emerald-500 to-teal-600",
      delay: 0
    },
    {
      title: "Nombre d'achats",
      value: count,
      icon: ShoppingBag,
      color: "from-blue-500 to-indigo-600",
      delay: 0.1
    },
    {
      title: "Prix Moyen",
      value: formatCurrency(averagePrice),
      icon: TrendingUp,
      color: "from-purple-500 to-pink-600",
      delay: 0.2
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: card.delay }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl relative overflow-hidden group"
        >
          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-10 rounded-bl-full transition-opacity group-hover:opacity-20`} />
          
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} shadow-lg`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-white/70 font-medium">{card.title}</p>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white tracking-tight">
              {card.value}
            </h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FinancialSummary;
