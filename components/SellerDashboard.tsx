import React, { useState } from 'react';
import { Product, Order, AIStockSuggestion } from '../types';
import { getAIStockSuggestions } from '../services/geminiService';
import { SparklesIcon, XIcon } from './icons';

interface SellerDashboardProps {
    products: Product[];
    orders: Order[];
    onUpdateStock: (productId: number, newStock: number) => void;
    onAddProduct: (productData: Omit<Product, 'id'>) => void;
}

const InputField: React.FC<{ name: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string, type?: string, helpText?: string }> = ({ name, label, value, onChange, placeholder, type = 'text', helpText = '' }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} className="mt-1 block w-full bg-gray-800 border-gray-700 text-white p-3 focus:ring-white focus:border-white rounded-md" />
        {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
    </div>
);

const TextAreaField: React.FC<{ name: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, placeholder: string }> = ({ name, label, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} rows={3} className="mt-1 block w-full bg-gray-800 border-gray-700 text-white p-3 focus:ring-white focus:border-white rounded-md"></textarea>
    </div>
);

const SellerDashboard: React.FC<SellerDashboardProps> = ({ products, orders, onUpdateStock, onAddProduct }) => {
    const [stockUpdates, setStockUpdates] = useState<Record<number, string>>({});
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<AIStockSuggestion[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const initialFormState = {
        name: '', category: '', price: '', imageUrls: '', description: '',
        fabric: '', fit: '', care: '', stock: '', colors: '', sizes: ''
    };
    const [newProductForm, setNewProductForm] = useState(initialFormState);

    const handleStockChange = (productId: number, value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        setStockUpdates(prev => ({ ...prev, [productId]: numericValue }));
    };

    const handleUpdateClick = (productId: number) => {
        const newStockStr = stockUpdates[productId];
        if (newStockStr !== undefined && newStockStr.trim() !== '') {
            const newStock = parseInt(newStockStr, 10);
            if (!isNaN(newStock) && newStock >= 0) {
                onUpdateStock(productId, newStock);
                setStockUpdates(prev => {
                    const newUpdates = { ...prev };
                    delete newUpdates[productId];
                    return newUpdates;
                });
            }
        }
    };

    const handleRunAIAnalysis = async () => {
        setIsAnalyzing(true);
        setAiError(null);
        setSuggestions([]);
        try {
            const result = await getAIStockSuggestions(products, orders);
            setSuggestions(result);
        } catch (err) {
            setAiError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleApplySuggestion = (productId: number) => {
        onUpdateStock(productId, 0);
        setSuggestions(prev => prev.filter(s => s.productId !== productId));
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewProductForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddProductSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const price = parseFloat(newProductForm.price);
        const stock = parseInt(newProductForm.stock, 10);
        const imageUrls = newProductForm.imageUrls.split(',').map(url => url.trim()).filter(Boolean);

        if (!newProductForm.name || !newProductForm.category || isNaN(price) || isNaN(stock) || imageUrls.length === 0) {
            alert('Please fill in all required fields (Name, Category, Price, Stock, Image URLs) with valid values.');
            return;
        }

        const productToAdd: Omit<Product, 'id'> = {
            name: newProductForm.name,
            category: newProductForm.category,
            price: price,
            imageUrls: imageUrls,
            description: newProductForm.description,
            fabric: newProductForm.fabric,
            fit: newProductForm.fit,
            care: newProductForm.care.split(',').map(c => c.trim()).filter(Boolean),
            stock: stock,
            colors: newProductForm.colors.split(',').map(c => c.trim()).filter(Boolean),
            sizes: newProductForm.sizes.split(',').map(s => s.trim()).filter(Boolean),
        };

        onAddProduct(productToAdd);
        setIsAddModalOpen(false);
        setNewProductForm(initialFormState);
    };

    const AddProductModal = () => (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="relative bg-gray-900 border border-gray-700 rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
                <header className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-lg font-bold text-white">Add New Product</h2>
                    <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white"><XIcon /></button>
                </header>
                <form onSubmit={handleAddProductSubmit} className="flex-grow p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField name="name" label="Product Name*" value={newProductForm.name} onChange={handleFormChange} placeholder="e.g., Urban Explorer Jacket" />
                        <InputField name="category" label="Category*" value={newProductForm.category} onChange={handleFormChange} placeholder="e.g., Jackets" />
                        <InputField name="price" label="Price*" value={newProductForm.price} onChange={handleFormChange} placeholder="e.g., 2999" type="number" />
                        <InputField name="stock" label="Stock*" value={newProductForm.stock} onChange={handleFormChange} placeholder="e.g., 15" type="number" />
                        <div className="md:col-span-2">
                            <InputField name="imageUrls" label="Image URLs*" value={newProductForm.imageUrls} onChange={handleFormChange} placeholder="Comma-separated URLs" helpText="Provide at least one URL. Separate multiple URLs with a comma." />
                        </div>
                        <div className="md:col-span-2">
                            <TextAreaField name="description" label="Description" value={newProductForm.description} onChange={handleFormChange} placeholder="A versatile jacket crafted..." />
                        </div>
                        <InputField name="fabric" label="Fabric" value={newProductForm.fabric} onChange={handleFormChange} placeholder="e.g., 100% Nylon Shell" />
                        <InputField name="fit" label="Fit" value={newProductForm.fit} onChange={handleFormChange} placeholder="e.g., Regular" />
                        <InputField name="colors" label="Colors (Optional)" value={newProductForm.colors} onChange={handleFormChange} placeholder="Comma-separated, e.g., Black, Olive" />
                        <InputField name="sizes" label="Sizes (Optional)" value={newProductForm.sizes} onChange={handleFormChange} placeholder="Comma-separated, e.g., S, M, L, XL" />
                        <div className="md:col-span-2">
                            <InputField name="care" label="Care Instructions (Optional)" value={newProductForm.care} onChange={handleFormChange} placeholder="Comma-separated, e.g., Machine wash cold" />
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-700">
                        <button type="submit" className="w-full py-3 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 rounded-md">
                            Save Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold uppercase tracking-wider text-white">Seller Dashboard</h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
                    Manage your product inventory. Update stock levels manually or use our AI assistant to identify items that need attention.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button
                        onClick={handleRunAIAnalysis}
                        disabled={isAnalyzing}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 text-white font-bold uppercase tracking-wider hover:bg-pink-700 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md"
                    >
                        {isAnalyzing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Analyzing...</span>
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="w-5 h-5" />
                                <span>Run AI Stock Analysis</span>
                            </>
                        )}
                    </button>
                    <button 
                        onClick={() => setIsAddModalOpen(true)} 
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors duration-300 rounded-md"
                    >
                        Add New Product
                    </button>
                </div>
                {aiError && <p className="mt-4 text-red-400">{aiError}</p>}
                {suggestions.length > 0 && (
                    <div className="mt-8 text-left max-w-4xl mx-auto bg-gray-900 border border-gray-800 p-6 animate-fade-in rounded-lg">
                        <h2 className="text-xl font-bold text-white mb-4">AI Recommendations</h2>
                        <p className="text-sm text-gray-400 mb-4">Our AI has identified the following products that should be marked as out of stock based on current inventory and sales data.</p>
                        <div className="space-y-4">
                            {suggestions.map(suggestion => (
                                <div key={suggestion.productId} className="bg-gray-800 p-4 rounded-md flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div>
                                        <p className="font-bold text-white">{suggestion.productName}</p>
                                        <p className="text-sm text-gray-300">{suggestion.reasoning}</p>
                                        <p className="text-xs text-gray-400">Current Stock: {suggestion.currentStock}</p>
                                    </div>
                                    <button
                                        onClick={() => handleApplySuggestion(suggestion.productId)}
                                        className="px-4 py-2 bg-white text-black font-bold text-sm hover:bg-gray-200 transition-colors rounded-md w-full sm:w-auto flex-shrink-0"
                                    >
                                        Mark as Out of Stock
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="bg-gray-900 border border-gray-800 overflow-hidden rounded-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-800">
                        <thead className="bg-gray-800">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Product</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Price</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Current Stock</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Update Stock</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Update</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {products.sort((a,b) => a.id - b.id).map((product) => (
                                <tr key={product.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <img className="h-10 w-10 rounded-md object-cover" src={product.imageUrls[0]} alt={product.name} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="font-medium text-white">{product.name}</div>
                                                <div className="text-gray-400">{product.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">₹{product.price.toFixed(2)}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            product.stock > 10 ? 'bg-green-100 text-green-800' :
                                            product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {product.stock} units
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <input
                                            type="text"
                                            value={stockUpdates[product.id] ?? ''}
                                            onChange={(e) => handleStockChange(product.id, e.target.value)}
                                            placeholder={`${product.stock}`}
                                            className="w-24 bg-gray-800 border-gray-700 text-white p-2 focus:ring-white focus:border-white rounded-md"
                                        />
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <button
                                            onClick={() => handleUpdateClick(product.id)}
                                            disabled={stockUpdates[product.id] === undefined || stockUpdates[product.id].trim() === ''}
                                            className="text-white bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed"
                                        >
                                            Update
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isAddModalOpen && <AddProductModal />}
        </div>
    );
};

export default SellerDashboard;
