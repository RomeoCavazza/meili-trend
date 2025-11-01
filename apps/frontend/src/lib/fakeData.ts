// fakeData.ts - Fake dataset ultra réaliste pour App Review (Meta/TikTok)
// Simulation de données Instagram/TikTok réalistes pour démo App Review

export interface FakeProject {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  platforms: string[];
  creators_count: number;
  posts_count: number;
  signals_count: number;
  last_run_at: string | null;
  created_at: string;
}

export interface FakePost {
  id: string;
  platform: 'instagram' | 'tiktok';
  username: string;
  caption: string;
  media_url: string;
  media_type?: 'photo' | 'video' | 'carousel';
  like_count: number;
  comment_count: number;
  share_count?: number;
  view_count?: number;
  posted_at: string;
  hashtags: string[];
  location?: string;
  mentions?: string[];
}

export interface FakeCreator {
  id: string;
  platform: 'instagram' | 'tiktok';
  handle: string;
  full_name?: string;
  bio?: string;
  followers: number;
  following?: number;
  posts_count?: number;
  avg_engagement: number;
  profile_picture?: string;
  verified?: boolean;
  category?: string;
}

export interface FakeNiche {
  id: string;
  name: string;
  description?: string;
  creators_count: number;
  posts_count: number;
  ai_generated: boolean;
}

// ========================================
// FAKE PROJECTS (My Projects)
// ========================================
export const fakeProjects: FakeProject[] = [
  {
    id: 'proj-1',
    name: 'Fashion Trends 2025',
    description: 'Surveillance des tendances mode sur Instagram et TikTok',
    status: 'active',
    platforms: ['instagram', 'tiktok'],
    creators_count: 24,
    posts_count: 156,
    signals_count: 45,
    last_run_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'proj-2',
    name: 'Beauty Micro-Influencers',
    description: 'Découverte de micro-créatrices beauté en croissance',
    status: 'active',
    platforms: ['instagram'],
    creators_count: 18,
    posts_count: 203,
    signals_count: 67,
    last_run_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'proj-3',
    name: 'Tech Startup Ecosystem',
    description: 'Analyse de l\'écosystème tech sur TikTok',
    status: 'draft',
    platforms: ['tiktok'],
    creators_count: 0,
    posts_count: 0,
    signals_count: 0,
    last_run_at: null,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ========================================
// FAKE CREATORS (Ultra réaliste)
// ========================================
export const fakeCreators: FakeCreator[] = [
  // Instagram Fashion
  {
    id: 'creator-1',
    platform: 'instagram',
    handle: 'fashionista_alice',
    full_name: 'Alice Fashion',
    bio: '✨ Fashion Stylist | Sustainable Fashion Advocate | 📍 Paris',
    followers: 125000,
    following: 1234,
    posts_count: 892,
    avg_engagement: 4.2,
    profile_picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    verified: false,
    category: 'Fashion',
  },
  {
    id: 'creator-2',
    platform: 'instagram',
    handle: 'style_blogger',
    full_name: 'Sophie Style',
    bio: 'Daily outfit inspiration | Minimalist aesthetic | OOTD',
    followers: 67000,
    following: 890,
    posts_count: 456,
    avg_engagement: 6.2,
    profile_picture: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop',
    verified: false,
    category: 'Fashion',
  },
  {
    id: 'creator-3',
    platform: 'instagram',
    handle: 'fashion_designer',
    full_name: 'María Design Studio',
    bio: 'Designer | Sustainable Collections | ✨ New Drops Every Month',
    followers: 289000,
    following: 234,
    posts_count: 1234,
    avg_engagement: 8.1,
    profile_picture: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=150&h=150&fit=crop',
    verified: true,
    category: 'Fashion',
  },
  // Instagram Beauty
  {
    id: 'creator-4',
    platform: 'instagram',
    handle: 'beauty_guru',
    full_name: 'Emma Beauty',
    bio: '💄 Makeup Artist | Tutorials | Product Reviews | Collabs',
    followers: 234000,
    following: 456,
    posts_count: 1567,
    avg_engagement: 5.8,
    profile_picture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    verified: true,
    category: 'Beauty',
  },
  {
    id: 'creator-5',
    platform: 'instagram',
    handle: 'makeup_artist',
    full_name: 'Luna Makeup',
    bio: '🎨 Professional MUA | Beauty Tips | Transformations',
    followers: 312000,
    following: 345,
    posts_count: 1123,
    avg_engagement: 7.1,
    profile_picture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    verified: false,
    category: 'Beauty',
  },
  {
    id: 'creator-6',
    platform: 'instagram',
    handle: 'beauty_tips',
    full_name: 'Zoe Skincare',
    bio: '🧴 Skincare Routine | Product Testing | Natural Beauty',
    followers: 187000,
    following: 567,
    posts_count: 789,
    avg_engagement: 6.5,
    profile_picture: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150&h=150&fit=crop',
    verified: false,
    category: 'Beauty',
  },
  // TikTok Tech
  {
    id: 'creator-7',
    platform: 'tiktok',
    handle: 'tech_trends',
    full_name: 'Tech Trends',
    bio: '🚀 Startup News | Tech Reviews | Innovation Stories',
    followers: 890000,
    following: 234,
    posts_count: 456,
    avg_engagement: 8.5,
    profile_picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    verified: true,
    category: 'Technology',
  },
  {
    id: 'creator-8',
    platform: 'tiktok',
    handle: 'tech_reviewer',
    full_name: 'Alex Tech',
    bio: '📱 Gadget Reviews | Unboxing | Tech Tips',
    followers: 567000,
    following: 123,
    posts_count: 789,
    avg_engagement: 7.8,
    profile_picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    verified: false,
    category: 'Technology',
  },
  {
    id: 'creator-9',
    platform: 'tiktok',
    handle: 'startup_founder',
    full_name: 'Startup Stories',
    bio: '💰 Fundraising Tips | Business Growth | Entrepreneurship',
    followers: 234000,
    following: 890,
    posts_count: 345,
    avg_engagement: 9.2,
    profile_picture: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=150&h=150&fit=crop',
    verified: false,
    category: 'Business',
  },
  // TikTok Fashion
  {
    id: 'creator-10',
    platform: 'tiktok',
    handle: 'fashion_tips',
    full_name: 'Fashion Tips Daily',
    bio: '👗 Style Hacks | Thrift Finds | Outfit Ideas',
    followers: 678000,
    following: 456,
    posts_count: 567,
    avg_engagement: 7.3,
    profile_picture: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=150&h=150&fit=crop',
    verified: false,
    category: 'Fashion',
  },
];

// ========================================
// FAKE POSTS (Ultra réaliste Instagram/TikTok)
// ========================================
export const fakePosts: FakePost[] = [
  // Instagram Fashion (récent)
  {
    id: 'post-1',
    platform: 'instagram',
    username: 'fashionista_alice',
    caption: 'New collection dropping soon! 🎨✨ Can\'t wait to share this with you all. Pre-order opens Friday! #fashion #ootd #style #newcollection #fashionista #paris',
    media_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=600&fit=crop',
    media_type: 'photo',
    like_count: 15420,
    comment_count: 342,
    share_count: 89,
    posted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['fashion', 'ootd', 'style', 'newcollection', 'fashionista', 'paris'],
    location: 'Paris, France',
    mentions: ['@brandpartner'],
  },
  {
    id: 'post-2',
    platform: 'instagram',
    username: 'style_blogger',
    caption: 'Inspiration du jour ✨ Sometimes simple is the best choice. Love this monochrome look! #fashion #inspiration #daily #style #minimalist #outfit',
    media_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop',
    media_type: 'photo',
    like_count: 9800,
    comment_count: 156,
    share_count: 34,
    posted_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['fashion', 'inspiration', 'daily', 'style', 'minimalist', 'outfit'],
    location: 'London, UK',
  },
  {
    id: 'post-3',
    platform: 'instagram',
    username: 'fashion_designer',
    caption: 'Nouvelle collection preview 👗 Behind the scenes of our latest shoot. So excited to reveal the full collection next month! #fashion #designer #newcollection #preview #sustainable',
    media_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=600&fit=crop',
    media_type: 'carousel',
    like_count: 28900,
    comment_count: 567,
    share_count: 123,
    posted_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['fashion', 'designer', 'newcollection', 'preview', 'sustainable'],
    location: 'Milan, Italy',
  },
  // Instagram Beauty
  {
    id: 'post-4',
    platform: 'instagram',
    username: 'beauty_guru',
    caption: 'GRWM pour un événement spécial 💄 Full glam look tutorial coming soon! What do you think? #makeup #grwm #beauty #tutorial #glam #makeupartist',
    media_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop',
    media_type: 'video',
    like_count: 23400,
    comment_count: 512,
    share_count: 234,
    posted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['makeup', 'grwm', 'beauty', 'tutorial', 'glam', 'makeupartist'],
  },
  {
    id: 'post-5',
    platform: 'instagram',
    username: 'makeup_artist',
    caption: 'Tutorial eyeliner parfait 🔥 Step by step pour un liner impeccable! Swipe for all steps 👉 #makeup #tutorial #eyeliner #beauty #makeuptips',
    media_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop',
    media_type: 'carousel',
    like_count: 31200,
    comment_count: 678,
    share_count: 189,
    posted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['makeup', 'tutorial', 'eyeliner', 'beauty', 'makeuptips'],
  },
  {
    id: 'post-6',
    platform: 'instagram',
    username: 'beauty_tips',
    caption: 'Skincare routine matin ✨ Les essentiels pour une peau parfaite. Routine complète dans mes stories! #skincare #routine #beauty #selfcare #skincaretips',
    media_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop',
    media_type: 'photo',
    like_count: 44500,
    comment_count: 923,
    share_count: 456,
    posted_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['skincare', 'routine', 'beauty', 'selfcare', 'skincaretips'],
  },
  // TikTok Tech
  {
    id: 'post-7',
    platform: 'tiktok',
    username: 'tech_trends',
    caption: '5 startups à surveiller en 2025 🚀 Découvrez les pépites qui vont changer le game! #startup #tech #innovation #2025 #business',
    media_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=800&fit=crop',
    media_type: 'video',
    like_count: 89200,
    comment_count: 1234,
    share_count: 5678,
    view_count: 450000,
    posted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['startup', 'tech', 'innovation', '2025', 'business'],
  },
  {
    id: 'post-8',
    platform: 'tiktok',
    username: 'tech_reviewer',
    caption: 'Test du nouveau gadget 🎯 Unboxing et premier test! Verdict dans les commentaires 👇 #tech #review #gadget #unboxing #techreview',
    media_url: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=800&fit=crop',
    media_type: 'video',
    like_count: 18200,
    comment_count: 423,
    share_count: 234,
    view_count: 89000,
    posted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['tech', 'review', 'gadget', 'unboxing', 'techreview'],
  },
  {
    id: 'post-9',
    platform: 'tiktok',
    username: 'startup_founder',
    caption: 'Comment j\'ai levé 1M€ en 6 mois 💰 Les 5 étapes clés que personne ne te dit! #startup #fundraising #business #success #entrepreneurship',
    media_url: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=600&h=800&fit=crop',
    media_type: 'video',
    like_count: 112300,
    comment_count: 2345,
    share_count: 8900,
    view_count: 890000,
    posted_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['startup', 'fundraising', 'business', 'success', 'entrepreneurship'],
  },
  // TikTok Fashion
  {
    id: 'post-10',
    platform: 'tiktok',
    username: 'fashion_tips',
    caption: '3 erreurs de style à éviter 👗 On ne refait plus ces erreurs! #fashion #style #tips #outfit #fashionhacks',
    media_url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop',
    media_type: 'video',
    like_count: 56700,
    comment_count: 890,
    share_count: 3456,
    view_count: 320000,
    posted_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['fashion', 'style', 'tips', 'outfit', 'fashionhacks'],
  },
  // Posts additionnels pour plus de réalisme
  {
    id: 'post-11',
    platform: 'instagram',
    username: 'fashionista_alice',
    caption: 'Sustainable fashion moment 🌿 Love finding these vintage pieces! #sustainablefashion #vintage #thrifting #fashion',
    media_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=600&fit=crop',
    media_type: 'photo',
    like_count: 12340,
    comment_count: 278,
    share_count: 67,
    posted_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['sustainablefashion', 'vintage', 'thrifting', 'fashion'],
  },
  {
    id: 'post-12',
    platform: 'instagram',
    username: 'beauty_guru',
    caption: 'Product review: cette fondation est incroyable! ✨ Review complète dans mes stories #makeup #productreview #foundation #beauty',
    media_url: 'https://images.unsplash.com/photo-1631217873082-8bc6b04cd7c2?w=600&h=600&fit=crop',
    media_type: 'carousel',
    like_count: 19800,
    comment_count: 445,
    share_count: 123,
    posted_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['makeup', 'productreview', 'foundation', 'beauty'],
  },
  {
    id: 'post-13',
    platform: 'tiktok',
    username: 'tech_trends',
    caption: 'AI va changer TOUT en 2025 🤖 Voici pourquoi... #ai #tech #future #innovation #2025',
    media_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=800&fit=crop',
    media_type: 'video',
    like_count: 145600,
    comment_count: 3456,
    share_count: 12340,
    view_count: 1200000,
    posted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['ai', 'tech', 'future', 'innovation', '2025'],
  },
];

// ========================================
// FAKE NICHES
// ========================================
export const fakeNiches: FakeNiche[] = [
  {
    id: 'niche-1',
    name: 'Fashion Micro-Influencers',
    description: 'Créatrices mode avec 50K-200K followers, engagement élevé',
    creators_count: 12,
    posts_count: 234,
    ai_generated: true,
  },
  {
    id: 'niche-2',
    name: 'Beauty GRWM',
    description: 'Get Ready With Me - Tutorials beauté format vidéo court',
    creators_count: 8,
    posts_count: 156,
    ai_generated: true,
  },
  {
    id: 'niche-3',
    name: 'Tech Startups',
    description: 'Content autour des startups tech, fundraising, growth',
    creators_count: 5,
    posts_count: 89,
    ai_generated: false,
  },
  {
    id: 'niche-4',
    name: 'Sustainable Fashion',
    description: 'Mode durable, vintage, éthique, seconde main',
    creators_count: 6,
    posts_count: 123,
    ai_generated: true,
  },
];

// ========================================
// FAKE SIGNALS (Trends détectées)
// ========================================
export const fakeSignals = [
  {
    title: 'GRWM revient fort chez micro-influenceuses',
    why_it_matters: 'Hausse de 34% de la complétion vidéo chez 18-24 ans',
    score: 0.82,
    evidence: ['#grwm +45%', 'Format vidéo 15-30s dominant', 'Engagement +28%'],
  },
  {
    title: 'Palette pastel en hausse sur TikTok',
    why_it_matters: '+45% de posts utilisant #pastelaesthetic cette semaine',
    score: 0.76,
    evidence: ['#pastelaesthetic trending', 'Vues moyennes +32%', 'Copies de style fréquentes'],
  },
  {
    title: 'Format carrousel > Reels pour engagement',
    why_it_matters: 'Engagement rate +18% vs vidéo unique sur Instagram',
    score: 0.71,
    evidence: ['Taux engagement 6.2% vs 5.2%', 'Temps moyen regard +40%', 'Saves +25%'],
  },
  {
    title: 'Sustainable fashion gagne du terrain',
    why_it_matters: 'Croissance +56% hashtags #sustainablefashion',
    score: 0.68,
    evidence: ['#vintage +38%', 'Partages augmentés', 'Créateurs éthiques en croissance'],
  },
];

// ========================================
// HELPER FUNCTIONS
// ========================================

export function simulateSearch(query: string, platform?: string): { posts: FakePost[], creators: FakeCreator[] } {
  const filteredPosts = fakePosts.filter(post => {
    const matchesQuery = post.caption.toLowerCase().includes(query.toLowerCase()) ||
                         post.hashtags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
    const matchesPlatform = !platform || post.platform === platform;
    return matchesQuery && matchesPlatform;
  });
  
  // Si pas de résultats, retourner un sample
  const posts = filteredPosts.length > 0 ? filteredPosts.slice(0, 10) : fakePosts.slice(0, 10);
  const creators = fakeCreators.slice(0, 5);
  
  return { posts, creators };
}

export function getFakeProject(id: string): FakeProject | undefined {
  return fakeProjects.find(p => p.id === id);
}

export function getFakeProjectPosts(projectId: string): FakePost[] {
  // Simuler des posts différents selon le projet
  if (projectId === 'proj-1') {
    // Fashion project - retourner posts fashion + beauty
    return fakePosts.filter(p => p.hashtags.some(t => ['fashion', 'beauty', 'style', 'makeup'].includes(t.toLowerCase()))).slice(0, 12);
  } else if (projectId === 'proj-2') {
    // Beauty project - retourner posts beauty uniquement
    return fakePosts.filter(p => p.hashtags.some(t => ['beauty', 'makeup', 'skincare', 'grwm'].includes(t.toLowerCase()))).slice(0, 10);
  } else {
    // Default - retourner tous les posts
    return fakePosts.slice(0, 8);
  }
}

export function getFakeCreatorPosts(creatorHandle: string): FakePost[] {
  return fakePosts.filter(p => p.username === creatorHandle);
}

export function getFakeCreatorByHandle(handle: string): FakeCreator | undefined {
  return fakeCreators.find(c => c.handle === handle);
}

// ========================================
// HASHTAGS POPULAIRES (pour recherche)
// ========================================
export const popularHashtags = [
  { name: 'fashion', count: 1250000, growth: '+12%' },
  { name: 'beauty', count: 890000, growth: '+8%' },
  { name: 'makeup', count: 567000, growth: '+15%' },
  { name: 'style', count: 445000, growth: '+6%' },
  { name: 'ootd', count: 234000, growth: '+9%' },
  { name: 'grwm', count: 345000, growth: '+34%' },
  { name: 'skincare', count: 678000, growth: '+18%' },
  { name: 'tech', count: 456000, growth: '+22%' },
  { name: 'startup', count: 123000, growth: '+28%' },
  { name: 'innovation', count: 234000, growth: '+19%' },
];
