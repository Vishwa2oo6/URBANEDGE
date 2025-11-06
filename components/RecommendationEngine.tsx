
import React, { useState } from 'react';
import { getFashionRecommendations } from '../services/geminiService';
import { Recommendation } from '../types';

const RecommendationEngine: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const result = await getFashionRecommendations(prompt);
      setRecommendations(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Find Your Style</h2>
          <p className="mt-4 text-lg text-gray-400">
            Describe your vibe or occasion, and our AI stylist will curate a look just for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'A casual look for a weekend trip'"
              className="flex-grow p-4 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-white focus:border-white focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Thinking...' : 'Get My Style'}
            </button>
          </div>
        </form>

        <div className="mt-12">
          {error && <p className="text-center text-red-500">{error}</p>}
          {recommendations.length > 0 && (
            <div className="space-y-8">
                <h3 className="text-2xl font-bold text-center text-white">Your Personal Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {recommendations.map((rec, index) => (
                        <div key={index} className="bg-gray-800 p-6 border border-gray-700">
                            <p className="text-xs uppercase tracking-widest text-gray-400">{rec.category}</p>
                            <h4 className="text-lg font-bold text-white mt-2">{rec.itemName}</h4>
                            <p className="text-gray-300 mt-2 text-sm">{rec.reasoning}</p>
                        </div>
                    ))}
                </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RecommendationEngine;
