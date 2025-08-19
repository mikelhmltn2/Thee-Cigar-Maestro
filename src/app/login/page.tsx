'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      toast.success('Welcome back! Redirecting to your dashboard...');
      router.push('/dashboard');
      setIsLoading(false);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSocialLogin = (provider: string) => {
    toast.success(`Logging in with ${provider}...`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background-primary to-background-secondary">
      <Navigation />

      <section className="section-luxury flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="container-luxury max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Branding */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden lg:block"
            >
              <h1 className="text-luxury-heading mb-6">
                Welcome <span className="gold-gradient-text">Back</span>
              </h1>
              <p className="text-luxury-body text-text-secondary mb-8">
                Sign in to access your personalized cigar collection, track orders, and receive
                AI-powered recommendations tailored to your refined taste.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent-gold to-accent-copper rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-background-primary" />
                  </div>
                  <div>
                    <p className="font-medium">AI Concierge</p>
                    <p className="text-sm text-text-muted">Get personalized recommendations</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent-gold to-accent-copper rounded-full flex items-center justify-center">
                    <span className="text-background-primary">🎯</span>
                  </div>
                  <div>
                    <p className="font-medium">Exclusive Access</p>
                    <p className="text-sm text-text-muted">Members-only releases and events</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent-gold to-accent-copper rounded-full flex items-center justify-center">
                    <span className="text-background-primary">💎</span>
                  </div>
                  <div>
                    <p className="font-medium">Rewards Program</p>
                    <p className="text-sm text-text-muted">Earn points with every purchase</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-background-secondary rounded-luxury-xl p-8 border border-accent-gold/20">
                <h2 className="text-2xl font-display font-bold mb-6 lg:hidden">Sign In</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="w-full pl-12 pr-4 py-3 bg-background-primary border border-accent-gold/20 rounded-luxury focus:outline-none focus:border-accent-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3 bg-background-primary border border-accent-gold/20 rounded-luxury focus:outline-none focus:border-accent-gold transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="remember"
                        checked={formData.remember}
                        onChange={handleChange}
                        className="w-4 h-4 bg-background-primary border-accent-gold/20 rounded focus:ring-accent-gold"
                      />
                      <span className="text-sm">Remember me</span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-accent-gold hover:text-accent-gold/80 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-luxury-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      'Signing in...'
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-accent-gold/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-background-secondary text-text-muted">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleSocialLogin('Google')}
                      className="py-2 px-4 bg-background-primary border border-accent-gold/20 rounded-luxury hover:border-accent-gold/40 transition-colors text-sm"
                    >
                      Google
                    </button>
                    <button
                      onClick={() => handleSocialLogin('Facebook')}
                      className="py-2 px-4 bg-background-primary border border-accent-gold/20 rounded-luxury hover:border-accent-gold/40 transition-colors text-sm"
                    >
                      Facebook
                    </button>
                    <button
                      onClick={() => handleSocialLogin('Apple')}
                      className="py-2 px-4 bg-background-primary border border-accent-gold/20 rounded-luxury hover:border-accent-gold/40 transition-colors text-sm"
                    >
                      Apple
                    </button>
                  </div>
                </div>

                <p className="mt-6 text-center text-sm text-text-muted">
                  Don't have an account?{' '}
                  <Link
                    href="/register"
                    className="text-accent-gold hover:text-accent-gold/80 transition-colors font-medium"
                  >
                    Create one
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}