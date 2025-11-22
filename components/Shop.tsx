
import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ChevronDownIcon, CheckIcon, FilterIcon, XIcon } from './icons';
import { Product, Category } from '../types';
import { CATEGORIES } from '../constants';

const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'stock-desc', label: 'Availability' },
];

const colorMap: { [key: string]: string } = {
    'Black': 'bg-black',
    'White': 'bg-white',
    'Blue': 'bg-blue-500',
    'Olive': 'bg-yellow-900',
    'Red': 'bg-red-500',
    'Brown': 'bg-yellow-700',
};

// Helper components moved outside the main Shop component to prevent re-rendering issues.
const FilterSection: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="border-b border-gray-800 pb-6">
        <h3 className="text-sm font-semibold text-white tracking-wider uppercase">{title}</h3>
        <div className="mt-4">{children}</div>
    </div>
);

const Checkbox: React.FC<{label: string, checked: boolean, onChange: () => void}> = ({ label, checked, onChange }) => (
     <label className="flex items-center space-x-3 cursor-pointer">
        <div className={`w-5 h-5 border flex items-center justify-center transition-colors duration-200 ${checked ? 'bg-white border-white' : 'bg-transparent border-gray-600'}`}>
            {checked && <CheckIcon className="w-4 h-4 text-black" />}
        </div>
        <span className="text-sm text-gray-300">{label}</span>
    </label>
);

const ColorSwatch: React.FC<{color: string, checked: boolean, onChange: () => void}> = ({ color, checked, onChange }) => (
    <button onClick={onChange} className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${checked ? 'border-white scale-110' : 'border-transparent'} flex items-center justify-center`}>
        <span className={`${colorMap[color] || 'bg-gray-500'} w-6 h-6 rounded-full border border-gray-600`}></span>
    </button>
);

const CategoryFilterItem: React.FC<{ category: Category; isSelected: boolean; onSelect: () => void; }> = ({ category, isSelected, onSelect }) => (
    <button 
        onClick={onSelect} 
        className={`relative group overflow-hidden aspect-[4/3] rounded-md block w-full border-2 transition-all duration-300 ${isSelected ? 'border-white' : 'border-transparent'}`}
    >
        <img 
            src={category.imageUrl} 
            alt={category.name} 
            className={`w-full h-full object-cover transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`} 
        />
        <div className="absolute inset-0 flex items-center justify-center p-2 text-center transition-all duration-300 bg-black/50 group-hover:bg-black/60">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">{category.name}</h4>
        </div>
        {isSelected && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                <CheckIcon className="w-8 h-8 text-white" />
            </div>
        )}
    </button>
);

const SizeButton: React.FC<{ size: string; isSelected: boolean; onClick: () => void; }> = ({ size, isSelected, onClick }) => (
    <button
        onClick={onClick}
        aria-pressed={isSelected}
        className={`w-full aspect-square rounded-md border flex items-center justify-center font-bold text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white ${
            isSelected
            ? 'bg-white text-black border-white'
            : 'border-gray-600 text-white hover:border-white hover:bg-gray-800'
        }`}
    >
        {size}
    </button>
);


interface ShopProps {
    products: Product[];
    onProductClick: (id: number) => void;
    onToggleWishlist: (id: number) => void;
    wishlist: number[];
    onAddToCart: (product: Product, quantity: number) => void;
}

interface SelectedFilters {
    category: string[];
    color: string[];
    size: string[];
    fabric: string[];
    fit: string[];
}

const Shop: React.FC<ShopProps> = ({ products, onProductClick, onToggleWishlist, wishlist, onAddToCart }) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    const allPrices = useMemo(() => products.map(p => p.price), [products]);
    const minPrice = useMemo(() => allPrices.length > 0 ? Math.floor(Math.min(...allPrices) / 100) * 100 : 0, [allPrices]);
    const maxPrice = useMemo(() => allPrices.length > 0 ? Math.ceil(Math.max(...allPrices) / 100) * 100 : 10000, [allPrices]);

    const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(() => {
        try {
            const savedFiltersJSON = localStorage.getItem('shopFilters');
            if (savedFiltersJSON) {
                const savedFilters = JSON.parse(savedFiltersJSON);
                 if (savedFilters && typeof savedFilters === 'object') {
                    const sanitize = (val: unknown): string[] => Array.isArray(val) ? val.filter((i: unknown): i is string => typeof i === 'string') : [];
                    return {
                        category: sanitize((savedFilters as any).category),
                        color: sanitize((savedFilters as any).color),
                        size: sanitize((savedFilters as any).size),
                        fabric: sanitize((savedFilters as any).fabric),
                        fit: sanitize((savedFilters as any).fit),
                    };
                }
            }
        } catch (error) {
            console.error("Failed to parse filters from localStorage", error);
        }
        return { category: [], color: [], size: [], fabric: [], fit: [] };
    });
    
    const [selectedPriceRange, setSelectedPriceRange] = useState(() => {
        try {
            const savedRangeJSON = localStorage.getItem('shopPriceRange');
            if (savedRangeJSON) {
                const savedRange = JSON.parse(savedRangeJSON);
                if (savedRange && typeof savedRange.min === 'number' && typeof savedRange.max === 'number') {
                    return { min: savedRange.min, max: savedRange.max };
                }
            }
        } catch (error) {
            console.error("Failed to parse or use price range from localStorage", error);
        }
        return { min: 0, max: 10000 };
    });
    
    // Update price range when products change if not set by user interaction yet
    useEffect(() => {
        if (products.length > 0) {
             setSelectedPriceRange(prev => {
                 // Only update if the range seems default or out of bounds
                 if (prev.min === 0 && prev.max === 10000) {
                     return { min: minPrice, max: maxPrice };
                 }
                 return prev;
             });
        }
    }, [products, minPrice, maxPrice]);

    const [sortBy, setSortBy] = useState('featured');

    useEffect(() => {
        try {
            localStorage.setItem('shopFilters', JSON.stringify(selectedFilters));
        } catch (error) {
            console.error("Failed to save filters to localStorage", error);
        }
    }, [selectedFilters]);

    useEffect(() => {
        try {
            localStorage.setItem('shopPriceRange', JSON.stringify(selectedPriceRange));
        } catch (error) {
            console.error("Failed to save price range to localStorage", error);
        }
    }, [selectedPriceRange]);
    
    useEffect(() => {
        if (isFilterOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isFilterOpen]);

    const availableCategories = useMemo(() => CATEGORIES, []);
    const availableColors = useMemo(() => [...new Set(products.flatMap(p => p.colors || []))], [products]);
    const availableSizes = useMemo(() => {
        const sizes = [...new Set(products.flatMap(p => p.sizes || []))] as string[];
        const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL'];
        const numericSizes = sizes.filter(s => !isNaN(parseInt(s as string))).sort((a, b) => parseInt(a as string) - parseInt(b as string));
        const stringSizes = sizeOrder.filter(s => sizes.includes(s));
        return [...stringSizes, ...numericSizes];
    }, [products]);
    const availableFabrics = useMemo(() => [...new Set(products.map(p => p.fabric))], [products]);
    const availableFits = useMemo(() => {
        const fits = [...new Set(products.map(p => p.fit))];
        return fits.filter(fit => !['N/A', 'Adjustable'].includes(fit));
    }, [products]);

    const handleCheckboxChange = (filterType: keyof typeof selectedFilters, value: string) => {
        setSelectedFilters(prev => {
            const currentValues = prev[filterType];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];
            return { ...prev, [filterType]: newValues };
        });
    };
    
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numericValue = parseInt(value, 10);

        setSelectedPriceRange(prev => {
            const newRange = { ...prev, [name]: numericValue };
            if (name === 'min' && newRange.min > newRange.max) {
                newRange.max = newRange.min;
            }
            if (name === 'max' && newRange.max < newRange.min) {
                newRange.min = newRange.max;
            }
            return newRange;
        });
    };

    const clearFilters = () => {
        setSelectedFilters({ category: [], color: [], size: [], fabric: [], fit: [] });
        setSelectedPriceRange({ min: minPrice, max: maxPrice });
    };

    const isPriceFilterActive = selectedPriceRange.min > minPrice || selectedPriceRange.max < maxPrice;

    const activeFilterCount =
        selectedFilters.category.length +
        selectedFilters.color.length +
        selectedFilters.size.length +
        selectedFilters.fabric.length +
        selectedFilters.fit.length +
        (isPriceFilterActive ? 1 : 0);

    const filteredAndSortedProducts = useMemo(() => {
        let filteredProducts: Product[] = [...products];

        if (selectedFilters.category.length > 0) {
            filteredProducts = filteredProducts.filter(p => selectedFilters.category.includes(p.category));
        }
        if (selectedFilters.color.length > 0) {
            filteredProducts = filteredProducts.filter(p => p.colors?.some(c => selectedFilters.color.includes(c)));
        }
        if (selectedFilters.size.length > 0) {
            filteredProducts = filteredProducts.filter(p => p.sizes?.some(s => selectedFilters.size.includes(s)));
        }
        if (selectedFilters.fabric.length > 0) {
            filteredProducts = filteredProducts.filter(p => selectedFilters.fabric.includes(p.fabric));
        }
        if (selectedFilters.fit.length > 0) {
            filteredProducts = filteredProducts.filter(p => selectedFilters.fit.includes(p.fit));
        }
        
        filteredProducts = filteredProducts.filter(p => p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max);

        switch (sortBy) {
            case 'stock-desc':
                filteredProducts.sort((a, b) => b.stock - a.stock);
                break;
            case 'price-asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'featured':
            default:
                filteredProducts.sort((a, b) => a.id - b.id);
                break;
        }

        return filteredProducts;
    }, [products, selectedFilters, sortBy, selectedPriceRange]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
             <div className="text-center mb-12">
                <h1 className="text-4xl font-bold uppercase tracking-wider text-white">Our Collection</h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
                    Discover our curated selection of men’s fashion essentials — from bold streetwear to refined formals. Find your fit, your color, and your vibe, all in one place.
                </p>
            </div>
            
            {/* Backdrop for mobile filter */}
            {isFilterOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setIsFilterOpen(false)}></div>}
            
            <div className="flex flex-col md:flex-row gap-12">
                {/* Filters Sidebar */}
                <aside className={`
                    fixed top-0 left-0 h-full w-full max-w-xs bg-black z-50 p-6 flex flex-col
                    transition-transform duration-300 ease-in-out
                    md:static md:w-64 lg:w-72 md:h-auto md:max-w-none md:p-0 md:bg-transparent md:z-auto md:translate-x-0
                    ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`
                }>
                    <div className="flex-shrink-0">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">Filters</h2>
                            <button onClick={() => setIsFilterOpen(false)} className="md:hidden text-gray-400 hover:text-white"><XIcon /></button>
                        </div>
                        {activeFilterCount > 0 && (
                            <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-400">Clear All ({activeFilterCount})</button>
                        )}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto mt-6 space-y-6 -mr-4 pr-4">
                       <FilterSection title="Category">
                            <div className="grid grid-cols-2 gap-2">
                                {availableCategories.map(cat => (
                                    <CategoryFilterItem 
                                        key={cat.id}
                                        category={cat}
                                        isSelected={selectedFilters.category.includes(cat.name)}
                                        onSelect={() => handleCheckboxChange('category', cat.name)}
                                    />
                                ))}
                            </div>
                       </FilterSection>
                       
                       <FilterSection title="Price Range">
                           <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                                        <label htmlFor="min-price">Min Price</label>
                                        <span>₹{selectedPriceRange.min}</span>
                                    </div>
                                    <input
                                        id="min-price"
                                        type="range"
                                        name="min"
                                        min={minPrice}
                                        max={maxPrice}
                                        value={selectedPriceRange.min}
                                        onChange={handlePriceChange}
                                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                        step="100"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                                        <label htmlFor="max-price">Max Price</label>
                                        <span>₹{selectedPriceRange.max}</span>
                                    </div>
                                    <input
                                        id="max-price"
                                        type="range"
                                        name="max"
                                        min={minPrice}
                                        max={maxPrice}
                                        value={selectedPriceRange.max}
                                        onChange={handlePriceChange}
                                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                        step="100"
                                    />
                                </div>
                            </div>
                       </FilterSection>
                       
                       <FilterSection title="Color">
                            <div className="flex flex-wrap gap-3">
                               {availableColors.map(color => <ColorSwatch key={color} color={color} checked={selectedFilters.color.includes(color)} onChange={() => handleCheckboxChange('color', color)} />)}
                            </div>
                       </FilterSection>
                       
                       <FilterSection title="Size">
                            <div className="grid grid-cols-4 gap-3">
                                {availableSizes.map(size => (
                                    <SizeButton
                                        key={size}
                                        size={size}
                                        isSelected={selectedFilters.size.includes(size)}
                                        onClick={() => handleCheckboxChange('size', size)}
                                    />
                                ))}
                            </div>
                       </FilterSection>

                       <FilterSection title="Fit">
                            <div className="space-y-3">
                                {availableFits.map(fit => <Checkbox key={fit} label={fit} checked={selectedFilters.fit.includes(fit)} onChange={() => handleCheckboxChange('fit', fit)} />)}
                            </div>
                       </FilterSection>
                       
                       <FilterSection title="Fabric">
                            <div className="space-y-3">
                                {availableFabrics.map(fabric => <Checkbox key={fabric} label={fabric} checked={selectedFilters.fabric.includes(fabric)} onChange={() => handleCheckboxChange('fabric', fabric)} />)}
                            </div>
                       </FilterSection>
                    </div>

                    <div className="flex-shrink-0 mt-auto pt-6 md:hidden">
                        <button onClick={() => setIsFilterOpen(false)} className="w-full py-3 bg-white text-black font-bold uppercase tracking-wider">
                            View Results ({filteredAndSortedProducts.length})
                        </button>
                    </div>
                </aside>
                
                {/* Products Grid */}
                <main className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                        <p className="text-sm text-gray-400 hidden sm:block">{filteredAndSortedProducts.length} Results</p>
                        
                        <button onClick={() => setIsFilterOpen(true)} className="md:hidden w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-800 rounded-md">
                            <FilterIcon />
                            <span>Filters ({activeFilterCount})</span>
                        </button>

                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-gray-800 border border-gray-700 text-white py-2 pl-4 pr-10 focus:ring-2 focus:ring-white focus:border-white focus:outline-none rounded-md text-sm"
                                aria-label="Sort products"
                            >
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                <ChevronDownIcon />
                            </div>
                        </div>
                    </div>
                    
                     <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
                        {filteredAndSortedProducts.length > 0 ? (
                            filteredAndSortedProducts.map(product => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    onProductClick={onProductClick}
                                    onToggleWishlist={onToggleWishlist}
                                    isInWishlist={wishlist.includes(product.id)}
                                    onAddToCart={onAddToCart}
                                />
                            ))
                        ) : (
                            <p className="text-center text-gray-400 col-span-full py-16">No products found matching your criteria.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Shop;
