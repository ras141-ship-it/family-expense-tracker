
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useShoppingData } from '@/hooks/useShoppingData';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import AddPurchaseForm from '@/components/AddPurchaseForm';
import PurchaseHistory from '@/components/PurchaseHistory';
import FinancialSummary from '@/components/FinancialSummary';
import MostBoughtProduct from '@/components/MostBoughtProduct';
import AuthForm from '@/components/AuthForm';
import { LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  
  // Conditionally call hook only if user exists to avoid unnecessary initializations
  // However, hooks must be called unconditionally. 
  // We handle "no user" inside the hook itself gracefully.
  const {
    purchases,
    loading: dataLoading,
    addPurchase,
    deletePurchase,
    stats
  } = useShoppingData();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Protected Route Logic: Show AuthForm if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Helmet>
          <title>Connexion - Gestion des Courses</title>
        </Helmet>
        <AuthForm />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Tableau de Bord - Gestion des Courses</title>
        <meta
          name="description"
          content="Gérez vos courses familiales, suivez vos dépenses et analysez vos habitudes d'achat."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-6 md:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-white/10"
          >
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Gestion des Courses
              </h1>
              <p className="text-white/60">Bienvenue, {user.email}</p>
            </div>
            <Button 
                onClick={signOut} 
                variant="outline" 
                className="border-white/20 text-black hover:bg-white/10 hover:text-white transition-colors gap-2"
            >
                <LogOut className="w-4 h-4" />
                Déconnexion
            </Button>
          </motion.div>

          {/* Metrics Section */}
          <section>
            <FinancialSummary stats={stats} />
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Form & Most Bought */}
            <div className="lg:col-span-1 space-y-8">
              <AddPurchaseForm onAddPurchase={addPurchase} />
              <div className="h-full">
                <MostBoughtProduct purchases={purchases} />
              </div>
            </div>

            {/* Right Column: History */}
            <div className="lg:col-span-2">
              <PurchaseHistory
                purchases={purchases}
                loading={dataLoading}
                onDelete={deletePurchase}
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;
