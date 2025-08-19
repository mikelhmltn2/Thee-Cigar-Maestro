'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Mail, Lock, Eye, EyeOff, User, Phone, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    subscribeNewsletter: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);

    // Simulate registration
    setTimeout(() => {
      toast.success('Account created successfully! Welcome to Thee Cigar Maestro.');
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-background-primary to-background-secondary">
      <Navigation />

      <section className="section-luxury">
        <div className="container-luxury max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Branding */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden lg:block sticky top-24"
            >
              <h1 className="text-luxury-heading mb-6">
                Join Our <span className="gold-gradient-text">Elite Circle</span>
              </h1>
              <p className="text-luxury-body text-text-secondary mb-8">
                Create your account to unlock a world of premium cigars, personalized recommendations,
                and exclusive member benefits.
              </p>

              <div className="bg-gradient-to-br from-accent-gold/10 to-accent-copper/10 rounded-luxury-xl p-6 mb-8">
                <h3 className="text-xl font-display font-bold mb-4">Member Benefits</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-accent-gold mt-1">✓</span>
                    <span className="text-sm">AI-powered personalized cigar recommendations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent-gold mt-1">✓</span>
                    <span className="text-sm">Early access to limited edition releases</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent-gold mt-1">✓</span>
                    <span className="text-sm">Exclusive member pricing and discounts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent-gold mt-1">✓</span>
                    <span className="text-sm">Virtual humidor to track your collection</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent-gold mt-1">✓</span>
                    <span className="text-sm">Invitations to private tasting events</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent-gold mt-1">✓</span>
                    <span className="text-sm">Rewards points on every purchase</span>
                  </li>
                </ul>
              </div>

              <div className="text-center p-6 bg-background-secondary rounded-luxury-xl border border-accent-gold/20">
                <p className="text-3xl font-display font-bold gold-gradient-text mb-2">10,000+</p>
                <p className="text-text-secondary">Happy Members Worldwide</p>
              </div>
            </motion.div>

            {/* Right Side - Registration Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-background-secondary rounded-luxury-xl p-8 border border-accent-gold/20">
                <h2 className="text-2xl font-display font-bold mb-6">Create Your Account</h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          placeholder="John"
                          className="w-full pl-12 pr-4 py-3 bg-background-primary border border-accent-gold/20 rounded-luxury focus:outline-none focus:border-accent-gold transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          placeholder="Doe"
                          className="w-full pl-12 pr-4 py-3 bg-background-primary border border-accent-gold/20 rounded-luxury focus:outline-none focus:border-accent-gold transition-colors"
                        />
                      </div>
                    </div>
                  </div>

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
                        placeholder="john@example.com"
                        className="w-full pl-12 pr-4 py-3 bg-background-primary border border-accent-gold/20 rounded-luxury focus:outline-none focus:border-accent-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
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
                    <p className="text-xs text-text-muted mt-1">
                      Must be at least 8 characters with uppercase, lowercase, and numbers
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3 bg-background-primary border border-accent-gold/20 rounded-luxury focus:outline-none focus:border-accent-gold transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        className="w-4 h-4 mt-0.5 bg-background-primary border-accent-gold/20 rounded focus:ring-accent-gold"
                      />
                      <span className="text-sm text-text-secondary">
                        I agree to the{' '}
                        <Link href="/terms" className="text-accent-gold hover:text-accent-gold/80">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-accent-gold hover:text-accent-gold/80">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="subscribeNewsletter"
                        checked={formData.subscribeNewsletter}
                        onChange={handleChange}
                        className="w-4 h-4 mt-0.5 bg-background-primary border-accent-gold/20 rounded focus:ring-accent-gold"
                      />
                      <span className="text-sm text-text-secondary">
                        Send me exclusive offers, recommendations, and cigar news
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-luxury-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      'Creating Account...'
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        Create Account
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-text-muted">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="text-accent-gold hover:text-accent-gold/80 transition-colors font-medium"
                  >
                    Sign in
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