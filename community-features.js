/**
 * Community Features System for Thee Cigar Maestro
 * Provides social networking capabilities for cigar enthusiasts
 */

class CommunityManager {
  constructor() {
    this.apiClient = window.CigarMaestroAPI;
    this.currentUser = null;
    this.friends = [];
    this.communityPosts = [];
    this.events = [];
    this.forums = {};
    this.isInitialized = false;
    
    this.init();
  }

  async init() {
    try {
      await this.loadUserProfile();
      await this.initializeCommunityFeatures();
      this.setupEventListeners();
      this.createCommunityInterface();
      
      this.isInitialized = true;
      console.info('🤝 Community Manager initialized successfully');
      
    } catch (error) {
      console.error('❌ Community initialization failed:', error);
    }
  }

  async loadUserProfile() {
    // Load current user profile or create guest profile
    try {
      if (this.apiClient.isUserAuthenticated()) {
        this.currentUser = await this.apiClient.getUserProfile();
      } else {
        this.currentUser = this.createGuestProfile();
      }
    } catch (_error) {
      this.currentUser = this.createGuestProfile();
    }
  }

  createGuestProfile() {
    return {
      id: 'guest_' + Date.now(),
      username: 'Guest User',
      avatar: '👤',
      level: 'Beginner',
      badges: [],
      favorites: [],
      reviews: [],
      socialScore: 0,
      joinDate: new Date().toISOString(),
      isGuest: true
    };
  }

  async initializeCommunityFeatures() {
    // Initialize demo community data
    this.initializeDemoUsers();
    this.initializeDemoPosts();
    this.initializeDemoEvents();
    this.initializeDemoForums();
  }

  initializeDemoUsers() {
    this.friends = [
      {
        id: 'user_001',
        username: 'CigarMaster92',
        avatar: '🎩',
        level: 'Expert',
        badges: ['🏆 Master Reviewer', '🔥 Trending Curator'],
        lastSeen: '2 hours ago',
        mutualFriends: 5,
        reviewCount: 127,
        socialScore: 850
      },
      {
        id: 'user_002', 
        username: 'HavanaHunter',
        avatar: '🌟',
        level: 'Advanced',
        badges: ['🇨🇺 Cuban Specialist', '📸 Photo Pro'],
        lastSeen: '1 day ago',
        mutualFriends: 3,
        reviewCount: 89,
        socialScore: 720
      },
      {
        id: 'user_003',
        username: 'SmokeRingKing',
        avatar: '💨',
        level: 'Intermediate',
        badges: ['🎯 Pairing Expert'],
        lastSeen: '30 minutes ago',
        mutualFriends: 8,
        reviewCount: 45,
        socialScore: 520
      }
    ];
  }

  initializeDemoPosts() {
    this.communityPosts = [
      {
        id: 'post_001',
        userId: 'user_001',
        username: 'CigarMaster92',
        avatar: '🎩',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        type: 'review',
        content: {
          text: 'Just finished an incredible Cohiba Behike. The flavor complexity is unmatched - notes of chocolate, coffee, and a hint of spice. Perfect construction and draw. 9.5/10! 🔥',
          cigar: 'Cohiba Behike',
          rating: 9.5,
          image: '🚬'
        },
        likes: 23,
        comments: 7,
        shares: 4
      },
      {
        id: 'post_002',
        userId: 'user_002',
        username: 'HavanaHunter',
        avatar: '🌟',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        type: 'collection',
        content: {
          text: 'Added some rare vintage Cubans to my humidor today. Check out this beautiful Montecristo collection! 📸',
          image: '📦',
          collection: ['Montecristo No. 2', 'Montecristo Edmundo', 'Montecristo A']
        },
        likes: 18,
        comments: 12,
        shares: 6
      },
      {
        id: 'post_003',
        userId: 'user_003',
        username: 'SmokeRingKing',
        avatar: '💨',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        type: 'pairing',
        content: {
          text: 'Perfect evening pairing: Romeo y Julieta Churchill with a glass of Macallan 18. The smoky scotch complements the cigar\'s earthiness beautifully. 🥃',
          cigar: 'Romeo y Julieta Churchill',
          pairing: 'Macallan 18 Scotch',
          mood: 'evening'
        },
        likes: 31,
        comments: 9,
        shares: 8
      }
    ];
  }

  initializeDemoEvents() {
    this.events = [
      {
        id: 'event_001',
        title: 'Havana Nights Tasting Event',
        description: 'Join us for an exclusive Cuban cigar tasting featuring rare vintage selections.',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        location: 'Downtown Cigar Lounge',
        attendees: 24,
        maxAttendees: 30,
        price: '$75',
        host: 'CigarMaster92',
        image: '🌃',
        tags: ['Cuban', 'Tasting', 'Premium']
      },
      {
        id: 'event_002',
        title: 'Beginner\'s Cigar Workshop',
        description: 'Learn the basics of cigar appreciation, cutting, lighting, and flavor identification.',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        location: 'Community Center',
        attendees: 12,
        maxAttendees: 20,
        price: 'Free',
        host: 'SmokeRingKing',
        image: '🎓',
        tags: ['Beginner', 'Workshop', 'Education']
      },
      {
        id: 'event_003',
        title: 'Monthly Cigar & Whiskey Pairing',
        description: 'Explore the art of pairing cigars with premium whiskeys and spirits.',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
        location: 'Whiskey Bar & Lounge',
        attendees: 18,
        maxAttendees: 25,
        price: '$95',
        host: 'HavanaHunter',
        image: '🥃',
        tags: ['Pairing', 'Whiskey', 'Premium']
      }
    ];
  }

  initializeDemoForums() {
    this.forums = {
      general: {
        id: 'general',
        title: 'General Discussion',
        description: 'Talk about anything cigar-related',
        posts: 1247,
        members: 892,
        lastActivity: '5 minutes ago',
        moderators: ['CigarMaster92']
      },
      reviews: {
        id: 'reviews',
        title: 'Cigar Reviews',
        description: 'Share your detailed cigar reviews and ratings',
        posts: 2156,
        members: 634,
        lastActivity: '12 minutes ago',
        moderators: ['HavanaHunter']
      },
      beginners: {
        id: 'beginners',
        title: 'Beginners Corner',
        description: 'New to cigars? Ask questions and get advice',
        posts: 567,
        members: 423,
        lastActivity: '1 hour ago',
        moderators: ['SmokeRingKing']
      },
      trading: {
        id: 'trading',
        title: 'Trading Post',
        description: 'Buy, sell, and trade cigars with the community',
        posts: 834,
        members: 298,
        lastActivity: '3 hours ago',
        moderators: ['CigarMaster92', 'HavanaHunter']
      }
    };
  }

  createCommunityInterface() {
    if (document.getElementById('community-panel')) return;

    const communityPanel = document.createElement('div');
    communityPanel.id = 'community-panel';
    communityPanel.className = 'community-panel';
    communityPanel.style.cssText = `
      position: fixed;
      top: 0;
      right: -400px;
      width: 400px;
      height: 100vh;
      background: linear-gradient(135deg, #2c1810 0%, #1a0f08 100%);
      border-left: 2px solid #c69c6d;
      z-index: 1000;
      transition: right 0.3s ease;
      overflow-y: auto;
      box-shadow: -5px 0 15px rgba(0,0,0,0.3);
    `;

    communityPanel.innerHTML = `
      <div class="community-header" style="
        padding: 1.5rem;
        background: rgba(198, 156, 109, 0.1);
        border-bottom: 1px solid #c69c6d;
        position: sticky;
        top: 0;
        z-index: 100;
        backdrop-filter: blur(10px);
      ">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h2 style="color: #c69c6d; margin: 0; font-size: 1.5rem;">🤝 Community</h2>
          <button id="close-community-btn" style="
            background: none;
            border: none;
            color: #c69c6d;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
          ">✕</button>
        </div>
        
        <div class="community-tabs" style="
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        ">
          <button class="tab-btn active" data-tab="feed" style="
            background: #c69c6d;
            color: #1a0f08;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
          ">Feed</button>
          <button class="tab-btn" data-tab="friends" style="
            background: rgba(198, 156, 109, 0.2);
            color: #c69c6d;
            border: 1px solid #c69c6d;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s;
          ">Friends</button>
          <button class="tab-btn" data-tab="events" style="
            background: rgba(198, 156, 109, 0.2);
            color: #c69c6d;
            border: 1px solid #c69c6d;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s;
          ">Events</button>
          <button class="tab-btn" data-tab="forums" style="
            background: rgba(198, 156, 109, 0.2);
            color: #c69c6d;
            border: 1px solid #c69c6d;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s;
          ">Forums</button>
        </div>
      </div>

      <div class="community-content" style="padding: 1rem;">
        <div id="tab-feed" class="tab-content active"></div>
        <div id="tab-friends" class="tab-content hidden"></div>
        <div id="tab-events" class="tab-content hidden"></div>
        <div id="tab-forums" class="tab-content hidden"></div>
      </div>
    `;

    document.body.appendChild(communityPanel);
    this.communityPanel = communityPanel;

    // Load initial content
    this.loadFeedContent();
    this.loadFriendsContent();
    this.loadEventsContent();
    this.loadForumsContent();
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      // Close community panel
      if (e.target.id === 'close-community-btn') {
        this.hideCommunityPanel();
      }

      // Tab switching
      if (e.target.classList.contains('tab-btn')) {
        this.switchTab(e.target.dataset.tab);
      }

      // Like posts
      if (e.target.classList.contains('like-btn')) {
        this.toggleLike(e.target.dataset.postId);
      }

      // RSVP events
      if (e.target.classList.contains('rsvp-btn')) {
        this.toggleRSVP(e.target.dataset.eventId);
      }

      // Add friends
      if (e.target.classList.contains('add-friend-btn')) {
        this.sendFriendRequest(e.target.dataset.userId);
      }
    });
  }

  loadFeedContent() {
    const feedContent = document.getElementById('tab-feed');
    if (!feedContent) return;

    const postsHTML = this.communityPosts.map(post => {
      const timeAgo = this.getTimeAgo(post.timestamp);
      const contentHTML = this.renderPostContent(post);
      
      return `
        <div class="community-post" style="
          background: rgba(198, 156, 109, 0.1);
          border: 1px solid rgba(198, 156, 109, 0.3);
          border-radius: 10px;
          padding: 1rem;
          margin-bottom: 1rem;
        ">
          <div class="post-header" style="
            display: flex;
            align-items: center;
            gap: 0.8rem;
            margin-bottom: 0.8rem;
          ">
            <div class="avatar" style="
              font-size: 2rem;
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(198, 156, 109, 0.2);
              border-radius: 50%;
            ">${post.avatar}</div>
            <div>
              <div style="color: #c69c6d; font-weight: bold;">${post.username}</div>
              <div style="color: #888; font-size: 0.8rem;">${timeAgo}</div>
            </div>
          </div>
          
          <div class="post-content" style="color: #f0e6d2; margin-bottom: 1rem;">
            ${contentHTML}
          </div>
          
          <div class="post-actions" style="
            display: flex;
            gap: 1rem;
            padding-top: 0.5rem;
            border-top: 1px solid rgba(198, 156, 109, 0.2);
          ">
            <button class="like-btn" data-post-id="${post.id}" style="
              background: none;
              border: none;
              color: #c69c6d;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 0.3rem;
            ">
              ❤️ ${post.likes}
            </button>
            <button style="
              background: none;
              border: none;
              color: #c69c6d;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 0.3rem;
            ">
              💬 ${post.comments}
            </button>
            <button style="
              background: none;
              border: none;
              color: #c69c6d;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 0.3rem;
            ">
              🔄 ${post.shares}
            </button>
          </div>
        </div>
      `;
    }).join('');

    feedContent.innerHTML = `
      <div class="post-composer" style="
        background: rgba(198, 156, 109, 0.1);
        border: 1px solid rgba(198, 156, 109, 0.3);
        border-radius: 10px;
        padding: 1rem;
        margin-bottom: 1rem;
      ">
        <div style="color: #c69c6d; margin-bottom: 0.5rem;">Share your cigar experience</div>
        <textarea placeholder="What's on your mind?" style="
          width: 100%;
          background: rgba(0,0,0,0.3);
          border: 1px solid #c69c6d;
          border-radius: 5px;
          padding: 0.8rem;
          color: #f0e6d2;
          resize: vertical;
          min-height: 80px;
        "></textarea>
        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
          <button style="
            background: #c69c6d;
            color: #1a0f08;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
          ">📝 Post</button>
          <button style="
            background: rgba(198, 156, 109, 0.2);
            color: #c69c6d;
            border: 1px solid #c69c6d;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
          ">📸 Photo</button>
        </div>
      </div>
      
      ${postsHTML}
    `;
  }

  renderPostContent(post) {
    switch (post.type) {
      case 'review':
        return `
          <div>${post.content.text}</div>
          <div style="
            background: rgba(0,0,0,0.2);
            padding: 0.8rem;
            border-radius: 5px;
            margin-top: 0.8rem;
            border-left: 3px solid #c69c6d;
          ">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <strong>${post.content.cigar}</strong>
              <span style="color: #ffd700;">⭐ ${post.content.rating}</span>
            </div>
          </div>
        `;
      case 'collection':
        return `
          <div>${post.content.text}</div>
          <div style="
            background: rgba(0,0,0,0.2);
            padding: 0.8rem;
            border-radius: 5px;
            margin-top: 0.8rem;
          ">
            <div style="font-size: 3rem; text-align: center; margin-bottom: 0.5rem;">${post.content.image}</div>
            <div>${post.content.collection.join(', ')}</div>
          </div>
        `;
      case 'pairing':
        return `
          <div>${post.content.text}</div>
          <div style="
            background: rgba(0,0,0,0.2);
            padding: 0.8rem;
            border-radius: 5px;
            margin-top: 0.8rem;
            display: flex;
            justify-content: space-between;
          ">
            <div><strong>Cigar:</strong> ${post.content.cigar}</div>
            <div><strong>Pairing:</strong> ${post.content.pairing}</div>
          </div>
        `;
      default:
        return post.content.text;
    }
  }

  loadFriendsContent() {
    const friendsContent = document.getElementById('tab-friends');
    if (!friendsContent) return;

    const friendsHTML = this.friends.map(friend => `
      <div class="friend-card" style="
        background: rgba(198, 156, 109, 0.1);
        border: 1px solid rgba(198, 156, 109, 0.3);
        border-radius: 10px;
        padding: 1rem;
        margin-bottom: 1rem;
      ">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="
            font-size: 2.5rem;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(198, 156, 109, 0.2);
            border-radius: 50%;
          ">${friend.avatar}</div>
          
          <div style="flex: 1;">
            <div style="color: #c69c6d; font-weight: bold; font-size: 1.1rem;">${friend.username}</div>
            <div style="color: #888; font-size: 0.9rem;">${friend.level} • ${friend.reviewCount} reviews</div>
            <div style="color: #888; font-size: 0.8rem;">Last seen: ${friend.lastSeen}</div>
            <div style="margin-top: 0.3rem;">
              ${friend.badges.map(badge => `<span style="
                background: rgba(198, 156, 109, 0.2);
                color: #c69c6d;
                padding: 0.2rem 0.5rem;
                border-radius: 10px;
                font-size: 0.7rem;
                margin-right: 0.3rem;
              ">${badge}</span>`).join('')}
            </div>
          </div>
          
          <div style="text-align: center;">
            <div style="color: #ffd700; font-size: 1.2rem; font-weight: bold;">${friend.socialScore}</div>
            <div style="color: #888; font-size: 0.7rem;">Social Score</div>
          </div>
        </div>
        
        <div style="
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(198, 156, 109, 0.2);
        ">
          <button style="
            background: #c69c6d;
            color: #1a0f08;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            flex: 1;
          ">💬 Message</button>
          <button style="
            background: rgba(198, 156, 109, 0.2);
            color: #c69c6d;
            border: 1px solid #c69c6d;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            flex: 1;
          ">👤 Profile</button>
        </div>
      </div>
    `).join('');

    friendsContent.innerHTML = `
      <div style="margin-bottom: 1rem;">
        <input type="text" placeholder="Search friends..." style="
          width: 100%;
          background: rgba(0,0,0,0.3);
          border: 1px solid #c69c6d;
          border-radius: 5px;
          padding: 0.8rem;
          color: #f0e6d2;
        ">
      </div>
      
      <div style="
        background: rgba(198, 156, 109, 0.1);
        border: 1px solid rgba(198, 156, 109, 0.3);
        border-radius: 10px;
        padding: 1rem;
        margin-bottom: 1rem;
        text-align: center;
      ">
        <div style="color: #c69c6d; font-size: 2rem; margin-bottom: 0.5rem;">🤝</div>
        <div style="color: #c69c6d; font-weight: bold;">Your Network</div>
        <div style="color: #888; font-size: 0.9rem; margin-top: 0.3rem;">
          ${this.friends.length} friends • ${this.friends.reduce((sum, f) => sum + f.mutualFriends, 0)} mutual connections
        </div>
      </div>
      
      ${friendsHTML}
    `;
  }

  loadEventsContent() {
    const eventsContent = document.getElementById('tab-events');
    if (!eventsContent) return;

    const eventsHTML = this.events.map(event => {
      const dateFormatted = event.date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      return `
        <div class="event-card" style="
          background: rgba(198, 156, 109, 0.1);
          border: 1px solid rgba(198, 156, 109, 0.3);
          border-radius: 10px;
          padding: 1rem;
          margin-bottom: 1rem;
        ">
          <div style="display: flex; gap: 1rem;">
            <div style="
              font-size: 3rem;
              width: 60px;
              height: 60px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(198, 156, 109, 0.2);
              border-radius: 10px;
            ">${event.image}</div>
            
            <div style="flex: 1;">
              <h3 style="color: #c69c6d; margin: 0 0 0.5rem 0;">${event.title}</h3>
              <p style="color: #f0e6d2; margin: 0 0 0.8rem 0; line-height: 1.4;">${event.description}</p>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.9rem; color: #888;">
                <div>📅 ${dateFormatted}</div>
                <div>📍 ${event.location}</div>
                <div>👥 ${event.attendees}/${event.maxAttendees} attending</div>
                <div>💰 ${event.price}</div>
                <div>🎯 Hosted by ${event.host}</div>
              </div>
              
              <div style="margin-top: 0.8rem;">
                ${event.tags.map(tag => `<span style="
                  background: rgba(198, 156, 109, 0.2);
                  color: #c69c6d;
                  padding: 0.2rem 0.5rem;
                  border-radius: 10px;
                  font-size: 0.7rem;
                  margin-right: 0.3rem;
                ">#${tag}</span>`).join('')}
              </div>
            </div>
          </div>
          
          <div style="
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(198, 156, 109, 0.2);
          ">
            <button class="rsvp-btn" data-event-id="${event.id}" style="
              background: #c69c6d;
              color: #1a0f08;
              border: none;
              padding: 0.5rem 1rem;
              border-radius: 5px;
              cursor: pointer;
              flex: 1;
            ">✓ RSVP</button>
            <button style="
              background: rgba(198, 156, 109, 0.2);
              color: #c69c6d;
              border: 1px solid #c69c6d;
              padding: 0.5rem 1rem;
              border-radius: 5px;
              cursor: pointer;
            ">🔗 Share</button>
          </div>
        </div>
      `;
    }).join('');

    eventsContent.innerHTML = `
      <div style="
        background: rgba(198, 156, 109, 0.1);
        border: 1px solid rgba(198, 156, 109, 0.3);
        border-radius: 10px;
        padding: 1rem;
        margin-bottom: 1rem;
        text-align: center;
      ">
        <div style="color: #c69c6d; font-size: 2rem; margin-bottom: 0.5rem;">📅</div>
        <div style="color: #c69c6d; font-weight: bold;">Upcoming Events</div>
        <div style="color: #888; font-size: 0.9rem; margin-top: 0.3rem;">
          Discover cigar events in your area
        </div>
        <button style="
          background: #c69c6d;
          color: #1a0f08;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 0.8rem;
        ">+ Create Event</button>
      </div>
      
      ${eventsHTML}
    `;
  }

  loadForumsContent() {
    const forumsContent = document.getElementById('tab-forums');
    if (!forumsContent) return;

    const forumsHTML = Object.values(this.forums).map(forum => `
      <div class="forum-card" style="
        background: rgba(198, 156, 109, 0.1);
        border: 1px solid rgba(198, 156, 109, 0.3);
        border-radius: 10px;
        padding: 1rem;
        margin-bottom: 1rem;
        cursor: pointer;
        transition: background 0.3s;
      " onmouseover="this.style.background='rgba(198, 156, 109, 0.15)'" onmouseout="this.style.background='rgba(198, 156, 109, 0.1)'">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div style="flex: 1;">
            <h3 style="color: #c69c6d; margin: 0 0 0.5rem 0;">${forum.title}</h3>
            <p style="color: #f0e6d2; margin: 0 0 0.8rem 0; line-height: 1.4;">${forum.description}</p>
            
            <div style="display: flex; gap: 1rem; font-size: 0.9rem; color: #888;">
              <div>📝 ${forum.posts} posts</div>
              <div>👥 ${forum.members} members</div>
              <div>⏰ ${forum.lastActivity}</div>
            </div>
            
            <div style="margin-top: 0.5rem; font-size: 0.8rem; color: #888;">
              Moderators: ${forum.moderators.join(', ')}
            </div>
          </div>
          
          <div style="color: #c69c6d; font-size: 1.5rem;">💬</div>
        </div>
      </div>
    `).join('');

    forumsContent.innerHTML = `
      <div style="
        background: rgba(198, 156, 109, 0.1);
        border: 1px solid rgba(198, 156, 109, 0.3);
        border-radius: 10px;
        padding: 1rem;
        margin-bottom: 1rem;
        text-align: center;
      ">
        <div style="color: #c69c6d; font-size: 2rem; margin-bottom: 0.5rem;">💬</div>
        <div style="color: #c69c6d; font-weight: bold;">Community Forums</div>
        <div style="color: #888; font-size: 0.9rem; margin-top: 0.3rem;">
          Join discussions with fellow cigar enthusiasts
        </div>
      </div>
      
      ${forumsHTML}
    `;
  }

  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      if (btn.dataset.tab === tabName) {
        btn.style.background = '#c69c6d';
        btn.style.color = '#1a0f08';
        btn.classList.add('active');
      } else {
        btn.style.background = 'rgba(198, 156, 109, 0.2)';
        btn.style.color = '#c69c6d';
        btn.classList.remove('active');
      }
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      if (content.id === `tab-${tabName}`) {
        content.style.display = 'block';
        content.classList.add('active');
      } else {
        content.style.display = 'none';
        content.classList.remove('active');
      }
    });
  }

  toggleLike(postId) {
    const post = this.communityPosts.find(p => p.id === postId);
    if (post) {
      post.likes += 1;
      const likeBtn = document.querySelector(`[data-post-id="${postId}"]`);
      if (likeBtn) {
        likeBtn.innerHTML = `❤️ ${post.likes}`;
        likeBtn.style.color = '#ff6b6b';
      }
      
      // Track analytics
      if (window.analyticsDashboard) {
        window.analyticsDashboard.trackInteraction('community_like', 'post', { postId });
      }
    }
  }

  toggleRSVP(eventId) {
    const event = this.events.find(e => e.id === eventId);
    if (event && event.attendees < event.maxAttendees) {
      event.attendees += 1;
      const rsvpBtn = document.querySelector(`[data-event-id="${eventId}"]`);
      if (rsvpBtn) {
        rsvpBtn.innerHTML = '✓ RSVP\'d';
        rsvpBtn.style.background = '#4CAF50';
        rsvpBtn.style.color = 'white';
        rsvpBtn.disabled = true;
      }
      
      // Track analytics
      if (window.analyticsDashboard) {
        window.analyticsDashboard.trackInteraction('community_rsvp', 'event', { eventId });
      }
    }
  }

  sendFriendRequest(userId) {
    const addBtn = document.querySelector(`[data-user-id="${userId}"]`);
    if (addBtn) {
      addBtn.innerHTML = '⏳ Requested';
      addBtn.style.background = '#888';
      addBtn.disabled = true;
      
      // Track analytics
      if (window.analyticsDashboard) {
        window.analyticsDashboard.trackInteraction('community_friend_request', 'user', { userId });
      }
    }
  }

  getTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  showCommunityPanel() {
    if (this.communityPanel) {
      this.communityPanel.style.right = '0px';
    }
  }

  hideCommunityPanel() {
    if (this.communityPanel) {
      this.communityPanel.style.right = '-400px';
    }
  }

  // Public API methods
  createPost(content, type = 'text') {
    const newPost = {
      id: 'post_' + Date.now(),
      userId: this.currentUser.id,
      username: this.currentUser.username,
      avatar: this.currentUser.avatar,
      timestamp: new Date(),
      type: type,
      content: content,
      likes: 0,
      comments: 0,
      shares: 0
    };

    this.communityPosts.unshift(newPost);
    this.loadFeedContent();
    
    return newPost;
  }

  getSocialRecommendations() {
    // Generate recommendations based on community activity
    const _recommendations = [];
    
    // Friend recommendations
    const potentialFriends = this.friends.filter(friend => 
      friend.mutualFriends > 2 && friend.socialScore > 500
    );
    
    // Event recommendations
    const relevantEvents = this.events.filter(event => 
      event.attendees < event.maxAttendees && 
      event.date > new Date()
    );
    
    // Forum recommendations
    const activeForums = Object.values(this.forums).filter(forum => 
      forum.posts > 500
    );

    return {
      friends: potentialFriends.slice(0, 3),
      events: relevantEvents.slice(0, 2),
      forums: activeForums.slice(0, 2)
    };
  }

  getUserStats() {
    return {
      friendsCount: this.friends.length,
      postsCount: this.communityPosts.filter(p => p.userId === this.currentUser.id).length,
      eventsAttended: this.events.filter(e => e.attendees > 0).length,
      forumActivity: Object.values(this.forums).reduce((sum, f) => sum + f.posts, 0),
      socialScore: this.currentUser.socialScore || 0
    };
  }
}

// Initialize Community Manager
document.addEventListener('DOMContentLoaded', () => {
  window.communityManager = new CommunityManager();
  
  // Add community button to navigation if not exists
  const navButtons = document.querySelector('.nav-buttons');
  if (navButtons && !document.getElementById('community-nav-btn')) {
    const communityBtn = document.createElement('button');
    communityBtn.id = 'community-nav-btn';
    communityBtn.className = 'nav-button';
    communityBtn.innerHTML = '🤝 Community';
    communityBtn.onclick = () => window.communityManager?.showCommunityPanel();
    navButtons.appendChild(communityBtn);
  }
});

export default CommunityManager;