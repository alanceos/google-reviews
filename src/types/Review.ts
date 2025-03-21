export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  likes: number;
  businessName: string;
  businessAddress: string;
  category: string;
}

export interface Business {
  name: string;
  address: string;
  category: string;
  rating: number;
  totalReviews: number;
  reviews: Review[];
  url?: string;
}

export interface BusinessAnalysis {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  summary: string;
  overallScore: number;
}

export interface CategoryAnalysis {
  averageRating: number;
  totalReviews: number;
  topStrengths: string[];
  topWeaknesses: string[];
  generalRecommendations: string[];
  businessCount: number;
}

export type Category = 'viñedos' | 'hoteles' | 'restaurantes' | 'museos' | 'parques'; 