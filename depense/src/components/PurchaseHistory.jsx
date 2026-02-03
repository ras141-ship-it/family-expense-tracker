
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Calendar, Package, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const PurchaseHistory = ({ purchases, loading, onDelete }) => {
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteId);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }).format(new Date(dateString));
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 shadow-xl border border-white/20 flex justify-center">
        <Loader2 className="w-10 h-10 text-white animate-spin" />
      </div>
    );
  }

  if (!purchases || purchases.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 shadow-xl border border-white/20 text-center"
      >
        <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-10 h-10 text-white/50" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Historique vide</h3>
        <p className="text-white/60">Ajoutez votre premier achat pour commencer le suivi.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-xl border border-white/20"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-white/10 rounded-lg">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Historique des achats</h2>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-white/10">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-white/80 uppercase tracking-wider">Produit</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-white/80 uppercase tracking-wider">Prix</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-white/80 uppercase tracking-wider">Date</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-white/80 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            <AnimatePresence>
              {purchases.map((purchase) => (
                <motion.tr
                  key={purchase.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-6 text-white font-medium">{purchase.name}</td>
                  <td className="py-4 px-6 text-white font-mono">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(purchase.price)}
                  </td>
                  <td className="py-4 px-6 text-white/70">{formatDate(purchase.date)}</td>
                  <td className="py-4 px-6 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(purchase.id)}
                      className="text-red-300 hover:text-red-100 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        <AnimatePresence>
          {purchases.map((purchase) => (
            <motion.div
              key={purchase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/5 rounded-xl p-4 border border-white/10 flex justify-between items-center"
            >
              <div>
                <h3 className="text-white font-semibold">{purchase.name}</h3>
                <p className="text-white/60 text-sm">{formatDate(purchase.date)}</p>
                <p className="text-blue-300 font-bold mt-1">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(purchase.price)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteId(purchase.id)}
                className="text-red-300 hover:text-red-100 hover:bg-red-500/20"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => !isDeleting && setDeleteId(null)}>
        <AlertDialogContent className="bg-slate-900 border border-white/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Cette action est irréversible. L'achat sera définitivement supprimé de votre historique.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 border-transparent hover:bg-white/20 text-white">Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default PurchaseHistory;
