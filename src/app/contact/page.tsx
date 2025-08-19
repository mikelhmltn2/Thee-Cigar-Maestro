'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    details: '+1 (305) 555-0100',
    subtext: 'Mon-Fri 9AM-6PM EST',
  },
  {
    icon: Mail,
    title: 'Email',
    details: 'concierge@thecigarmaestro.com',
    subtext: '24/7 Response',
  },
  {
    icon: MapPin,
    title: 'Flagship Store',
    details: '1234 Luxury Lane, Miami, FL 33139',
    subtext: 'Visit our showroom',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: 'Mon-Sat: 10AM-8PM',
    subtext: 'Sunday: 12PM-6PM',
  },
];

const faqs = [
  {
    question: 'How do I know which cigar is right for me?',
    answer: 'Our AI concierge analyzes your preferences and taste profile to recommend the perfect cigars. You can also consult with our expert tobacconists.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship to over 45 countries worldwide. Shipping times and customs regulations vary by destination.',
  },
  {
    question: 'How are cigars stored during shipping?',
    answer: 'All cigars are shipped in humidity-controlled packaging to ensure they arrive in perfect condition.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day satisfaction guarantee on all purchases. Unopened boxes can be returned for a full refund.',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'general',
        message: '',
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background-primary to-background-secondary">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/10 via-transparent to-accent-copper/10" />
        </div>
        <div className="container-luxury relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-luxury-heading mb-6">
              Get in <span className="gold-gradient-text">Touch</span>
            </h1>
            <p className="text-luxury-body text-text-secondary">
              Whether you're seeking expert advice, have questions about our collection, or need
              assistance with your order, our dedicated team is here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="section-luxury">
        <div className="container-luxury">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-background-secondary rounded-luxury-xl p-6 border border-accent-gold/20 hover:border-accent-gold/40 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-accent-copper rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-background-primary" />
                  </div>
                  <h3 className="font-display font-bold mb-2">{info.title}</h3>
                  <p className="text-text-primary mb-1">{info.details}</p>
                  <p className="text-sm text-text-muted">{info.subtext}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Contact Form and AI Assistant */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-display font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-background-secondary border border-accent-gold/20 rounded-luxury focus:outline-none focus:border-accent-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-background-secondary border border-accent-gold/20 rounded-luxury focus:outline-none focus:border-accent-gold transition-colors"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-background-secondary border border-accent-gold/20 rounded-luxury focus:outline-none focus:border-accent-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-background-secondary border border-accent-gold/20 rounded-luxury focus:outline-none focus:border-accent-gold transition-colors"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="recommendation">Product Recommendation</option>
                      <option value="wholesale">Wholesale Inquiry</option>
                      <option value="event">Private Event</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-background-secondary border border-accent-gold/20 rounded-luxury focus:outline-none focus:border-accent-gold transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-luxury-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* AI Assistant Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-accent-gold/10 to-accent-copper/10 rounded-luxury-xl p-8 border border-accent-gold/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-accent-copper rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-background-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold">AI Concierge Available</h3>
                    <p className="text-sm text-text-muted">Get instant answers 24/7</p>
                  </div>
                </div>
                <p className="text-text-secondary mb-6">
                  Our AI-powered concierge can help you find the perfect cigar, answer questions about
                  our products, and provide personalized recommendations based on your preferences.
                </p>
                <button className="btn-luxury-secondary w-full flex items-center justify-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Start AI Chat
                </button>
              </div>

              {/* FAQ Section */}
              <div>
                <h3 className="text-2xl font-display font-bold mb-6">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-background-secondary rounded-luxury p-6 border border-accent-gold/20"
                    >
                      <h4 className="font-medium mb-2">{faq.question}</h4>
                      <p className="text-text-secondary text-sm">{faq.answer}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="section-luxury bg-background-accent/30">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h2 className="text-luxury-subheading mb-4">Visit Our Flagship Store</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Experience our collection in person at our Miami showroom, featuring a walk-in humidor,
              tasting lounge, and expert consultations.
            </p>
          </motion.div>
          <div className="h-[400px] bg-background-secondary rounded-luxury-xl border border-accent-gold/20 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-accent-gold mx-auto mb-4" />
              <p className="text-text-muted">Interactive map will be displayed here</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}