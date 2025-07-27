/**
 * Advanced Search Engine with Fuzzy Matching and Faceted Search
 * Provides comprehensive search capabilities across all cigar data
 */

import storageManager from './storage.js';

class SearchEngine {
  constructor() {
    this.searchIndex = new Map();
    this.facetIndex = new Map();
    this.searchHistory = [];
    this.maxHistorySize = 50;
    this.defaultWeights = {
      exact: 100,
      startsWith: 80,
      contains: 60,
      fuzzy: 40,
      phonetic: 30
    };
    
    this.setupSearchFilters();
    this.loadSearchHistory();
  }

  setupSearchFilters() {
    this.searchableFields = {
      cigars: {
        primary: ['name', 'wrapper', 'flavor'],
        secondary: ['origin', 'strength', 'size', 'brand'],
        metadata: ['construction', 'priceRange', 'availability']
      },
      pairings: {
        primary: ['spirit', 'cocktail', 'food'],
        secondary: ['category', 'profile', 'season'],
        metadata: ['occasion', 'intensity', 'harmony']
      },
      education: {
        primary: ['title', 'topic', 'content'],
        secondary: ['level', 'category', 'instructor'],
        metadata: ['duration', 'ceuCredits', 'prerequisites']
      }
    };

    this.facets = {
      wrapper: {
        type: 'categorical',
        values: ['Maduro', 'Connecticut', 'Habano', 'Natural', 'Oscuro', 'Candela']
      },
      strength: {
        type: 'ordinal',
        values: ['Mild', 'Mild-Medium', 'Medium', 'Medium-Full', 'Full']
      },
      priceRange: {
        type: 'range',
        min: 0,
        max: 100,
        step: 5
      },
      origin: {
        type: 'categorical',
        values: ['Dominican', 'Nicaraguan', 'Cuban', 'Honduran', 'Mexican', 'Ecuadorian']
      },
      size: {
        type: 'categorical',
        values: ['Robusto', 'Churchill', 'Corona', 'Torpedo', 'Toro', 'Gordo']
      }
    };
  }

  async loadSearchHistory() {
    try {
      const history = await storageManager.getLocal('searchHistory');
      if (history && Array.isArray(history)) {
        this.searchHistory = history;
      }
    } catch (e) {
      console.warn('Failed to load search history:', e);
    }
  }

  async saveSearchHistory() {
    try {
      await storageManager.setLocal('searchHistory', this.searchHistory);
    } catch (e) {
      console.warn('Failed to save search history:', e);
    }
  }

  // Index building
  buildSearchIndex(data) {
    this.searchIndex.clear();
    this.facetIndex.clear();

    Object.entries(data).forEach(([category, items]) => {
      if (!Array.isArray(items)) return;

      items.forEach((item, index) => {
        const docId = `${category}_${index}`;
        const searchDocument = this.createSearchDocument(item, category, docId);
        
        this.searchIndex.set(docId, searchDocument);
        this.updateFacetIndex(searchDocument);
      });
    });

    console.log(`Search index built with ${this.searchIndex.size} documents`);
  }

  createSearchDocument(item, category, docId) {
    const fields = this.searchableFields[category] || this.searchableFields.cigars;
    const doc = {
      id: docId,
      category,
      originalData: item,
      searchableText: '',
      fields: {},
      facets: {}
    };

    // Extract searchable text from all fields
    const allFields = [...fields.primary, ...fields.secondary, ...fields.metadata];
    
    allFields.forEach(field => {
      const value = this.extractFieldValue(item, field);
      if (value) {
        doc.fields[field] = value;
        doc.searchableText += ` ${value}`.toLowerCase();
        
        // Add to facets if it's a facet field
        if (this.facets[field]) {
          doc.facets[field] = value;
        }
      }
    });

    // Create phonetic representations
    doc.phonetic = this.createPhoneticIndex(doc.searchableText);
    
    // Create n-grams for fuzzy matching
    doc.ngrams = this.createNGrams(doc.searchableText);

    return doc;
  }

  extractFieldValue(item, field) {
    // Handle nested field access
    if (field.includes('.')) {
      return field.split('.').reduce((obj, key) => obj?.[key], item);
    }
    
    return item[field];
  }

  updateFacetIndex(doc) {
    Object.entries(doc.facets).forEach(([facet, value]) => {
      if (!this.facetIndex.has(facet)) {
        this.facetIndex.set(facet, new Map());
      }
      
      const facetMap = this.facetIndex.get(facet);
      if (!facetMap.has(value)) {
        facetMap.set(value, new Set());
      }
      
      facetMap.get(value).add(doc.id);
    });
  }

  // Search methods
  search(query, options = {}) {
    const {
      filters = {},
      facets = {},
      sortBy = 'relevance',
      sortOrder = 'desc',
      limit = 50,
      offset = 0,
      fuzzyThreshold = 0.6,
      includeSnippets = true
    } = options;

    if (!query.trim() && Object.keys(filters).length === 0 && Object.keys(facets).length === 0) {
      return this.getAllResults(limit, offset);
    }

    // Add to search history
    this.addToSearchHistory(query, filters, facets);

    const startTime = performance.now();
    
    // Get candidate documents
    let candidates = this.getCandidateDocuments(query, facets);
    
    // Apply filters
    candidates = this.applyFilters(candidates, filters);
    
    // Score documents
    const scoredResults = this.scoreDocuments(candidates, query, fuzzyThreshold);
    
    // Sort results
    const sortedResults = this.sortResults(scoredResults, sortBy, sortOrder);
    
    // Apply pagination
    const paginatedResults = sortedResults.slice(offset, offset + limit);
    
    // Add snippets if requested
    const finalResults = includeSnippets 
      ? this.addSnippets(paginatedResults, query)
      : paginatedResults;

    const searchTime = performance.now() - startTime;

    return {
      results: finalResults,
      totalCount: sortedResults.length,
      searchTime: Math.round(searchTime),
      query,
      filters,
      facets,
      availableFacets: this.getAvailableFacets(sortedResults)
    };
  }

  getCandidateDocuments(query, facets) {
    if (!query.trim() && Object.keys(facets).length === 0) {
      return Array.from(this.searchIndex.values());
    }

    let candidates = new Set();

    // Get documents matching facets
    if (Object.keys(facets).length > 0) {
      candidates = this.getDocumentsByFacets(facets);
    }

    // Get documents matching query
    if (query.trim()) {
      const queryMatches = this.getDocumentsByQuery(query);
      
      if (candidates.size === 0) {
        candidates = queryMatches;
      } else {
        // Intersection of facet and query matches
        candidates = new Set([...candidates].filter(doc => queryMatches.has(doc)));
      }
    }

    return Array.from(candidates);
  }

  getDocumentsByFacets(facets) {
    const facetSets = Object.entries(facets).map(([facet, values]) => {
      const facetMap = this.facetIndex.get(facet);
      if (!facetMap) return new Set();

      const valueArray = Array.isArray(values) ? values : [values];
      const matchingDocs = new Set();

      valueArray.forEach(value => {
        const docs = facetMap.get(value);
        if (docs) {
          docs.forEach(docId => {
            const doc = this.searchIndex.get(docId);
            if (doc) matchingDocs.add(doc);
          });
        }
      });

      return matchingDocs;
    });

    // Intersection of all facet matches
    if (facetSets.length === 0) return new Set();
    
    return facetSets.reduce((intersection, set) => {
      return new Set([...intersection].filter(doc => set.has(doc)));
    });
  }

  getDocumentsByQuery(query) {
    const matches = new Set();
    const normalizedQuery = query.toLowerCase().trim();
    const queryTerms = normalizedQuery.split(/\s+/);

    this.searchIndex.forEach(doc => {
      // Check for exact matches
      if (doc.searchableText.includes(normalizedQuery)) {
        matches.add(doc);
        return;
      }

      // Check for term matches
      const hasAllTerms = queryTerms.every(term =>
        doc.searchableText.includes(term) ||
        this.fuzzyMatch(term, doc.searchableText) > 0.7
      );

      if (hasAllTerms) {
        matches.add(doc);
      }
    });

    return matches;
  }

  scoreDocuments(documents, query, fuzzyThreshold) {
    const normalizedQuery = query.toLowerCase().trim();
    const queryTerms = normalizedQuery.split(/\s+/);

    return documents.map(doc => {
      let score = 0;
      const matches = [];

      // Exact match bonus
      if (doc.searchableText.includes(normalizedQuery)) {
        score += this.defaultWeights.exact;
        matches.push({ type: 'exact', text: normalizedQuery });
      }

      // Field-specific scoring
      Object.entries(doc.fields).forEach(([field, value]) => {
        const fieldValue = value.toLowerCase();
        const fieldWeight = this.getFieldWeight(field, doc.category);

        queryTerms.forEach(term => {
          if (fieldValue === term) {
            score += this.defaultWeights.exact * fieldWeight;
            matches.push({ type: 'exactField', field, text: term });
          } else if (fieldValue.startsWith(term)) {
            score += this.defaultWeights.startsWith * fieldWeight;
            matches.push({ type: 'startsWith', field, text: term });
          } else if (fieldValue.includes(term)) {
            score += this.defaultWeights.contains * fieldWeight;
            matches.push({ type: 'contains', field, text: term });
          } else {
            const fuzzyScore = this.fuzzyMatch(term, fieldValue);
            if (fuzzyScore >= fuzzyThreshold) {
              score += this.defaultWeights.fuzzy * fuzzyScore * fieldWeight;
              matches.push({ type: 'fuzzy', field, text: term, score: fuzzyScore });
            }
          }
        });
      });

      // Phonetic matching
      queryTerms.forEach(term => {
        const phoneticScore = this.phoneticMatch(term, doc.phonetic);
        if (phoneticScore > 0.8) {
          score += this.defaultWeights.phonetic * phoneticScore;
          matches.push({ type: 'phonetic', text: term, score: phoneticScore });
        }
      });

      return {
        document: doc,
        score,
        matches,
        relevance: this.calculateRelevance(score, matches, query)
      };
    }).filter(result => result.score > 0);
  }

  getFieldWeight(field, category) {
    const fields = this.searchableFields[category];
    if (fields.primary.includes(field)) return 1.0;
    if (fields.secondary.includes(field)) return 0.7;
    if (fields.metadata.includes(field)) return 0.4;
    return 0.3;
  }

  calculateRelevance(score, matches, query) {
    const queryLength = query.trim().length;
    const matchCount = matches.length;
    const exactMatches = matches.filter(m => m.type === 'exact').length;
    
    let relevance = score;
    
    // Boost for multiple matches
    relevance *= (1 + matchCount * 0.1);
    
    // Boost for exact matches
    relevance *= (1 + exactMatches * 0.2);
    
    // Boost for query length (longer queries are more specific)
    relevance *= Math.min(2, 1 + queryLength * 0.02);
    
    return relevance;
  }

  // Fuzzy matching algorithms
  fuzzyMatch(term, text) {
    return this.levenshteinSimilarity(term, text);
  }

  levenshteinSimilarity(a, b) {
    const matrix = Array(a.length + 1).fill().map(() => Array(b.length + 1).fill(0));
    
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
    
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    
    const maxLength = Math.max(a.length, b.length);
    return maxLength === 0 ? 1 : (maxLength - matrix[a.length][b.length]) / maxLength;
  }

  createPhoneticIndex(text) {
    // Simple phonetic algorithm (Soundex-like)
    return text.toLowerCase()
      .replace(/[^a-z]/g, '')
      .replace(/[aeiou]/g, '')
      .replace(/(.)\1+/g, '$1')
      .substring(0, 8);
  }

  phoneticMatch(term, phoneticIndex) {
    const termPhonetic = this.createPhoneticIndex(term);
    return this.levenshteinSimilarity(termPhonetic, phoneticIndex);
  }

  createNGrams(text, n = 3) {
    const ngrams = new Set();
    const cleanText = text.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    for (let i = 0; i <= cleanText.length - n; i++) {
      ngrams.add(cleanText.substring(i, i + n));
    }
    
    return ngrams;
  }

  // Filtering and sorting
  applyFilters(documents, filters) {
    if (Object.keys(filters).length === 0) return documents;

    return documents.filter(doc => {
      return Object.entries(filters).every(([field, condition]) => {
        const value = doc.fields[field] || doc.originalData[field];
        return this.evaluateFilter(value, condition);
      });
    });
  }

  evaluateFilter(value, condition) {
    if (typeof condition === 'string' || typeof condition === 'number') {
      return value === condition;
    }

    if (Array.isArray(condition)) {
      return condition.includes(value);
    }

    if (typeof condition === 'object') {
      const { min, max, operator = 'eq', text } = condition;

      switch (operator) {
        case 'eq': return value === text;
        case 'contains': return String(value).toLowerCase().includes(String(text).toLowerCase());
        case 'startsWith': return String(value).toLowerCase().startsWith(String(text).toLowerCase());
        case 'range': return value >= min && value <= max;
        case 'gt': return value > min;
        case 'gte': return value >= min;
        case 'lt': return value < max;
        case 'lte': return value <= max;
        default: return true;
      }
    }

    return true;
  }

  sortResults(results, sortBy, sortOrder) {
    const multiplier = sortOrder === 'desc' ? -1 : 1;

    return results.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'relevance':
          comparison = a.relevance - b.relevance;
          break;
        case 'name':
          comparison = (a.document.fields.name || '').localeCompare(b.document.fields.name || '');
          break;
        case 'wrapper':
          comparison = (a.document.fields.wrapper || '').localeCompare(b.document.fields.wrapper || '');
          break;
        case 'strength':
          const strengthOrder = ['Mild', 'Mild-Medium', 'Medium', 'Medium-Full', 'Full'];
          const aStrength = strengthOrder.indexOf(a.document.fields.strength) ?? 0;
          const bStrength = strengthOrder.indexOf(b.document.fields.strength) ?? 0;
          comparison = aStrength - bStrength;
          break;
        default:
          comparison = a.score - b.score;
      }

      return comparison * multiplier;
    });
  }

  addSnippets(results, query) {
    const queryTerms = query.toLowerCase().split(/\s+/);

    return results.map(result => {
      const snippets = [];
      const maxSnippetLength = 150;

      Object.entries(result.document.fields).forEach(([field, value]) => {
        const fieldValue = String(value);
        const lowerValue = fieldValue.toLowerCase();

        queryTerms.forEach(term => {
          const index = lowerValue.indexOf(term);
          if (index !== -1) {
            const start = Math.max(0, index - 50);
            const end = Math.min(fieldValue.length, index + term.length + 50);
            let snippet = fieldValue.substring(start, end);

            if (start > 0) snippet = '...' + snippet;
            if (end < fieldValue.length) snippet = snippet + '...';

            // Highlight the term
            const regex = new RegExp(`(${term})`, 'gi');
            snippet = snippet.replace(regex, '<mark>$1</mark>');

            snippets.push({
              field,
              text: snippet,
              term
            });
          }
        });
      });

      return {
        ...result,
        snippets
      };
    });
  }

  // Utility methods
  getAllResults(limit, offset) {
    const allDocs = Array.from(this.searchIndex.values());
    const paginatedDocs = allDocs.slice(offset, offset + limit);

    return {
      results: paginatedDocs.map(doc => ({
        document: doc,
        score: 1,
        matches: [],
        relevance: 1,
        snippets: []
      })),
      totalCount: allDocs.length,
      searchTime: 0,
      query: '',
      filters: {},
      facets: {},
      availableFacets: this.getAvailableFacets(allDocs.map(doc => ({ document: doc })))
    };
  }

  getAvailableFacets(results) {
    const facets = {};

    Object.keys(this.facets).forEach(facetName => {
      const facetConfig = this.facets[facetName];
      facets[facetName] = {
        type: facetConfig.type,
        values: []
      };

      if (facetConfig.type === 'categorical') {
        const valueCounts = new Map();
        
        results.forEach(result => {
          const value = result.document.facets[facetName];
          if (value) {
            valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
          }
        });

        facets[facetName].values = Array.from(valueCounts.entries())
          .map(([value, count]) => ({ value, count }))
          .sort((a, b) => b.count - a.count);
      } else if (facetConfig.type === 'range') {
        const values = results
          .map(result => result.document.facets[facetName])
          .filter(value => value !== undefined)
          .map(value => Number(value));

        if (values.length > 0) {
          facets[facetName].min = Math.min(...values);
          facets[facetName].max = Math.max(...values);
          facets[facetName].step = facetConfig.step;
        }
      }
    });

    return facets;
  }

  addToSearchHistory(query, filters, facets) {
    if (!query.trim()) return;

    const searchEntry = {
      query,
      filters,
      facets,
      timestamp: Date.now()
    };

    // Remove duplicate
    this.searchHistory = this.searchHistory.filter(entry => entry.query !== query);
    
    // Add to beginning
    this.searchHistory.unshift(searchEntry);
    
    // Limit size
    if (this.searchHistory.length > this.maxHistorySize) {
      this.searchHistory = this.searchHistory.slice(0, this.maxHistorySize);
    }

    this.saveSearchHistory();
  }

  getSearchHistory() {
    return this.searchHistory;
  }

  clearSearchHistory() {
    this.searchHistory = [];
    this.saveSearchHistory();
  }

  getSearchSuggestions(query) {
    const suggestions = new Set();
    const normalizedQuery = query.toLowerCase().trim();

    if (normalizedQuery.length < 2) return [];

    // Add from search history
    this.searchHistory.forEach(entry => {
      if (entry.query.toLowerCase().includes(normalizedQuery)) {
        suggestions.add(entry.query);
      }
    });

    // Add from indexed terms
    this.searchIndex.forEach(doc => {
      Object.values(doc.fields).forEach(value => {
        const stringValue = String(value).toLowerCase();
        if (stringValue.includes(normalizedQuery)) {
          suggestions.add(String(value));
        }
      });
    });

    return Array.from(suggestions)
      .slice(0, 10)
      .sort((a, b) => a.length - b.length);
  }

  getPopularSearches(limit = 10) {
    const queryCount = new Map();
    
    this.searchHistory.forEach(entry => {
      const count = queryCount.get(entry.query) || 0;
      queryCount.set(entry.query, count + 1);
    });

    return Array.from(queryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([query, count]) => ({ query, count }));
  }

  exportSearchData() {
    return {
      searchHistory: this.searchHistory,
      indexSize: this.searchIndex.size,
      facetCounts: Object.fromEntries(
        Array.from(this.facetIndex.entries()).map(([facet, values]) => [
          facet,
          values.size
        ])
      )
    };
  }
}

// Create singleton instance
const searchEngine = new SearchEngine();

export default searchEngine;