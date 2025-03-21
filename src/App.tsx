import React, { useState, useEffect } from 'react';
import { GoogleReviewsScraper } from './services/scraper';
import { ReviewAnalyzer } from './services/analysis';
import { ReviewList } from './components/ReviewList';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { Category, Business, BusinessAnalysis, CategoryAnalysis, Review } from './types/Review';
import './App.css';

function App() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('viñedos');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [businessAnalysis, setBusinessAnalysis] = useState<BusinessAnalysis>();
  const [categoryAnalysis, setCategoryAnalysis] = useState<CategoryAnalysis>();
  const [manualUrl, setManualUrl] = useState('');
  
  const scraper = new GoogleReviewsScraper();
  const analyzer = new ReviewAnalyzer();

  useEffect(() => {
    const initializeScraper = async () => {
      await scraper.initialize();
    };
    initializeScraper();

    return () => {
      scraper.close();
    };
  }, []);

  const handleCategoryChange = async (category: Category) => {
    setIsLoading(true);
    setSelectedCategory(category);
    
    try {
      const foundBusinesses = await scraper.searchBusinesses(category);
      setBusinesses(foundBusinesses);
      
      // Obtener reseñas del primer negocio como ejemplo
      if (foundBusinesses.length > 0) {
        const businessReviews = await scraper.getReviews(foundBusinesses[0]);
        setReviews(businessReviews);
        
        // Analizar el negocio
        const analysis = await analyzer.analyzeBusiness({
          ...foundBusinesses[0],
          reviews: businessReviews
        });
        setBusinessAnalysis(analysis);

        // Analizar la categoría usando todos los negocios encontrados
        const catAnalysis = await analyzer.analyzeCategory(foundBusinesses);
        setCategoryAnalysis(catAnalysis);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const business = await scraper.getBusinessFromUrl(manualUrl);
      const businessReviews = await scraper.getReviews(business);
      setReviews(businessReviews);
      
      // Analizar el negocio
      const analysis = await analyzer.analyzeBusiness({
        ...business,
        reviews: businessReviews
      });
      setBusinessAnalysis(analysis);
    } catch (error) {
      console.error('Error processing URL:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Reseñas Turísticas de Aguascalientes
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Selecciona una categoría:</h2>
            <div className="flex space-x-4 mb-6">
              {['viñedos', 'hoteles', 'restaurantes', 'museos', 'parques'].map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category as Category)}
                  className={`px-4 py-2 rounded-md ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">O ingresa una URL de Google Maps:</h2>
              <form onSubmit={handleManualUrlSubmit} className="flex space-x-4">
                <input
                  type="text"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="Pega la URL de Google Maps aquí"
                  className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Analizar
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-8">
            <AnalysisDisplay
              businessAnalysis={businessAnalysis}
              categoryAnalysis={categoryAnalysis}
              isLoading={isLoading}
            />
            
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Reseñas Detalladas</h2>
              <ReviewList reviews={reviews} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
