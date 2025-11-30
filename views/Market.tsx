
import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Briefcase, Search, Star, ListFilter, RefreshCw, X, Filter, LayoutGrid } from 'lucide-react';
import { UserStats, Stock } from '../types';
import confetti from 'canvas-confetti';

interface MarketProps {
  userStats: UserStats;
  updateStats: (newStats: Partial<UserStats>) => void;
}

// Helper to generate initial history so charts aren't empty on load
const generateInitialHistory = (basePrice: number) => {
  const history = [];
  let price = basePrice;
  for (let i = 0; i < 20; i++) {
    // Generate simulated past data
    price = price * (1 - (Math.random() - 0.5) * 0.02);
    history.push({ 
      time: `${i}:00`, 
      price: price 
    });
  }
  return history;
};

// Full List of Stocks
const INITIAL_STOCKS: Stock[] = [
  // Major Real World Tech (Requested)
  { symbol: 'MSFT', name: 'Microsoft Corp', price: 415.50, change: 1.2, history: generateInitialHistory(415.50), category: 'Tech' },
  { symbol: 'TSLA', name: 'Tesla Inc', price: 198.40, change: -2.1, history: generateInitialHistory(198.40), category: 'Auto' },
  { symbol: 'T', name: 'AT&T Inc', price: 17.20, change: 0.5, history: generateInitialHistory(17.20), category: 'Telecom' },

  // Tech & Innovation
  { symbol: 'TCH', name: 'TechVision Inc', price: 145.20, change: 2.4, history: generateInitialHistory(145.20), category: 'Tech' },
  { symbol: 'AIX', name: 'Artificial Minds', price: 175.60, change: 3.2, history: generateInitialHistory(175.60), category: 'Tech' },
  { symbol: 'CYB', name: 'CyberShield', price: 120.30, change: 1.5, history: generateInitialHistory(120.30), category: 'Tech' },
  { symbol: 'CHP', name: 'MicroChip Inc', price: 340.10, change: 2.1, history: generateInitialHistory(340.10), category: 'Tech' },
  { symbol: 'SFT', name: 'Cloud Soft', price: 180.90, change: 1.8, history: generateInitialHistory(180.90), category: 'Tech' },
  { symbol: 'QTM', name: 'Quantum Core', price: 512.40, change: 4.1, history: generateInitialHistory(512.40), category: 'Tech' },
  { symbol: 'RBT', name: 'Robo Dynamics', price: 88.20, change: -0.5, history: generateInitialHistory(88.20), category: 'Tech' },

  // Energy & Utilities
  { symbol: 'GRN', name: 'GreenEnergy Corp', price: 89.50, change: -1.2, history: generateInitialHistory(89.50), category: 'Energy' },
  { symbol: 'SLR', name: 'SolarGrid Systems', price: 42.10, change: -0.5, history: generateInitialHistory(42.10), category: 'Energy' },
  { symbol: 'UTL', name: 'Urban Utilities', price: 55.75, change: 0.2, history: generateInitialHistory(55.75), category: 'Utilities' },
  { symbol: 'CLN', name: 'Pure Water', price: 42.80, change: 0.9, history: generateInitialHistory(42.80), category: 'Utilities' },
  { symbol: 'NUC', name: 'Fusion Power', price: 102.30, change: 0.8, history: generateInitialHistory(102.30), category: 'Energy' },

  // Finance & Real Estate
  { symbol: 'FNS', name: 'FinSecure Bank', price: 45.30, change: 1.1, history: generateInitialHistory(45.30), category: 'Finance' },
  { symbol: 'REI', name: 'RealEstate Trust', price: 105.40, change: 0.1, history: generateInitialHistory(105.40), category: 'Real Estate' },
  { symbol: 'INS', name: 'SafeGuard Ins', price: 140.75, change: 0.2, history: generateInitialHistory(140.75), category: 'Finance' },
  { symbol: 'CON', name: 'BuildIt Corp', price: 95.20, change: 0.6, history: generateInitialHistory(95.20), category: 'Real Estate' },

  // Health & Pharma
  { symbol: 'BIO', name: 'BioHealth Sys', price: 210.75, change: 0.8, history: generateInitialHistory(210.75), category: 'Health' },
  { symbol: 'MED', name: 'MediCare Plus', price: 156.80, change: -0.3, history: generateInitialHistory(156.80), category: 'Health' },
  { symbol: 'PHR', name: 'PharmaGiant', price: 165.20, change: -0.4, history: generateInitialHistory(165.20), category: 'Health' },
  { symbol: 'GEN', name: 'Gene Therapies', price: 88.90, change: 2.5, history: generateInitialHistory(88.90), category: 'Health' },

  // Consumer & Retail
  { symbol: 'RET', name: 'Global Retail', price: 67.80, change: 0.2, history: generateInitialHistory(67.80), category: 'Consumer' },
  { symbol: 'FOD', name: 'FastFood Chain', price: 34.20, change: -1.1, history: generateInitialHistory(34.20), category: 'Consumer' },
  { symbol: 'ECM', name: 'ShopEasy', price: 210.30, change: 1.2, history: generateInitialHistory(210.30), category: 'Consumer' },
  { symbol: 'LUX', name: 'Luxe Brand', price: 560.00, change: -0.5, history: generateInitialHistory(560.00), category: 'Consumer' },
  { symbol: 'FSH', name: 'TrendWear', price: 55.30, change: 1.1, history: generateInitialHistory(55.30), category: 'Consumer' },
  { symbol: 'BEV', name: 'Fizz Beverages', price: 72.10, change: 0.5, history: generateInitialHistory(72.10), category: 'Consumer' },
  { symbol: 'GME', name: 'GameVerse', price: 45.20, change: 4.5, history: generateInitialHistory(45.20), category: 'Consumer' },

  // Transport & Auto
  { symbol: 'ATF', name: 'AutoFuture Motors', price: 320.10, change: -3.5, history: generateInitialHistory(320.10), category: 'Auto' },
  { symbol: 'EVX', name: 'Electric Volts', price: 88.90, change: 1.8, history: generateInitialHistory(88.90), category: 'Auto' },
  { symbol: 'AIR', name: 'SkyHigh Airlines', price: 120.50, change: -0.8, history: generateInitialHistory(120.50), category: 'Travel' },
  { symbol: 'SHP', name: 'Ocean Freight', price: 32.50, change: -1.5, history: generateInitialHistory(32.50), category: 'Logistics' },
  { symbol: 'LOG', name: 'Global Logistics', price: 112.40, change: 0.7, history: generateInitialHistory(112.40), category: 'Logistics' },

  // Commodities & Others
  { symbol: 'CRY', name: 'CryptoCoin X', price: 2300.50, change: 5.2, history: generateInitialHistory(2300.50), category: 'Crypto' },
  { symbol: 'GLD', name: 'Gold Reserve', price: 1850.00, change: 0.4, history: generateInitialHistory(1850.00), category: 'Commodity' },
  { symbol: 'OIL', name: 'Global Oil', price: 78.40, change: 0.5, history: generateInitialHistory(78.40), category: 'Commodity' },
  { symbol: 'MIN', name: 'Rare Earth Mining', price: 28.40, change: -2.3, history: generateInitialHistory(28.40), category: 'Commodity' },
  { symbol: 'TEL', name: 'Connect Telecom', price: 65.40, change: 0.3, history: generateInitialHistory(65.40), category: 'Telecom' },
  { symbol: 'SPC', name: 'Orbit Tech', price: 450.60, change: 5.4, history: generateInitialHistory(450.60), category: 'Space' },
  { symbol: 'STM', name: 'StreamLine Media', price: 18.90, change: -3.2, history: generateInitialHistory(18.90), category: 'Media' },
  
  // Agriculture & Defense (NEW)
  { symbol: 'AGR', name: 'AgriCorp Global', price: 44.20, change: 0.5, history: generateInitialHistory(44.20), category: 'Agri' },
  { symbol: 'DEF', name: 'Shield Defense', price: 210.00, change: 1.4, history: generateInitialHistory(210.00), category: 'Defense' },
  { symbol: 'EDU', name: 'EduLearn Systems', price: 35.60, change: -0.2, history: generateInitialHistory(35.60), category: 'Education' },
];

const Market: React.FC<MarketProps> = ({ userStats, updateStats }) => {
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string>('MSFT'); // Default to Microsoft
  const [tradeQuantity, setTradeQuantity] = useState<string>('');
  const [tradeTab, setTradeTab] = useState<'BUY' | 'SELL'>('BUY');
  const [notification, setNotification] = useState<string | null>(null);
  
  // Watchlist & UI State
  const [activeListTab, setActiveListTab] = useState<'ALL' | 'WATCHLIST'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedStock = useMemo(() => 
    stocks.find(s => s.symbol === selectedStockSymbol) || stocks[0], 
  [stocks, selectedStockSymbol]);

  // CATEGORIES for Filter
  const categories = useMemo(() => {
    const cats = Array.from(new Set(stocks.map(s => s.category)));
    return ['All', ...cats.sort()];
  }, [stocks]);

  // Self-Healing Effect: If we detect missing stocks (e.g. state stuck on old version), force reset
  useEffect(() => {
    if (stocks.length < INITIAL_STOCKS.length) {
      console.log("Healing Stock List: Merging new stocks into simulation");
      setStocks(prev => {
        const existingSymbols = new Set(prev.map(s => s.symbol));
        const missingStocks = INITIAL_STOCKS.filter(s => !existingSymbols.has(s.symbol));
        return [...prev, ...missingStocks];
      });
    }
  }, [stocks.length]);

  // Market Simulation Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(currentStocks => 
        currentStocks.map(stock => {
          const volatility = 0.008; // 0.8% max fluctuation
          const changePercent = (Math.random() - 0.5) * 2 * volatility;
          const newPrice = Math.max(0.1, stock.price * (1 + changePercent));
          
          const newHistory = [...stock.history, { 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute:'2-digit', second:'2-digit' }), 
            price: newPrice 
          }].slice(-30); // Keep last 30 points

          return {
            ...stock,
            price: newPrice,
            change: stock.change + (changePercent * 100), // Accumulate change roughly
            history: newHistory
          };
        })
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleTrade = () => {
    const qty = parseInt(tradeQuantity);
    if (isNaN(qty) || qty <= 0) {
      showNotification("Please enter a valid quantity", "error");
      return;
    }

    const totalCost = qty * selectedStock.price;

    if (tradeTab === 'BUY') {
      if (userStats.walletBalance < totalCost) {
        showNotification("Insufficient funds!", "error");
        return;
      }

      // Update Holdings
      const newHoldings = [...userStats.holdings];
      const existingItem = newHoldings.find(h => h.symbol === selectedStock.symbol);

      if (existingItem) {
        // Update average price
        const totalValue = (existingItem.quantity * existingItem.avgPrice) + totalCost;
        const totalQty = existingItem.quantity + qty;
        existingItem.quantity = totalQty;
        existingItem.avgPrice = totalValue / totalQty;
      } else {
        newHoldings.push({
          symbol: selectedStock.symbol,
          quantity: qty,
          avgPrice: selectedStock.price
        });
      }

      updateStats({
        walletBalance: userStats.walletBalance - totalCost,
        holdings: newHoldings
      });

      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      showNotification(`Successfully bought ${qty} ${selectedStock.symbol}`, "success");

    } else {
      // SELL Logic
      const existingItem = userStats.holdings.find(h => h.symbol === selectedStock.symbol);
      
      if (!existingItem || existingItem.quantity < qty) {
        showNotification("Insufficient holdings to sell", "error");
        return;
      }

      existingItem.quantity -= qty;
      
      // Remove if 0
      const newHoldings = existingItem.quantity === 0 
        ? userStats.holdings.filter(h => h.symbol !== selectedStock.symbol)
        : [...userStats.holdings];

      updateStats({
        walletBalance: userStats.walletBalance + totalCost,
        holdings: newHoldings
      });

      showNotification(`Sold ${qty} ${selectedStock.symbol}`, "success");
    }

    setTradeQuantity('');
  };

  const showNotification = (msg: string, type: 'success' | 'error') => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleWatchlist = (e: React.MouseEvent, symbol: string) => {
    e.stopPropagation();
    // Default to empty array if userStats.watchlist is undefined (safeguard)
    const currentWatchlist = userStats.watchlist || [];
    const isInWatchlist = currentWatchlist.includes(symbol);
    
    let newWatchlist;
    if (isInWatchlist) {
      newWatchlist = currentWatchlist.filter(s => s !== symbol);
      showNotification(`${symbol} removed from watchlist`, 'success');
    } else {
      newWatchlist = [...currentWatchlist, symbol];
      showNotification(`${symbol} added to watchlist`, 'success');
    }
    
    updateStats({ watchlist: newWatchlist });
  };

  const resetSimulation = () => {
    setStocks(INITIAL_STOCKS);
    showNotification("Market simulation reset to defaults", "success");
  };

  const portfolioValue = useMemo(() => {
    return userStats.holdings.reduce((acc, curr) => {
      const currentPrice = stocks.find(s => s.symbol === curr.symbol)?.price || 0;
      return acc + (curr.quantity * currentPrice);
    }, 0);
  }, [userStats.holdings, stocks]);

  const totalNetWorth = userStats.walletBalance + portfolioValue;

  // Filter stocks based on tab and search
  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          stock.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || stock.category === selectedCategory;
    
    if (activeListTab === 'WATCHLIST') {
      const watchlist = userStats.watchlist || [];
      return matchesSearch && watchlist.includes(stock.symbol);
    }
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      {/* Header Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-heading font-extrabold text-slate-900 mb-2">Market</h1>
          <p className="text-slate-500 text-lg">Trade simulation with virtual currency.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          <button 
            onClick={resetSimulation}
            className="p-2.5 rounded-xl bg-white text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-colors border border-slate-200 shadow-sm flex items-center gap-2 px-4"
            title="Reload Defaults"
          >
            <RefreshCw size={18} /> <span className="text-xs font-bold uppercase hidden sm:inline">Reset</span>
          </button>

          <div className="glass-card px-6 py-3 rounded-2xl border border-white/60 shadow-sm flex items-center gap-3 bg-white/50">
             <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
               <Wallet size={20} />
             </div>
             <div>
               <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Cash Balance</p>
               <p className="text-xl font-bold font-heading text-slate-900">${userStats.walletBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
             </div>
          </div>
          <div className="glass-card px-6 py-3 rounded-2xl border border-white/60 shadow-sm flex items-center gap-3 bg-white/50">
             <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
               <Briefcase size={20} />
             </div>
             <div>
               <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Net Worth</p>
               <p className="text-xl font-bold font-heading text-slate-900">${totalNetWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-250px)] min-h-[600px]">
        {/* Left: Watchlist & Asset List */}
        <div className="lg:col-span-3 glass-card rounded-[2rem] border border-white/60 overflow-hidden flex flex-col bg-white/40 shadow-xl">
           
           {/* Tab Switcher */}
           <div className="p-4 border-b border-slate-100/50 bg-white/30">
             <div className="flex bg-slate-100/80 p-1 rounded-xl mb-3">
                <button
                   onClick={() => { setActiveListTab('ALL'); setSelectedCategory('All'); }}
                   className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeListTab === 'ALL' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                   <LayoutGrid size={14}/> All Assets
                </button>
                <button
                   onClick={() => setActiveListTab('WATCHLIST')}
                   className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeListTab === 'WATCHLIST' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                   <Star size={14} /> Watchlist
                </button>
             </div>

             {/* Category Chips (Only on All Tab) */}
             {activeListTab === 'ALL' && (
                <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide snap-x">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide whitespace-nowrap snap-start transition-colors ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
             )}
           </div>

           <div className="p-4 pt-2 border-b border-slate-100/50">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search by name or symbol..." 
                 className="w-full bg-white/80 border border-slate-200 rounded-xl pl-9 pr-8 py-3 text-sm focus:outline-none focus:border-indigo-300 transition-colors font-medium shadow-sm"
               />
               {searchQuery && (
                 <button 
                   onClick={() => setSearchQuery('')}
                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                 >
                   <X size={14} />
                 </button>
               )}
             </div>
           </div>

           <div className="flex items-center justify-between px-4 py-2 bg-slate-50/50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
               <span>Asset</span>
               <span>Price / 24h</span>
           </div>

           <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
             {filteredStocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-center p-4">
                    <ListFilter size={24} className="mb-2 opacity-50" />
                    <p className="text-sm font-medium">
                      {activeListTab === 'WATCHLIST' ? 'Your Watchlist is empty.' : 'No assets found.'}
                    </p>
                    {activeListTab === 'WATCHLIST' ? (
                       <button 
                         onClick={() => setActiveListTab('ALL')}
                         className="text-xs text-indigo-600 font-bold mt-2 hover:underline"
                       >
                         Browse All Assets to Add
                       </button>
                    ) : (
                        <button 
                         onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
                         className="text-xs text-indigo-600 font-bold mt-2 hover:underline"
                       >
                         Clear Filters
                       </button>
                    )}
                </div>
             ) : (
                filteredStocks.map(stock => {
                  const isWatched = (userStats.watchlist || []).includes(stock.symbol);
                  return (
                    <div 
                      key={stock.symbol}
                      onClick={() => setSelectedStockSymbol(stock.symbol)}
                      className={`
                        p-3 rounded-2xl cursor-pointer transition-all border group relative
                        ${selectedStockSymbol === stock.symbol 
                          ? 'bg-white border-indigo-200 shadow-md ring-1 ring-indigo-50' 
                          : 'bg-white/40 border-transparent hover:bg-white/80 hover:border-slate-100 hover:shadow-sm'
                        }
                      `}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${['Tech', 'Crypto', 'Space'].includes(stock.category) ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                                {stock.symbol[0]}
                            </div>
                            <div>
                                <span className="font-bold text-slate-900 block text-sm">{stock.symbol}</span>
                                <span className="text-[10px] text-slate-500 font-medium">{stock.name}</span>
                            </div>
                        </div>
                        
                        <div className="text-right">
                            <div className="font-heading font-bold text-slate-800 text-sm">${stock.price.toFixed(2)}</div>
                            <div className={`flex items-center justify-end gap-1 text-[10px] font-bold ${stock.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                            </div>
                        </div>
                      </div>
                      
                      {/* Watchlist Toggle */}
                      <button 
                        onClick={(e) => toggleWatchlist(e, stock.symbol)}
                        className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-full transition-all z-10 ${isWatched ? 'opacity-100 text-amber-400 bg-amber-50 shadow-sm' : 'text-slate-300 hover:text-amber-400 hover:bg-white'}`}
                      >
                         <Star size={12} fill={isWatched ? "currentColor" : "none"} />
                      </button>
                    </div>
                  );
                })
             )}
           </div>
           
           <div className="p-2 text-center text-[10px] text-slate-400 font-medium border-t border-slate-100">
               Viewing {filteredStocks.length} Assets
           </div>
        </div>

        {/* Middle: Charts & Details */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-[2rem] border border-white/60 flex-1 flex flex-col shadow-xl bg-white/40">
             <div className="flex justify-between items-start mb-8">
               <div className="flex gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg text-white ${['Crypto', 'Tech', 'Gaming', 'Space'].includes(selectedStock.category) ? 'bg-indigo-600' : 'bg-slate-900'}`}>
                    {selectedStock.symbol}
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-slate-900">{selectedStock.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 text-xs font-bold uppercase">{selectedStock.category}</span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/> MARKET OPEN</span>
                    </div>
                  </div>
               </div>
               <div className="text-right">
                 <p className="text-4xl font-heading font-extrabold text-slate-900">${selectedStock.price.toFixed(2)}</p>
                 <p className={`text-sm font-bold flex items-center justify-end gap-1 ${selectedStock.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                   {selectedStock.change >= 0 ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                   {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)}% Today
                 </p>
               </div>
             </div>

             <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedStock.history}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={selectedStock.change >= 0 ? '#10b981' : '#f43f5e'} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={selectedStock.change >= 0 ? '#10b981' : '#f43f5e'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="time" hide />
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontFamily: 'Outfit' }}
                      formatter={(val: number) => [`$${val.toFixed(2)}`, 'Price']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke={selectedStock.change >= 0 ? '#10b981' : '#f43f5e'} 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Right: Trading & Portfolio */}
        <div className="lg:col-span-3 flex flex-col gap-6">
           {/* Trading Panel */}
           <div className="glass-card p-6 rounded-[2rem] border border-white/60 bg-white/60 shadow-lg">
             <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
               <button 
                 onClick={() => setTradeTab('BUY')}
                 className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${tradeTab === 'BUY' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 Buy
               </button>
               <button 
                 onClick={() => setTradeTab('SELL')}
                 className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${tradeTab === 'SELL' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 Sell
               </button>
             </div>

             <div className="space-y-4">
               <div>
                 <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                    <span>QUANTITY</span>
                    <span>Max: {tradeTab === 'BUY' ? Math.floor(userStats.walletBalance / selectedStock.price) : userStats.holdings.find(h => h.symbol === selectedStock.symbol)?.quantity || 0}</span>
                 </div>
                 <div className="relative">
                    <input 
                      type="number" 
                      value={tradeQuantity}
                      onChange={(e) => setTradeQuantity(e.target.value)}
                      placeholder="0"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-heading font-bold text-xl focus:outline-none focus:border-indigo-300"
                    />
                 </div>
               </div>

               <div className="flex justify-between items-center py-4 border-t border-slate-200 border-dashed">
                 <span className="text-sm font-medium text-slate-500">Total Value</span>
                 <span className="text-xl font-heading font-bold text-slate-900">
                   ${((parseInt(tradeQuantity) || 0) * selectedStock.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                 </span>
               </div>

               <button 
                 onClick={handleTrade}
                 className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-transform hover:-translate-y-1 active:translate-y-0
                   ${tradeTab === 'BUY' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'}
                 `}
               >
                 {tradeTab} {selectedStock.symbol}
               </button>

               {notification && (
                 <div className={`text-center text-xs font-bold p-2 rounded-lg animate-in fade-in ${notification.includes('error') ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                   {notification}
                 </div>
               )}
             </div>
           </div>

           {/* Quick Portfolio View */}
           <div className="flex-1 glass-card p-6 rounded-[2rem] border border-white/60 bg-white/40 overflow-y-auto custom-scrollbar">
             <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-4">Your Positions</h3>
             <div className="space-y-3">
               {userStats.holdings.length === 0 ? (
                 <p className="text-sm text-slate-400 text-center py-4">No open positions.</p>
               ) : (
                 userStats.holdings.map((h) => {
                   const currPrice = stocks.find(s => s.symbol === h.symbol)?.price || h.avgPrice;
                   const gain = (currPrice - h.avgPrice) * h.quantity;
                   
                   return (
                     <div key={h.symbol} className="flex justify-between items-center p-3 bg-white/60 rounded-xl border border-slate-100">
                       <div>
                         <p className="font-bold text-slate-900">{h.symbol}</p>
                         <p className="text-xs text-slate-500">{h.quantity} shares</p>
                       </div>
                       <div className="text-right">
                         <p className="font-bold text-slate-800">${(h.quantity * currPrice).toFixed(0)}</p>
                         <p className={`text-xs font-bold ${gain >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                           {gain >= 0 ? '+' : ''}{gain.toFixed(2)}
                         </p>
                       </div>
                     </div>
                   );
                 })
               )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Market;
