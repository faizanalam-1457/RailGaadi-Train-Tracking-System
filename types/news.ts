export interface NewsArticle {
  id: string;
  title: string;
  description?: string;
  url: string;
  publishedAt: string;
  section?: string;
  thumbnail?: string;
  source: 'The Guardian';
  topic?: string;
  relevanceScore?: number;
}

export type NewsTopicKey =
  | 'all'
  | 'railway'
  | 'trains'
  | 'vande-bharat'
  | 'infrastructure'
  | 'irctc'
  | 'policy'
  | 'technology'
  | 'disruptions'
  | 'global';

export interface NewsTopicConfig {
  key: NewsTopicKey;
  label: string;
  query: string;
  description: string;
}

export const NEWS_TOPICS: Record<NewsTopicKey, NewsTopicConfig> = {
  all: {
    key: 'all',
    label: 'All News',
    query: 'railway OR train OR rail',
    description: 'Latest headlines across Indian & Global Railway developments',
  },
  railway: {
    key: 'railway',
    label: 'Indian Railways',
    query: '"Indian Railways" OR "Indian Rail"',
    description: 'Official announcements, network updates, and corridor launches',
  },
  trains: {
    key: 'trains',
    label: 'Trains & Fleet',
    query: 'trains India OR express train India',
    description: 'High-speed trains, Rajdhani, Shatabdi, and new passenger fleet updates',
  },
  'vande-bharat': {
    key: 'vande-bharat',
    label: 'Vande Bharat',
    query: '"Vande Bharat" OR "Train 18"',
    description: 'Semi-high-speed Vande Bharat Express launches, speed trials & routes',
  },
  infrastructure: {
    key: 'infrastructure',
    label: 'Infrastructure',
    query: '"railway infrastructure" India OR "rail track" India OR "rail bridge" India',
    description: 'Electrification, station redevelopment, viaduct bridges & track upgrades',
  },
  irctc: {
    key: 'irctc',
    label: 'IRCTC & Catering',
    query: 'IRCTC OR "railway ticketing" India OR "train food" India',
    description: 'Ticket booking passes, passenger amenities & e-catering updates',
  },
  policy: {
    key: 'policy',
    label: 'Policy & Safety',
    query: '"Indian Railways policy" OR KAVACH OR "rail safety" India',
    description: 'KAVACH anti-collision, safety protocols & railway ministry decisions',
  },
  technology: {
    key: 'technology',
    label: 'Technology',
    query: '"railway technology" OR "bullet train" OR "hydrogen train"',
    description: 'Bullet train corridors, signal automation & green rail tech',
  },
  disruptions: {
    key: 'disruptions',
    label: 'Travel Alerts',
    query: '"railway disruption" India OR "train delay" India OR "fog caution" rail',
    description: 'Weather advisories, route diversions & disruption alerts',
  },
  global: {
    key: 'global',
    label: 'Global Rail',
    query: '"rail transport" OR "high speed rail" OR "railway network"',
    description: 'Major international high-speed rail networks and transport trends',
  },
};
