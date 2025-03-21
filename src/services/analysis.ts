import { Business, BusinessAnalysis, CategoryAnalysis, Review } from '../types/Review';

export class ReviewAnalyzer {
  async analyzeBusiness(business: Business): Promise<BusinessAnalysis> {
    // Aquí implementaremos la lógica de análisis de IA
    // Por ahora, usaremos una lógica simple basada en las calificaciones
    const reviews = business.reviews;
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];

    // Análisis básico basado en calificaciones
    if (averageRating >= 4.5) {
      strengths.push('Excelente calificación general');
    } else if (averageRating >= 4.0) {
      strengths.push('Buena calificación general');
    } else if (averageRating < 3.5) {
      weaknesses.push('Calificación general por debajo del promedio');
      recommendations.push('Revisar y mejorar la experiencia del cliente');
    }

    // Análisis de tendencias en los comentarios
    const positiveWords = ['excelente', 'bueno', 'recomendado', 'increíble', 'perfecto'];
    const negativeWords = ['malo', 'pésimo', 'terrible', 'decepcionante', 'caro'];

    const positiveCount = reviews.filter(review => 
      positiveWords.some(word => review.text.toLowerCase().includes(word))
    ).length;

    const negativeCount = reviews.filter(review => 
      negativeWords.some(word => review.text.toLowerCase().includes(word))
    ).length;

    if (positiveCount > negativeCount) {
      strengths.push('Comentarios positivos predominantes');
    } else if (negativeCount > positiveCount) {
      weaknesses.push('Comentarios negativos predominantes');
      recommendations.push('Analizar y abordar los problemas mencionados en los comentarios negativos');
    }

    return {
      strengths,
      weaknesses,
      recommendations,
      summary: `Análisis basado en ${reviews.length} reseñas con una calificación promedio de ${averageRating.toFixed(1)}`,
      overallScore: averageRating
    };
  }

  async analyzeCategory(businesses: Business[]): Promise<CategoryAnalysis> {
    const totalReviews = businesses.reduce((acc, business) => acc + business.reviews.length, 0);
    const averageRating = businesses.reduce((acc, business) => {
      const businessAvg = business.reviews.reduce((sum, review) => sum + review.rating, 0) / business.reviews.length;
      return acc + businessAvg;
    }, 0) / businesses.length;

    // Análisis de tendencias generales
    const allReviews = businesses.flatMap(business => business.reviews);
    const strengths = this.extractCommonThemes(allReviews, true);
    const weaknesses = this.extractCommonThemes(allReviews, false);

    return {
      averageRating,
      totalReviews,
      topStrengths: strengths.slice(0, 5),
      topWeaknesses: weaknesses.slice(0, 5),
      generalRecommendations: this.generateGeneralRecommendations(strengths, weaknesses),
      businessCount: businesses.length
    };
  }

  private extractCommonThemes(reviews: Review[], positive: boolean): string[] {
    const positiveWords = ['excelente', 'bueno', 'recomendado', 'increíble', 'perfecto'];
    const negativeWords = ['malo', 'pésimo', 'terrible', 'decepcionante', 'caro'];

    const words = positive ? positiveWords : negativeWords;
    const themes: { [key: string]: number } = {};

    reviews.forEach(review => {
      words.forEach(word => {
        if (review.text.toLowerCase().includes(word)) {
          themes[word] = (themes[word] || 0) + 1;
        }
      });
    });

    return Object.entries(themes)
      .sort(([, a], [, b]) => b - a)
      .map(([theme]) => theme);
  }

  private generateGeneralRecommendations(strengths: string[], weaknesses: string[]): string[] {
    const recommendations: string[] = [];

    if (weaknesses.length > 0) {
      recommendations.push(`Enfocarse en mejorar los aspectos mencionados en ${weaknesses[0]}`);
    }

    if (strengths.length > 0) {
      recommendations.push(`Mantener y potenciar los aspectos positivos como ${strengths[0]}`);
    }

    return recommendations;
  }
} 