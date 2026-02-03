
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AddPurchaseForm = ({ onAddPurchase }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return !value || value.trim() === '' ? 'Le nom du produit est requis' : '';
      case 'price':
        if (value === '' || value === null) return 'Le prix est requis';
        if (parseFloat(value) <= 0) return 'Le prix doit être positif';
        return '';
      case 'date':
        return !value ? 'La date est requise' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    // 1. Critical: Prevent default browser reload
    e.preventDefault();
    e.stopPropagation();

    // 2. Validation
    const newErrors = {
      name: validateField('name', formData.name),
      price: validateField('price', formData.price),
      date: validateField('date', formData.date)
    };

    if (Object.values(newErrors).some(error => error)) {
      setErrors(newErrors);
      toast({
        title: "Erreur de validation",
        description: "Veuillez vérifier les champs du formulaire.",
        variant: "destructive"
      });
      return;
    }

    // 3. Submit
    setIsSubmitting(true);
    try {
      await onAddPurchase(formData.name, formData.price, formData.date);
      
      // 4. Success handling
      toast({
        title: "Succès !",
        description: "Achat ajouté avec succès.",
        className: "bg-green-600 text-white border-green-700"
      });
      
      // Clear form
      setFormData({
        name: '',
        price: '',
        date: new Date().toISOString().split('T')[0]
      });
      setErrors({});
    } catch (error) {
      // Error handled by hook toast mostly, but we catch here to stop loading state
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-xl border border-white/20"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
          <ShoppingCart className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white">Nouvel Achat</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-1.5">
            Nom du produit
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.name ? 'border-red-400 focus:ring-red-400' : 'border-white/20'
              }`}
              placeholder="Ex: Pain, Lait, Pommes..."
              disabled={isSubmitting}
            />
          </div>
          {errors.name && (
            <div className="flex items-center gap-1.5 mt-1.5 text-red-300">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{errors.name}</span>
            </div>
          )}
        </div>

        {/* Price & Date Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-white/90 mb-1.5">
              Prix (FCFA)
            </label>
            <div className="relative">
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.price ? 'border-red-400 focus:ring-red-400' : 'border-white/20'
                }`}
                placeholder="0"
                disabled={isSubmitting}
              />
            </div>
            {errors.price && (
              <div className="flex items-center gap-1.5 mt-1.5 text-red-300">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{errors.price}</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-white/90 mb-1.5">
              Date
            </label>
            <div className="relative">
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.date ? 'border-red-400 focus:ring-red-400' : 'border-white/20'
                }`}
                disabled={isSubmitting}
              />
            </div>
            {errors.date && (
              <div className="flex items-center gap-1.5 mt-1.5 text-red-300">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{errors.date}</span>
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Ajout en cours...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              Ajouter l'achat
            </span>
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default AddPurchaseForm;
