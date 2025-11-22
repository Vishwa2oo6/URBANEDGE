
import React, { useState } from 'react';
import { User, Order, OrderStatus } from '../types';
import { UserIcon, ClipboardListIcon, HeartIcon, CogIcon, PencilIcon, CheckIcon, XIcon, PackageIcon } from './icons';

interface AccountProps {
  user: User;
  orders: Order[];
  wishlistCount: number;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
  onNavigate: (path: string) => void;
}

type Tab = 'dashboard' | 'orders' | 'profile';

const getStatusStyles = (status: OrderStatus) => {
    switch (status) {
        case 'Delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'Shipped': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'Out for Delivery': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'Processing':
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
};

const Account: React.FC<AccountProps> = ({ user, orders, wishlistCount, onLogout, onUpdateUser, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleSaveChanges = () => {
        onUpdateUser({ ...user, name });
        setIsEditing(false);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardView user={user} orders={orders} wishlistCount={wishlistCount} onNavigate={onNavigate} setActiveTab={setActiveTab} />;
            case 'orders':
                return <OrderHistoryView orders={orders} />;
            case 'profile':
                return (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">Profile Details</h2>
                            <div className="bg-gray-900 border border-gray-800 p-6 space-y-4">
                                {isEditing ? (
                                    <div className="flex items-end gap-4">
                                        <div className="flex-grow">
                                            <label className="text-sm text-gray-400">Full Name</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={handleNameChange}
                                                className="w-full bg-gray-800 border-gray-700 text-white p-2 mt-1 focus:ring-white focus:border-white"
                                            />
                                        </div>
                                        <button onClick={handleSaveChanges} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md"><CheckIcon className="w-5 h-5"/></button>
                                        <button onClick={() => { setIsEditing(false); setName(user.name); }} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"><XIcon className="w-5 h-5"/></button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-400">Full Name</p>
                                            <p className="text-lg text-white">{user.name}</p>
                                        </div>
                                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
                                            <PencilIcon className="w-4 h-4" /> Edit
                                        </button>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-400">Email Address</p>
                                    <p className="text-lg text-white">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Member Since</p>
                                    <p className="text-lg text-white">{user.memberSince}</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={onLogout} className="w-full py-3 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200 font-bold">
                            Logout
                        </button>
                    </div>
                );
        }
    };
    
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-12">
                <aside className="md:w-1/4">
                    <div className="bg-gray-900 border border-gray-800 p-4 sticky top-28">
                        <div className="flex items-center gap-4 mb-6 p-2">
                           <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center">
                                <span className="text-2xl font-bold">{user.name.charAt(0)}</span>
                           </div>
                           <div>
                                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                                <p className="text-sm text-gray-400">Customer</p>
                           </div>
                        </div>
                        <nav className="space-y-2">
                            <TabButton icon={<UserIcon />} label="Dashboard" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                            <TabButton icon={<ClipboardListIcon />} label="Order History" isActive={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
                            <TabButton icon={<UserIcon />} label="Profile Details" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                            <TabButton icon={<CogIcon />} label="Settings" isActive={false} onClick={() => {}} disabled={true} />
                        </nav>
                    </div>
                </aside>
                <main className="flex-1">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

const TabButton: React.FC<{ icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void, disabled?: boolean }> = ({ icon, label, isActive, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full flex items-center gap-3 p-3 text-left rounded-md transition-colors duration-200 ${
            isActive ? 'bg-white text-black' : 'text-gray-300 hover:bg-gray-800'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {icon}
        <span className="font-medium">{label}</span>
    </button>
);

const DashboardView: React.FC<{ user: User, orders: Order[], wishlistCount: number, onNavigate: (path: string) => void, setActiveTab: (tab: Tab) => void }> = ({ user, orders, wishlistCount, onNavigate, setActiveTab }) => {
    const latestOrder = orders.length > 0 ? orders[0] : null;

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user.name.split(' ')[0]}!</h1>
            <p className="text-gray-400 mb-8">Here's a quick overview of your account.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                 <StatCard title="Total Orders" value={orders.length.toString()} icon={<ClipboardListIcon />} />
                 <StatCard title="Items in Wishlist" value={wishlistCount.toString()} icon={<HeartIcon />} />
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ActionCard title="Track Your Last Order" onClick={() => onNavigate('order-tracking')} disabled={!latestOrder} />
                    <ActionCard title="View Your Wishlist" onClick={() => onNavigate('wishlist')} />
                    <ActionCard title="Update Your Profile" onClick={() => setActiveTab('profile')} />
                </div>
            </div>

             {latestOrder && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Most Recent Order</h2>
                    <div className="bg-gray-900 border border-gray-800 p-6">
                        <div className="flex justify-between items-start">
                             <div>
                                <p className="text-sm text-gray-400">Order #{latestOrder.id}</p>
                                <p className="text-lg font-bold text-white">₹{latestOrder.total.toFixed(2)}</p>
                            </div>
                            <div className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getStatusStyles(latestOrder.status)}`}>
                                {latestOrder.status}
                            </div>
                        </div>
                        <div className="flex -space-x-4 mt-4">
                            {latestOrder.items.slice(0, 5).map(item => (
                                <img key={item.id} src={item.imageUrls[0]} alt={item.name} className="w-12 h-12 rounded-full object-cover border-2 border-gray-800"/>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// FIX: Changed icon prop type from React.ReactNode to React.ReactElement to fix cloneElement error.
const StatCard: React.FC<{title: string, value: string, icon: React.ReactElement<{ className?: string, filled?: boolean }>}> = ({ title, value, icon }) => (
    <div className="bg-gray-900 border border-gray-800 p-6 flex items-center gap-6">
        <div className="bg-gray-800 p-3 rounded-md">
            {React.cloneElement(icon, { className: "w-8 h-8 text-white" })}
        </div>
        <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const ActionCard: React.FC<{title: string, onClick: () => void, disabled?: boolean}> = ({ title, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="p-6 bg-gray-900 border border-gray-800 hover:border-white transition-colors duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
    >
        <h3 className="font-bold text-white">{title} &rarr;</h3>
    </button>
);


const OrderHistoryView: React.FC<{orders: Order[]}> = ({ orders }) => {
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-8">Order History</h1>
            <div className="space-y-4">
                {orders.length > 0 ? (
                    orders.map(order => (
                        <div key={order.id} className="bg-gray-900 border border-gray-800">
                             <button onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)} className="w-full p-4 text-left grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                                <span className="font-mono text-sm text-gray-400">#{order.id.split('-')[1]}</span>
                                <span className="text-sm text-white">{new Date(order.date).toLocaleDateString()}</span>
                                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full border text-center ${getStatusStyles(order.status)}`}>{order.status}</span>
                                <span className="text-right font-bold text-white">₹{order.total.toFixed(2)}</span>
                            </button>
                            {expandedOrder === order.id && (
                                <div className="p-6 border-t border-gray-800 animate-fade-in-down">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="font-bold text-white mb-4">Items:</h4>
                                            <ul className="space-y-4">
                                                {order.items.map(item => (
                                                    <li key={item.id} className="flex items-center gap-4 text-sm">
                                                        <img src={item.imageUrls[0]} alt={item.name} className="w-16 h-16 object-cover rounded-md"/>
                                                        <div className="flex-grow">
                                                            <p className="font-bold text-white">{item.name}</p>
                                                            <p className="text-gray-400">Qty: {item.quantity}</p>
                                                        </div>
                                                        <p className="font-semibold text-white">₹{(item.price * item.quantity).toFixed(2)}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white mb-4">Shipping Address:</h4>
                                            <div className="text-sm text-gray-300 space-y-1">
                                                <p className="font-semibold text-white">{order.shippingInfo.fullName}</p>
                                                <p>{order.shippingInfo.address}</p>
                                                <p>{order.shippingInfo.city}, {order.shippingInfo.postalCode}</p>
                                                <p>{order.shippingInfo.country}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 bg-gray-900 border border-dashed border-gray-700">
                        <PackageIcon className="w-16 h-16 mx-auto text-gray-600" />
                        <h3 className="mt-4 text-xl font-bold text-white">No Orders Yet</h3>
                        <p className="mt-2 text-gray-400">Looks like you haven't placed an order. Your next favorite outfit is waiting!</p>
                    </div>
                )}
            </div>
        </div>
    );
};


export default Account;
