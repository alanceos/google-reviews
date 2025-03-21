import React from 'react';
import { BusinessAnalysis, CategoryAnalysis } from '../types/Review';

interface AnalysisDisplayProps {
  businessAnalysis?: BusinessAnalysis;
  categoryAnalysis?: CategoryAnalysis;
  isLoading: boolean;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({
  businessAnalysis,
  categoryAnalysis,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {businessAnalysis && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Análisis del Negocio</h3>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Calificación General:</span>
              <span className="text-2xl font-bold text-blue-600">
                {businessAnalysis.overallScore.toFixed(1)}/5.0
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${(businessAnalysis.overallScore / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-600 mb-2">Fortalezas</h4>
              <ul className="list-disc list-inside space-y-1">
                {businessAnalysis.strengths.map((strength, index) => (
                  <li key={index} className="text-gray-700">{strength}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-600 mb-2">Áreas de Mejora</h4>
              <ul className="list-disc list-inside space-y-1">
                {businessAnalysis.weaknesses.map((weakness, index) => (
                  <li key={index} className="text-gray-700">{weakness}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-blue-600 mb-2">Recomendaciones</h4>
            <ul className="list-disc list-inside space-y-1">
              {businessAnalysis.recommendations.map((rec, index) => (
                <li key={index} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>

          <p className="mt-4 text-sm text-gray-500">{businessAnalysis.summary}</p>
        </div>
      )}

      {categoryAnalysis && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Análisis de Categoría</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {categoryAnalysis.averageRating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">Calificación Promedio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {categoryAnalysis.totalReviews}
              </div>
              <div className="text-sm text-gray-500">Total de Reseñas</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-600 mb-2">Tendencias Positivas</h4>
              <ul className="list-disc list-inside space-y-1">
                {categoryAnalysis.topStrengths.map((strength, index) => (
                  <li key={index} className="text-gray-700">{strength}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-600 mb-2">Tendencias Negativas</h4>
              <ul className="list-disc list-inside space-y-1">
                {categoryAnalysis.topWeaknesses.map((weakness, index) => (
                  <li key={index} className="text-gray-700">{weakness}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-blue-600 mb-2">Recomendaciones Generales</h4>
            <ul className="list-disc list-inside space-y-1">
              {categoryAnalysis.generalRecommendations.map((rec, index) => (
                <li key={index} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}; 