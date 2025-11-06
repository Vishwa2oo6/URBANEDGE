import React, { useRef, useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import CategoryGrid from './components/CategoryGrid';
import RecommendationEngine from './components/RecommendationEngine';
import Footer from './components/Footer';
import Shop from './components/Shop';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Account from './components/Account';
import OrderConfirmation from './components/OrderConfirmation';
import Wishlist from './components/Wishlist';
import SearchResults from './components/SearchResults';
import OrderTracking from './components/OrderTracking';
import About from './components/About';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import ChatBot from './components/ChatBot';
import { CheckCircleIcon } from './components/icons';
import { CATEGORIES, PRODUCTS, USER, FAQS } from './constants';
import { CartItem, Product, Order, User, ShippingInfo } from './types';

type View = 
  | { page: 'home' }
  | { page: 'shop' }
  | { page: 'product', productId: number, previousPage: 'home' | 'shop' | 'wishlist' | 'search' }
  | { page: 'cart' }
  | { page: 'checkout' }
  | { page: 'account' }
  | { page: 'order-confirmation', orderId: string }
  | { page: 'wishlist' }
  | { page: 'search', query: string }
  | { page: 'order-tracking' }
  | { page: 'about' }
  | { page: 'contact' }
  | { page: 'faq' };

const App: React.FC = () => {
  const [view, setView] = useState<View>({ page: 'home' });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [user] = useState<User>(USER);
  const productsRef = useRef<HTMLDivElement>(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const confirmationTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (confirmationTimerRef.current) {
        clearTimeout(confirmationTimerRef.current);
      }
    };
  }, []);

  const handleNavigate = (path: string) => {
    const targetPage = path.split('#')[0];

    switch (targetPage) {
      case 'home':
        const [, anchor] = path.split('#');
        setView({ page: 'home' });
        if (anchor === 'products') {
          setTimeout(() => productsRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
        } else {
           window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        break;
      case 'shop':
        setView({ page: 'shop' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'cart':
      case 'checkout':
      case 'account':
      case 'wishlist':
      case 'order-tracking':
      case 'about':
      case 'contact':
      case 'faq':
        setView({ page: targetPage as 'cart' | 'checkout' | 'account' | 'wishlist' | 'order-tracking' | 'about' | 'contact' | 'faq' });
        window.scrollTo({ top: 0, behavior: 'auto' });
        break;
      default:
        setView({ page: 'home' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleSearchSubmit = (query: string) => {
    setView({ page: 'search', query });
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleSelectProduct = (productId: number) => {
    const currentPage = view.page;
    const previousPage = (currentPage === 'home' || currentPage === 'shop' || currentPage === 'wishlist' || currentPage === 'search') ? currentPage : 'shop';
    setView({ page: 'product', productId, previousPage });
     window.scrollTo({ top: 0, behavior: 'auto' });
  };
  
  const handleGoBack = () => {
    if(view.page === 'product') {
        const previousPage = view.previousPage || 'shop';
        if (previousPage === 'search') {
           // A bit of a hack to preserve search state, would need better state management for this
           // For now, we just go back to an empty search page which isn't ideal but works
           setView({ page: 'search', query: '' }); 
        } else {
           setView({ page: previousPage });
        }
    }
    if (view.page === 'checkout') {
      setView({ page: 'cart' });
    }
  };

  const handleShopNowClick = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleAddToCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
    
    setConfirmationMessage(`${quantity} x ${product.name} added to cart!`);
    if (confirmationTimerRef.current) {
        clearTimeout(confirmationTimerRef.current);
    }
    confirmationTimerRef.current = window.setTimeout(() => {
        setConfirmationMessage('');
    }, 3000);
  };

  const handleUpdateCartQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCart(cart => cart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
    }
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart(cart => cart.filter(item => item.id !== productId));
  };
  
  const handlePlaceOrder = (shippingInfo: ShippingInfo) => {
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingCost = subtotal > 999 ? 0 : 50;
    const total = subtotal + shippingCost;
    const orderId = `UE-${Date.now()}`;

    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString(),
      items: [...cart],
      total,
      shippingInfo,
      status: 'Processing',
    };
    
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    setCart([]);
    setView({ page: 'order-confirmation', orderId });
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleToggleWishlist = (productId: number) => {
    setWishlist(prevWishlist => 
      prevWishlist.includes(productId) 
      ? prevWishlist.filter(id => id !== productId) 
      : [...prevWishlist, productId]
    );
  };

  const mainCategories = CATEGORIES.filter(c => ['T-Shirts', 'Shirts', 'Jeans', 'Jackets'].includes(c.name));
  
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const renderContent = () => {
    switch (view.page) {
      case 'product':
        const product = PRODUCTS.find(p => p.id === view.productId);
        if (!product) {
            return <p>Product not found</p>;
        }
        return <ProductDetails 
            product={product} 
            onBack={handleGoBack} 
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isInWishlist={wishlist.includes(product.id)}
        />;
      case 'shop':
        return <Shop 
          onProductClick={handleSelectProduct} 
          onToggleWishlist={handleToggleWishlist} 
          wishlist={wishlist}
        />;
      case 'cart':
        return <Cart 
          cartItems={cart} 
          onUpdateQuantity={handleUpdateCartQuantity} 
          onRemoveItem={handleRemoveFromCart}
          onNavigate={handleNavigate}
        />;
      case 'checkout':
        return <Checkout 
            cartItems={cart} 
            onPlaceOrder={handlePlaceOrder} 
            onBack={handleGoBack} 
        />;
      case 'account':
        return <Account user={user} orders={orders} />;
      case 'order-confirmation':
        return <OrderConfirmation orderId={view.orderId} onNavigate={handleNavigate} />;
      case 'wishlist':
        const wishlistItems = PRODUCTS.filter(p => wishlist.includes(p.id));
        return <Wishlist
          items={wishlistItems}
          onProductClick={handleSelectProduct}
          onToggleWishlist={handleToggleWishlist}
          wishlist={wishlist}
          onNavigate={handleNavigate}
        />;
      case 'search':
        const searchResults = PRODUCTS.filter(p => 
            p.name.toLowerCase().includes(view.query.toLowerCase()) || 
            p.category.toLowerCase().includes(view.query.toLowerCase())
        );
        return <SearchResults
            query={view.query}
            results={searchResults}
            onProductClick={handleSelectProduct}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
        />;
      case 'order-tracking':
        return <OrderTracking orders={orders} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'faq':
        return <FAQ faqs={FAQS} />;
      case 'home':
      default:
        return (
          <>
            <Hero onShopNowClick={handleShopNowClick} />
            <div ref={productsRef}>
              <FeaturedProducts 
                onProductClick={handleSelectProduct} 
                onToggleWishlist={handleToggleWishlist}
                wishlist={wishlist}
              />
            </div>
            <CategoryGrid
              title="Shop By Category"
              categories={mainCategories}
              gridClasses="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto"
            />
            <RecommendationEngine />
          </>
        );
    }
  };

  return (
    <div className="bg-black min-h-screen font-sans">
      <Header 
        onNavigate={handleNavigate} 
        cartItemCount={cartItemCount}
        wishlistCount={wishlist.length}
        onSearchSubmit={handleSearchSubmit}
      />
      <main>
        {renderContent()}
      </main>
      <Footer onNavigate={handleNavigate} />
      {confirmationMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-md shadow-lg animate-fade-in z-50 flex items-center gap-3">
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
            <p className="font-medium">{confirmationMessage}</p>
        </div>
      )}
      <ChatBot />
    </div>
  );
};

export default App;
