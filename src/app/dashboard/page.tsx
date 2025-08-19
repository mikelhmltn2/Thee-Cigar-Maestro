'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import {
  User,
  Package,
  Heart,
  Settings,
  Award,
  TrendingUp,
  Calendar,
  ShoppingBag,
  Star,
  Bell,
  LogOut,
  ChevronRight,
} from 'lucide-react';

const sidebarItems = [
  { icon: User, label: 'Profile', id: 'profile' },
  { icon: Package, label: 'Orders', id: 'orders' },
  { icon: Heart, label: 'Favorites', id: 'favorites' },
  { icon: Award, label: 'Rewards', id: 'rewards' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

const recentOrders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    items: 3,
    total: 875,
    status: 'Delivered',
  },
  {
    id: 'ORD-002',
    date: '2024-01-10',
    items: 2,
    total: 450,
    status: 'In Transit',
  },
  {
    id: 'ORD-003',
    date: '2024-01-05',
    items: 5,
    total: 1250,
    status: 'Processing',
  },
];

const favoriteItems = [
  { name: 'Cohiba Behike 56', price: 450, rating: 4.9 },
  { name: 'Davidoff Winston Churchill', price: 320, rating: 4.8 },
  { name: 'Padron 1926 Serie', price: 380, rating: 4.9 },
];

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('profile');

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold">Profile Information</h2>
            <div className="bg-background-secondary rounded-luxury-xl p-6 border border-accent-gold/20">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue="John"
                    className="w-full px-4 py-3 bg-background-primary border border-accent-gold/20 rounded-luxury"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue="Doe"
                    className="w-full px-4 py-3 bg-background-primary border border-accent-gold/20 rounded-luxury"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="john@example.com"
                    className="w-full px-4 py-3 bg-background-primary border border-accent-gold/20 rounded-luxury"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 000-0000"
                    className="w-full px-4 py-3 bg-background-primary border border-accent-gold/20 rounded-luxury"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button className="btn-luxury-primary">Save Changes</button>
              </div>
            </div>

            <div className="bg-background-secondary rounded-luxury-xl p-6 border border-accent-gold/20">
              <h3 className="text-xl font-display font-bold mb-4">Cigar Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Strength</label>
                  <select className="w-full px-4 py-3 bg-background-primary border border-accent-gold/20 rounded-luxury">
                    <option>Medium</option>
                    <option>Mild</option>
                    <option>Full</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Favorite Origins</label>
                  <div className="flex flex-wrap gap-2">
                    {['Cuba', 'Nicaragua', 'Dominican Republic', 'Honduras'].map((origin) => (
                      <span
                        key={origin}
                        className="px-3 py-1 bg-background-accent rounded-full text-sm"
                      >
                        {origin}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold">Order History</h2>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-background-secondary rounded-luxury-xl p-6 border border-accent-gold/20 hover:border-accent-gold/40 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-text-muted">{order.date}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.status === 'Delivered'
                          ? 'bg-green-500/20 text-green-400'
                          : order.status === 'In Transit'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-text-secondary">
                      {order.items} items • ${order.total}
                    </p>
                    <button className="text-accent-gold hover:text-accent-gold/80 flex items-center gap-1">
                      View Details <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold">Your Favorites</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {favoriteItems.map((item) => (
                <div
                  key={item.name}
                  className="bg-background-secondary rounded-luxury-xl p-6 border border-accent-gold/20 hover:border-accent-gold/40 transition-colors"
                >
                  <h3 className="font-medium mb-2">{item.name}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold gold-gradient-text">${item.price}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent-gold text-accent-gold" />
                      <span className="text-sm">{item.rating}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="btn-luxury-primary flex-1">Add to Cart</button>
                    <button className="btn-luxury-secondary">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'rewards':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold">Rewards & Points</h2>
            <div className="bg-gradient-to-br from-accent-gold/20 to-accent-copper/20 rounded-luxury-xl p-8 border border-accent-gold/30">
              <div className="text-center">
                <p className="text-5xl font-display font-bold gold-gradient-text mb-2">2,450</p>
                <p className="text-text-secondary">Total Points</p>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">15</p>
                  <p className="text-sm text-text-muted">Orders</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">Gold</p>
                  <p className="text-sm text-text-muted">Tier</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">$245</p>
                  <p className="text-sm text-text-muted">Saved</p>
                </div>
              </div>
            </div>
            <div className="bg-background-secondary rounded-luxury-xl p-6 border border-accent-gold/20">
              <h3 className="text-xl font-display font-bold mb-4">Available Rewards</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-background-accent rounded-luxury">
                  <span>10% Off Next Purchase</span>
                  <button className="text-accent-gold">500 pts</button>
                </div>
                <div className="flex justify-between items-center p-3 bg-background-accent rounded-luxury">
                  <span>Free Shipping</span>
                  <button className="text-accent-gold">300 pts</button>
                </div>
                <div className="flex justify-between items-center p-3 bg-background-accent rounded-luxury">
                  <span>Exclusive Cigar Sample</span>
                  <button className="text-accent-gold">1000 pts</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold">Account Settings</h2>
            <div className="bg-background-secondary rounded-luxury-xl p-6 border border-accent-gold/20">
              <h3 className="text-xl font-display font-bold mb-4">Notifications</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span>Email notifications</span>
                  <input type="checkbox" defaultChecked className="toggle" />
                </label>
                <label className="flex items-center justify-between">
                  <span>SMS notifications</span>
                  <input type="checkbox" className="toggle" />
                </label>
                <label className="flex items-center justify-between">
                  <span>Newsletter subscription</span>
                  <input type="checkbox" defaultChecked className="toggle" />
                </label>
              </div>
            </div>
            <div className="bg-background-secondary rounded-luxury-xl p-6 border border-accent-gold/20">
              <h3 className="text-xl font-display font-bold mb-4">Security</h3>
              <div className="space-y-4">
                <button className="btn-luxury-secondary w-full">Change Password</button>
                <button className="btn-luxury-secondary w-full">Enable Two-Factor Authentication</button>
              </div>
            </div>
            <div className="bg-background-secondary rounded-luxury-xl p-6 border border-accent-gold/20">
              <h3 className="text-xl font-display font-bold mb-4">Account Actions</h3>
              <div className="space-y-4">
                <button className="btn-luxury-secondary w-full">Export Data</button>
                <button className="text-red-500 hover:text-red-400 w-full py-3 border border-red-500/20 rounded-luxury hover:border-red-500/40 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background-primary to-background-secondary">
      <Navigation />

      {/* Dashboard Header */}
      <section className="py-12 border-b border-accent-gold/20">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-luxury-heading mb-2">
              Welcome Back, <span className="gold-gradient-text">John</span>
            </h1>
            <p className="text-text-secondary">Manage your account and track your cigar journey</p>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Stats */}
      <section className="py-8 border-b border-accent-gold/20">
        <div className="container-luxury">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-accent-gold" />
              <p className="text-2xl font-bold">15</p>
              <p className="text-sm text-text-muted">Total Orders</p>
            </div>
            <div className="text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-accent-gold" />
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-text-muted">Favorites</p>
            </div>
            <div className="text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-accent-gold" />
              <p className="text-2xl font-bold">2,450</p>
              <p className="text-sm text-text-muted">Reward Points</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-accent-gold" />
              <p className="text-2xl font-bold">Gold</p>
              <p className="text-sm text-text-muted">Member Tier</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="section-luxury">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-background-secondary rounded-luxury-xl p-6 border border-accent-gold/20 sticky top-24">
                <nav className="space-y-2">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-luxury transition-colors ${
                          activeSection === item.id
                            ? 'bg-gradient-to-r from-accent-gold/20 to-accent-copper/20 text-accent-gold'
                            : 'hover:bg-background-accent text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-luxury hover:bg-background-accent text-red-500 hover:text-red-400 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}