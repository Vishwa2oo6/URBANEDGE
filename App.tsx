
import React, { useRef, useState, useEffect, Suspense, lazy } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import CategoryGrid from './components/CategoryGrid';
import RecommendationEngine from './components/RecommendationEngine';
import Footer from './components/Footer';
import BottomNavBar from './components/BottomNavBar';
import ChatBot from './components/ChatBot';
import { CheckCircleIcon } from './components/icons';
import { CATEGORIES, PRODUCTS, USERS as mockUsers, FAQS } from './constants';
import { CartItem, Product, Order, User, ShippingInfo } from './types';

// Lazy load page-level components for code-splitting
const Shop = lazy(() => import('./components/Shop'));
const ProductDetails = lazy(() => import('./components/ProductDetails'));
const Cart = lazy(() => import('./components/Cart'));
const Checkout = lazy(() => import('./components/Checkout'));
const Account = lazy(() => import('./components/Account'));
const OrderConfirmation = lazy(() => import('./components/OrderConfirmation'));
const Wishlist = lazy(() => import('./components/Wishlist'));
const SearchResults = lazy(() => import('./components/SearchResults'));
const OrderTracking = lazy(() => import('./components/OrderTracking'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const FAQ = lazy(() => import('./components/FAQ'));
const Login = lazy(() => import('./components/Login'));
const SignUp = lazy(() => import('./components/SignUp'));


type Page = 
  | 'home' | 'shop' | 'cart' | 'checkout' | 'account' | 'wishlist' 
  | 'order-tracking' | 'about' | 'contact' | 'faq' | 'login' | 'signup'
  | 'search' | 'product' | 'order-confirmation';

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
  | { page: 'faq' }
  | { page: 'login' }
  | { page: 'signup' };
  
const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center" style={{ height: 'calc(100vh - 160px)' }}>
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-white"></div>
    </div>
);


const App: React.FC = () => {
  const [view, setView] = useState<View>({ page: 'home' });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [authRedirect, setAuthRedirect] = useState<Page | null>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const confirmationTimerRef = useRef<number | null>(null);

  // --- Persistent State Management ---
  const [users, setUsers] = useState<User[]>(() => {
    try {
        const storedUsers = localStorage.getItem('urbanedge_users');
        return storedUsers ? JSON.parse(storedUsers) : mockUsers;
    } catch { return mockUsers; }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
        const storedOrders = localStorage.getItem('urbanedge_orders');
        return storedOrders ? JSON.parse(storedOrders) : [];
    } catch { return []; }
  });

  const [wishlist, setWishlist] = useState<number[]>([]);

  // Persist users and orders to localStorage
  useEffect(() => { localStorage.setItem('urbanedge_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('urbanedge_orders', JSON.stringify(orders)); }, [orders]);

  // Initial auth check on app load
  useEffect(() => {
    try {
        const storedUserId = localStorage.getItem('urbanedge_current_user_id');
        if (storedUserId) {
            const user = users.find(u => u.id === JSON.parse(storedUserId));
            if (user) {
                const { password, ...userWithoutPassword } = user;
                setCurrentUser(userWithoutPassword);
            }
        }
    } catch (e) { console.error("Failed to load user from session.", e); }
  }, [users]);

  // Manage user-specific wishlist
  useEffect(() => {
    if (currentUser) {
        try {
            const allWishlists = JSON.parse(localStorage.getItem('urbanedge_wishlists') || '{}');
            setWishlist(allWishlists[currentUser.id] || []);
        } catch (e) { console.error("Failed to load wishlist.", e); setWishlist([]); }
    } else {
        setWishlist([]); // Clear on logout
    }
  }, [currentUser]);

  // Persist user-specific wishlist
  useEffect(() => {
      if (currentUser) {
          try {
              const allWishlists = JSON.parse(localStorage.getItem('urbanedge_wishlists') || '{}');
              allWishlists[currentUser.id] = wishlist;
              localStorage.setItem('urbanedge_wishlists', JSON.stringify(allWishlists));
          } catch (e) { console.error("Failed to save wishlist.", e); }
      }
  }, [wishlist, currentUser]);

  useEffect(() => {
    return () => {
      if (confirmationTimerRef.current) {
        clearTimeout(confirmationTimerRef.current);
      }
    };
  }, []);

  const handleNavigate = (path: string) => {
    const targetPage = path.split('#')[0] as Page;
    const protectedPages: Page[] = ['account', 'checkout', 'wishlist', 'order-tracking'];

    if (protectedPages.includes(targetPage) && !currentUser) {
        setAuthRedirect(targetPage);
        setView({ page: 'login' });
        window.scrollTo({ top: 0, behavior: 'auto' });
        return;
    }


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
      case 'cart':
      case 'checkout':
      case 'account':
      case 'wishlist':
      case 'order-tracking':
      case 'about':
      case 'contact':
      case 'faq':
      case 'login':
      case 'signup':
        setView({ page: targetPage });
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
           setView({ page: 'search', query: '' }); 
        } else {
           setView({ page: previousPage as 'home' | 'shop' | 'wishlist' });
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
    if (!currentUser) {
        handleNavigate('login');
        setAuthRedirect('checkout');
        return;
    }
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingCost = subtotal > 999 ? 0 : 50;
    const total = subtotal + shippingCost;
    const orderId = `UE-${Date.now()}`;

    const newOrder: Order = {
      id: orderId,
      userId: currentUser.id,
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
    if (!currentUser) {
        handleNavigate('login');
        setAuthRedirect('shop');
        return;
    }
    setWishlist(prevWishlist => 
      prevWishlist.includes(productId) 
      ? prevWishlist.filter(id => id !== productId) 
      : [...prevWishlist, productId]
    );
  };

  const handleLogin = async (email: string, pass: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
    if (user) {
        const { password, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);
        localStorage.setItem('urbanedge_current_user_id', JSON.stringify(user.id));
        const destination = authRedirect || 'account';
        handleNavigate(destination);
        setAuthRedirect(null);
    } else {
        throw new Error("Invalid email or password.");
    }
  };

  const handleSignUp = async (name: string, email: string, pass: string) => {
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
          throw new Error("An account with this email already exists.");
      }
      const newUser: User = {
          id: Date.now(),
          name,
          email,
          password: pass,
          memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };
      setUsers(prev => [...prev, newUser]);
      const { password, ...userWithoutPassword } = newUser;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('urbanedge_current_user_id', JSON.stringify(newUser.id));
      
      const destination = authRedirect || 'account';
      handleNavigate(destination);
      setAuthRedirect(null);
  };

  const handleLogout = () => {
      setCurrentUser(null);
      localStorage.removeItem('urbanedge_current_user_id');
      handleNavigate('home');
  };
  
  const handleUpdateUser = (updatedUser: User) => {
      setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
      if (currentUser && currentUser.id === updatedUser.id) {
          setCurrentUser(prev => ({...prev, ...updatedUser }));
      }
  };

  const mainCategories = CATEGORIES.filter(c => ['T-Shirts', 'Shirts', 'Jeans', 'Jackets'].includes(c.name));
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const userOrders = orders.filter(order => order.userId === currentUser?.id);

  const renderContent = () => {
    switch (view.page) {
      case 'product':
        const product = PRODUCTS.find(p => p.id === view.productId);
        if (!product) return <p>Product not found</p>;
        return <ProductDetails 
            product={product} 
            onBack={handleGoBack} 
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isInWishlist={wishlist.includes(product.id)}
            allProducts={PRODUCTS}
            onProductClick={handleSelectProduct}
            wishlist={wishlist}
        />;
      case 'shop':
        return <Shop 
          onProductClick={handleSelectProduct} 
          onToggleWishlist={handleToggleWishlist} 
          wishlist={wishlist}
          onAddToCart={handleAddToCart}
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
        return currentUser ? <Account 
            user={currentUser} 
            orders={userOrders} 
            wishlistCount={wishlist.length}
            onLogout={handleLogout}
            onUpdateUser={handleUpdateUser}
            onNavigate={handleNavigate}
        /> : <LoadingSpinner />;
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
            onAddToCart={handleAddToCart}
        />;
      case 'order-tracking':
        return <OrderTracking orders={userOrders} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'faq':
        return <FAQ faqs={FAQS} />;
      case 'login':
        return <Login onLogin={handleLogin} onNavigate={(page) => handleNavigate(page)} />;
      case 'signup':
        return <SignUp onSignUp={handleSignUp} onNavigate={(page) => handleNavigate(page)} />;
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
                onAddToCart={handleAddToCart}
              />
            </div>
            <CategoryGrid
              title="Shop By Category"
              categories={mainCategories}
              gridClasses="grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto"
            />
            <RecommendationEngine />
          </>
        );
    }
  };

  return (
    <div className="bg-black min-h-screen font-sans pb-16 overflow-x-hidden">
      <Header 
        onNavigate={handleNavigate} 
        cartItemCount={cartItemCount}
        wishlistCount={wishlist.length}
        onSearchSubmit={handleSearchSubmit}
        currentUser={currentUser}
      />
      <main className="pt-20">
        <Suspense fallback={<LoadingSpinner />}>
          {renderContent()}
        </Suspense>
      </main>
      <Footer onNavigate={handleNavigate} />
      {confirmationMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-md shadow-lg animate-fade-in z-50 flex items-center gap-3">
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
            <p className="font-medium">{confirmationMessage}</p>
        </div>
      )}
      <BottomNavBar onNavigate={handleNavigate} activePage={view.page} />
      <ChatBot />
    </div>
  );
};

export default App;
