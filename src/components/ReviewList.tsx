import React from 'react';
import { Review } from '../types/Review';

interface ReviewListProps {
  reviews: Review[];
  isLoading: boolean;
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay reseñas disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{review.author}</h3>
              <p className="text-sm text-gray-500">{review.date}</p>
            </div>
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="ml-1 text-gray-700">{review.rating}</span>
            </div>
          </div>
          <p className="text-gray-700">{review.text}</p>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <span>👍 {review.likes}</span>
          </div>
        </div>
      ))}
    </div>
  );
}; 