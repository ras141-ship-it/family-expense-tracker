
import React, { useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (!error) {
          toast({ title: "Connexion réussie", className: "bg-green-600 text-white" });
        }
      } else {
        const { error } = await signUp(email, password);
        if (!error) {
          toast({ title: "Inscription réussie", description: "Vérifiez votre email (si requis).", className: "bg-green-600 text-white" });
        }
      }
    } catch (error) {
        console.error("Auth error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20"
    >
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        {isLogin ? 'Bienvenue' : 'Créer un compte'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="votre@email.com"
          />
        </div>
        
        <div>
          <label className="block text-white/80 text-sm font-medium mb-1">Mot de passe</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="••••••••"
            minLength={6}
          />
        </div>

        <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold rounded-xl"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            isLogin ? 'Se connecter' : "S'inscrire"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors"
        >
          {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
        </button>
      </div>
    </motion.div>
  );
};

export default AuthForm;
