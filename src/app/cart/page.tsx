'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Minus, Plus, X, ShoppingBag, CreditCard, Gift, Truck, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  wrapper: string;
}

const initialCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Cohiba Behike 56',
    brand: 'Cohiba',
    price: 450,
    quantity: 2,
    image: '/images/cigars/cohiba-behike.jpg',
    size: '56 x 166mm',
    wrapper: 'Cuban',
  },
  {
    id: '2',
    name: 'Davidoff Winston Churchill',
    brand: 'Davidoff',
    price: 320,
    quantity: 1,
    image: '/images/cigars/davidoff-winston.jpg',
    size: '50 x 127mm',
    wrapper: 'Ecuador',
  },
  {
    id: '3',
    name: 'Padron 1926 Serie No. 1',
    brand: 'Padron',
    price: 380,
    quantity: 3,
    image: '/images/cigars/padron-1926.jpg',
    size: '54 x 133mm',
    wrapper: 'Nicaragua',
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [discount, setDiscount] = useState(0);

  const updateQuantity = (id: string, change: number) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
    toast.success('Item removed from cart');
  };

  const applyPromoCode = () => {
    setIsApplyingPromo(true);
    setTimeout(() => {
      if (promoCode.toUpperCase() === 'LUXURY10') {
        setDiscount(0.1);
        toast.success('Promo code applied! 10% discount');
      } else {
        toast.error('Invalid promo code');
      }
      setIsApplyingPromo(false);
    }, 1000);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * discount;
  const shipping = subtotal > 500 ? 0 : 25;
  const tax = (subtotal - discountAmount) * 0.08;
  const total = subtotal - discountAmount + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background-primary to-background-secondary">
        <Navigation />
        <section className="section-luxury flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-text-muted" />
            <h2 className="text-3xl font-display font-bold mb-4">Your Cart is Empty</h2>
            <p className="text-text-secondary mb-8">
              Discover our premium collection and find your perfect cigar
            </p>
            <Link href="/products" className="btn-luxury-primary">
              Browse Collection
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background-primary to-background-secondary">
      <Navigation />

      {/* Header */}
      <section className="py-12 border-b border-accent-gold/20">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-luxury-heading mb-2">
              Your <span className="gold-gradient-text">Cart</span>
            </h1>
            <p className="text-text-secondary">{cartItems.length} items in your cart</p>
          </motion.div>
        </div>
      </section>

      <section className="section-luxury">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-background-secondary rounded-luxury-xl p-6 border border-accent-gold/20"
                >
                  <div className="flex gap-6">
                    {/* Image */}
                    <div className="w-24 h-24 bg-gradient-to-br from-background-accent to-background-primary rounded-luxury flex-shrink-0" />
                    
                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <div>
                          <h3 className="font-display font-bold text-lg">{item.name}</h3>
                          <p className="text-sm text-accent-gold">{item.brand}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-text-muted hover:text-red-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-text-muted mb-4">
                        <span>{item.size}</span>
                        <span>•</span>
                        <span>{item.wrapper}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {/* Quantity */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 rounded-full bg-background-accent hover:bg-accent-gold/20 transition-colors flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 rounded-full bg-background-accent hover:bg-accent-gold/20 transition-colors flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Price */}
                        <div className="text-right">
                          <p className="text-2xl font-bold gold-gradient-text">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-text-muted">${item.price} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Promo Code */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: cartItems.length * 0.1 }}
                className="bg-background-secondary rounded-luxury-xl p-6 border border-accent-gold/20"
              >
                <h3 className="font-display font-bold mb-4">Promo Code</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter code (try LUXURY10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-4 py-3 bg-background-primary border border-accent-gold/20 rounded-luxury focus:outline-none focus:border-accent-gold transition-colors"
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={isApplyingPromo || !promoCode}
                    className="btn-luxury-secondary disabled:opacity-50"
                  >
                    {isApplyingPromo ? 'Applying...' : 'Apply'}
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-background-secondary rounded-luxury-xl p-6 border border-accent-gold/20 sticky top-24"
              >
                <h2 className="text-xl font-display font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount ({(discount * 100).toFixed(0)}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-500">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-4 border-t border-accent-gold/20">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-display font-bold">Total</span>
                      <span className="text-2xl font-bold gold-gradient-text">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="btn-luxury-primary w-full flex items-center justify-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5" />
                  Proceed to Checkout
                </button>
                
                <Link href="/products" className="btn-luxury-secondary w-full text-center block">
                  Continue Shopping
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-accent-gold/20 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <Shield className="w-5 h-5 text-accent-gold" />
                    <span>Secure SSL Encryption</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <Truck className="w-5 h-5 text-accent-gold" />
                    <span>Free Shipping over $500</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <Gift className="w-5 h-5 text-accent-gold" />
                    <span>Gift Wrapping Available</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}