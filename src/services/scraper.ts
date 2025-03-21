import * as puppeteer from 'puppeteer';
import { Business, Review, Category } from '../types/Review';

export class GoogleReviewsScraper {
  private browser: puppeteer.Browser | null = null;

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async getBusinessFromUrl(url: string): Promise<Business> {
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }

    const page = await this.browser.newPage();
    
    try {
      await page.goto(url);
      await page.waitForSelector('h1[class*="header-title"]', { timeout: 10000 });

      const business = await page.evaluate(() => {
        const name = document.querySelector('h1[class*="header-title"]')?.textContent || '';
        const address = document.querySelector('button[data-item-id*="address"]')?.textContent || '';
        const rating = parseFloat(document.querySelector('span[role="img"]')?.getAttribute('aria-label')?.split(' ')[0] || '0');
        const totalReviews = parseInt(document.querySelector('span[role="img"]')?.parentElement?.textContent?.replace(/[^0-9]/g, '') || '0');

        return {
          name,
          address,
          rating,
          totalReviews,
          category: '',
          reviews: [],
          url: window.location.href
        };
      });

      return business;
    } catch (error) {
      console.error('Error getting business from URL:', error);
      throw error;
    } finally {
      await page.close();
    }
  }

  async searchBusinesses(category: Category, location: string = 'Aguascalientes, México'): Promise<Business[]> {
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }

    const page = await this.browser.newPage();
    const searchQuery = `${category} en ${location}`;
    
    try {
      // Navegar a Google Maps
      await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`);
      
      // Esperar a que carguen los resultados
      await page.waitForSelector('div[role="article"]', { timeout: 10000 });

      // Obtener la lista de negocios
      const businesses = await page.evaluate(() => {
        const items = document.querySelectorAll('div[role="article"]');
        return Array.from(items).map(item => {
          const name = item.querySelector('div[role="heading"]')?.textContent || '';
          const rating = parseFloat(item.querySelector('span[role="img"]')?.getAttribute('aria-label')?.split(' ')[0] || '0');
          const totalReviews = parseInt(item.querySelector('span[role="img"]')?.parentElement?.textContent?.replace(/[^0-9]/g, '') || '0');
          const address = item.querySelector('div[class*="fontBodyMedium"]')?.textContent || '';
          
          return {
            name,
            rating,
            totalReviews,
            address,
            category: '',
            reviews: []
          };
        });
      });

      return businesses;
    } catch (error) {
      console.error('Error searching businesses:', error);
      return [];
    } finally {
      await page.close();
    }
  }

  async getReviews(business: Business): Promise<Review[]> {
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }

    const page = await this.browser.newPage();
    
    try {
      // Navegar a la página del negocio
      await page.goto(`https://www.google.com/maps/place/?q=place_id:${business.name}`);
      
      // Esperar a que carguen las reseñas
      await page.waitForSelector('div[class*="review"]', { timeout: 10000 });

      // Obtener las reseñas
      const reviews = await page.evaluate(() => {
        const reviewElements = document.querySelectorAll('div[class*="review"]');
        return Array.from(reviewElements).map(review => {
          const author = review.querySelector('div[class*="author"]')?.textContent || '';
          const rating = parseFloat(review.querySelector('span[role="img"]')?.getAttribute('aria-label')?.split(' ')[0] || '0');
          const text = review.querySelector('div[class*="review-text"]')?.textContent || '';
          const date = review.querySelector('span[class*="date"]')?.textContent || '';
          const likes = parseInt(review.querySelector('span[class*="likes"]')?.textContent?.replace(/[^0-9]/g, '') || '0');

          return {
            id: Math.random().toString(36).substr(2, 9),
            author,
            rating,
            text,
            date,
            likes,
            businessName: '',
            businessAddress: '',
            category: ''
          };
        });
      });

      return reviews;
    } catch (error) {
      console.error('Error getting reviews:', error);
      return [];
    } finally {
      await page.close();
    }
  }
} 