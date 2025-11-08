
import React from 'react';
import { Category } from '../types';

interface CategoryGridProps {
  title: string;
  categories: Category[];
  gridClasses?: string;
}

const CategoryCard: React.FC<{ category: Category }> = ({ category }) => (
  <div className="relative group overflow-hidden aspect-[3/4]">
    <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <h3 className="text-white text-2xl font-bold uppercase tracking-widest text-center px-2">{category.name}</h3>
    </div>
    <a href="#" className="absolute inset-0" aria-label={`Shop ${category.name}`}></a>
  </div>
);

const CategoryGrid: React.FC<CategoryGridProps> = ({ title, categories, gridClasses = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' }) => {
  return (
    <section className="py-16 sm:py-24 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-white uppercase tracking-wider mb-12">
          {title}
        </h2>
        <div className={`grid ${gridClasses} gap-6 lg:gap-8`}>
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;