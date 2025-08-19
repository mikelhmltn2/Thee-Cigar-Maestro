'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag, User, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Cigars', href: '/cigars' },
    { name: 'Pairings', href: '/pairings' },
    { name: 'AI Concierge', href: '/ai-concierge' },
    { name: 'Blog', href: '/blog' },
    { name: 'Shop', href: '/shop' },
    { name: 'Virtual Humidor', href: '/humidor' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background-primary/90 backdrop-blur-lg shadow-luxury' : 'bg-transparent'
      }`}
    >
      <div className='container-luxury'>
        <div className='flex items-center justify-between h-20'>
          {/* Logo */}
          <Link href='/' className='flex items-center space-x-3 group'>
            <div className='w-12 h-12 bg-gradient-gold rounded-luxury flex items-center justify-center shadow-gold group-hover:shadow-gold-lg transition-all duration-300'>
              <span className='text-background-primary font-display font-bold text-xl'>CM</span>
            </div>
            <div className='hidden md:block'>
              <h1 className='font-display text-xl font-bold text-luxury-gold'>
                Thee Cigar Maestro
              </h1>
              <p className='text-xs text-text-muted font-accent italic'>
                The Art. The Ritual. The Maestro.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden lg:flex items-center space-x-8'>
            {navItems.map(item => (
              <Link key={item.name} href={item.href} className='nav-link'>
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className='hidden lg:flex items-center space-x-4'>
            <button className='btn-ghost p-2' aria-label='Search'>
              <Search size={20} />
            </button>
            <Link href='/account' className='btn-ghost p-2' aria-label='Account'>
              <User size={20} />
            </Link>
            <Link href='/cart' className='btn-ghost p-2 relative' aria-label='Shopping Cart'>
              <ShoppingBag size={20} />
              <span className='absolute -top-1 -right-1 bg-luxury-gold text-background-primary text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium'>
                0
              </span>
            </Link>
            <Link href='/shop' className='btn-primary'>
              Shop Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='lg:hidden btn-ghost p-2'
            aria-label='Toggle menu'
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='lg:hidden bg-background-secondary/95 backdrop-blur-lg border-t border-text-muted/20'
          >
            <div className='container-luxury py-6'>
              <div className='flex flex-col space-y-4'>
                {navItems.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className='nav-link text-lg py-2'
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className='flex items-center justify-between pt-4 border-t border-text-muted/20'>
                  <div className='flex items-center space-x-4'>
                    <button className='btn-ghost p-2' aria-label='Search'>
                      <Search size={20} />
                    </button>
                    <Link href='/account' className='btn-ghost p-2' aria-label='Account'>
                      <User size={20} />
                    </Link>
                    <Link
                      href='/cart'
                      className='btn-ghost p-2 relative'
                      aria-label='Shopping Cart'
                    >
                      <ShoppingBag size={20} />
                      <span className='absolute -top-1 -right-1 bg-luxury-gold text-background-primary text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium'>
                        0
                      </span>
                    </Link>
                  </div>
                  <Link href='/shop' className='btn-primary'>
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
