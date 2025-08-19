'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Search, Filter, ShoppingCart, Star, Heart, Eye } from 'lucide-react';

interface Cigar {
  id: string;
  name: string;
  brand: string;
  origin: string;
  strength: 'Mild' | 'Medium' | 'Full';
  price: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  flavorProfile: string[];
  size: string;
  wrapper: string;
  inStock: boolean;
}

const mockCigars: Cigar[] = [
  {
    id: '1',
    name: 'Cohiba Behike 56',
    brand: 'Cohiba',
    origin: 'Cuba',
    strength: 'Medium',
    price: 450,
    rating: 4.9,
    reviews: 234,
    image: '/images/cigars/cohiba-behike.jpg',
    description: 'The pinnacle of Cuban craftsmanship',
    flavorProfile: ['Cedar', 'Leather', 'Coffee', 'Cocoa'],
    size: '56 x 166mm',
    wrapper: 'Cuban',
    inStock: true,
  },
  {
    id: '2',
    name: 'Davidoff Winston Churchill',
    brand: 'Davidoff',
    origin: 'Dominican Republic',
    strength: 'Medium',
    price: 320,
    rating: 4.8,
    reviews: 189,
    image: '/images/cigars/davidoff-winston.jpg',
    description: 'A sophisticated blend worthy of its namesake',
    flavorProfile: ['Wood', 'Cream', 'Pepper', 'Nuts'],
    size: '50 x 127mm',
    wrapper: 'Ecuador',
    inStock: true,
  },
  {
    id: '3',
    name: 'Padron 1926 Serie No. 1',
    brand: 'Padron',
    origin: 'Nicaragua',
    strength: 'Full',
    price: 380,
    rating: 4.9,
    reviews: 312,
    image: '/images/cigars/padron-1926.jpg',
    description: 'Anniversary edition with complex aged tobacco',
    flavorProfile: ['Dark Chocolate', 'Espresso', 'Earth', 'Spice'],
    size: '54 x 133mm',
    wrapper: 'Nicaragua',
    inStock: true,
  },
  {
    id: '4',
    name: 'Arturo Fuente OpusX',
    brand: 'Arturo Fuente',
    origin: 'Dominican Republic',
    strength: 'Full',
    price: 425,
    rating: 4.8,
    reviews: 267,
    image: '/images/cigars/opus-x.jpg',
    description: 'The legendary Dominican puro',
    flavorProfile: ['Leather', 'Cedar', 'Spice', 'Sweet'],
    size: '52 x 152mm',
    wrapper: 'Dominican',
    inStock: false,
  },
  {
    id: '5',
    name: 'Montecristo No. 2',
    brand: 'Montecristo',
    origin: 'Cuba',
    strength: 'Medium',
    price: 280,
    rating: 4.7,
    reviews: 456,
    image: '/images/cigars/montecristo-2.jpg',
    description: 'The classic Cuban torpedo',
    flavorProfile: ['Coffee', 'Vanilla', 'Wood', 'Honey'],
    size: '52 x 156mm',
    wrapper: 'Cuban',
    inStock: true,
  },
  {
    id: '6',
    name: 'Liga Privada No. 9',
    brand: 'Drew Estate',
    origin: 'Nicaragua',
    strength: 'Full',
    price: 295,
    rating: 4.8,
    reviews: 198,
    image: '/images/cigars/liga-privada.jpg',
    description: 'Dark, oily, and incredibly complex',
    flavorProfile: ['Dark Chocolate', 'Coffee', 'Earth', 'Black Pepper'],
    size: '52 x 152mm',
    wrapper: 'Connecticut Broadleaf',
    inStock: true,
  },
];

export default function ProductsPage() {
  const [cigars, setCigars] = useState<Cigar[]>(mockCigars);
  const [filteredCigars, setFilteredCigars] = useState<Cigar[]>(mockCigars);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStrength, setSelectedStrength] = useState<string>('all');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    let filtered = [...cigars];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (cigar) =>
          cigar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cigar.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cigar.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Strength filter
    if (selectedStrength !== 'all') {
      filtered = filtered.filter((cigar) => cigar.strength === selectedStrength);
    }

    // Origin filter
    if (selectedOrigin !== 'all') {
      filtered = filtered.filter((cigar) => cigar.origin === selectedOrigin);
    }

    // Price filter
    filtered = filtered.filter(
      (cigar) => cigar.price >= priceRange[0] && cigar.price <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // featured - keep original order
        break;
    }

    setFilteredCigars(filtered);
  }, [searchTerm, selectedStrength, selectedOrigin, priceRange, sortBy, cigars]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const origins = ['all', ...Array.from(new Set(cigars.map((c) => c.origin)))];
  const strengths = ['all', 'Mild', 'Medium', 'Full'];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background-primary to-background-secondary">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/10 to-transparent" />
        <div className="container-luxury relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-luxury-heading mb-6">
              Our Premium <span className="gold-gradient-text">Collection</span>
            </h1>
            <p className="text-luxury-body text-text-secondary">
              Discover our meticulously curated selection of the world's finest cigars,
              each chosen for its exceptional quality, heritage, and flavor profile.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <section className="sticky top-0 z-40 bg-background-primary/95 backdrop-blur-md border-b border-accent-gold/20">
        <div className="container-luxury py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="text"
                placeholder="Search cigars, brands, or flavors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-background-secondary border border-accent-gold/20 rounded-luxury focus:outline-none focus:border-accent-gold transition-colors"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-luxury-secondary flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-background-secondary border border-accent-gold/20 rounded-luxury focus:outline-none focus:border-accent-gold transition-colors"
            >
              <option value="featured">Featured</option>
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-accent-gold/20"
            >
              {/* Strength Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Strength</label>
                <select
                  value={selectedStrength}
                  onChange={(e) => setSelectedStrength(e.target.value)}
                  className="w-full px-4 py-2 bg-background-secondary border border-accent-gold/20 rounded-luxury focus:outline-none focus:border-accent-gold"
                >
                  {strengths.map((strength) => (
                    <option key={strength} value={strength}>
                      {strength === 'all' ? 'All Strengths' : strength}
                    </option>
                  ))}
                </select>
              </div>

              {/* Origin Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Origin</label>
                <select
                  value={selectedOrigin}
                  onChange={(e) => setSelectedOrigin(e.target.value)}
                  className="w-full px-4 py-2 bg-background-secondary border border-accent-gold/20 rounded-luxury focus:outline-none focus:border-accent-gold"
                >
                  {origins.map((origin) => (
                    <option key={origin} value={origin}>
                      {origin === 'all' ? 'All Origins' : origin}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-luxury">
        <div className="container-luxury">
          {filteredCigars.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-text-muted">No cigars found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCigars.map((cigar, index) => (
                <motion.div
                  key={cigar.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-background-secondary rounded-luxury-xl overflow-hidden border border-accent-gold/20 hover:border-accent-gold/40 transition-all duration-300 hover:shadow-luxury-lg"
                >
                  {/* Image Container */}
                  <div className="relative h-64 bg-gradient-to-br from-background-accent to-background-secondary overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-background-secondary/80 to-transparent" />
                    {!cigar.inStock && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Out of Stock
                      </div>
                    )}
                    <button
                      onClick={() => toggleFavorite(cigar.id)}
                      className="absolute top-4 right-4 p-2 bg-background-primary/80 backdrop-blur-sm rounded-full hover:bg-background-primary transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.includes(cigar.id)
                            ? 'fill-accent-gold text-accent-gold'
                            : 'text-text-muted'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Brand and Name */}
                    <div className="mb-3">
                      <p className="text-sm text-accent-gold font-medium">{cigar.brand}</p>
                      <h3 className="text-xl font-display font-bold mt-1">{cigar.name}</h3>
                    </div>

                    {/* Origin and Strength */}
                    <div className="flex items-center gap-4 mb-3 text-sm text-text-muted">
                      <span>{cigar.origin}</span>
                      <span>•</span>
                      <span>{cigar.strength}</span>
                      <span>•</span>
                      <span>{cigar.size}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(cigar.rating)
                                ? 'fill-accent-gold text-accent-gold'
                                : 'text-accent-gold/30'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-text-muted">
                        {cigar.rating} ({cigar.reviews})
                      </span>
                    </div>

                    {/* Flavor Profile */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {cigar.flavorProfile.slice(0, 3).map((flavor) => (
                        <span
                          key={flavor}
                          className="px-2 py-1 bg-background-accent text-xs rounded-full text-text-secondary"
                        >
                          {flavor}
                        </span>
                      ))}
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-accent-gold/10">
                      <div>
                        <p className="text-2xl font-bold gold-gradient-text">${cigar.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 bg-background-accent rounded-luxury hover:bg-accent-gold/20 transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          disabled={!cigar.inStock}
                          className="btn-luxury-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}