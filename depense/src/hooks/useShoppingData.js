
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const useShoppingData = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchPurchases = useCallback(async () => {
    try {
      if (!user) {
        setPurchases([]);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPurchases(data || []);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger l'historique des achats.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Initial fetch and Real-time subscription
  useEffect(() => {
    let isMounted = true;
    
    const initData = async () => {
      if (isMounted) await fetchPurchases();
    };
    initData();

    const channel = supabase
      .channel('purchases_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'purchases'
        },
        () => {
          // Re-fetch on any change to ensure data consistency
          if (isMounted) fetchPurchases();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [fetchPurchases]);

  const addPurchase = async (name, price, date) => {
    // Return a promise to allow caller to handle loading/success states
    return new Promise(async (resolve, reject) => {
      try {
        if (!user) {
          throw new Error("Vous devez être connecté.");
        }

        const { data, error } = await supabase
          .from('purchases')
          .insert([
            { 
              name: name.trim(), 
              price: parseFloat(price), 
              date: date,
              user_id: user.id
            }
          ])
          .select()
          .single();

        if (error) throw error;
        
        // Success
        await fetchPurchases(); // Ensure local state is updated
        resolve(data);
      } catch (error) {
        console.error('Error adding purchase:', error);
        toast({
          title: "Erreur",
          description: error.message || "Impossible d'ajouter l'achat.",
          variant: "destructive"
        });
        reject(error);
      }
    });
  };

  const deletePurchase = async (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!user) throw new Error("Vous devez être connecté.");

        // Optimistically update local state for instant feedback
        const previousPurchases = [...purchases];
        setPurchases(current => current.filter(p => p.id !== id));

        const { error } = await supabase
          .from('purchases')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          // Revert on error
          setPurchases(previousPurchases);
          throw error;
        }

        // Fetch to be sure
        await fetchPurchases();
        resolve();

      } catch (error) {
        console.error('Error deleting purchase:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'achat.",
          variant: "destructive"
        });
        reject(error);
      }
    });
  };

  // Synchronous calculations for instant UI updates
  const stats = useMemo(() => {
    const totalSpent = purchases.reduce((acc, curr) => acc + parseFloat(curr.price || 0), 0);
    const count = purchases.length;
    const averagePrice = count > 0 ? totalSpent / count : 0;

    return { totalSpent, count, averagePrice };
  }, [purchases]);

  return {
    purchases,
    loading,
    addPurchase,
    deletePurchase,
    stats
  };
};
