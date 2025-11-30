import React from 'react';
import { TrendingUp, DollarSign, Award, ArrowRight, Zap, Target, BookOpen } from 'lucide-react';
import { ViewState, UserStats } from '../types';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
  userStats: UserStats;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, userStats }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading font-extrabold text-slate-900 mb-2 tracking-tight">
            Hello, Future Tycoon! 🚀
          </h1>
          <p className="text-slate-500 text-lg">Your path to financial freedom starts here.</p>
        </div>
        <div className="bg-white/60 backdrop-blur-md px-5 py-2 rounded-full border border-white/50 shadow-sm flex items-center gap-2 text-indigo-900 font-semibold">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Market is Open
        </div>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={80} className="text-amber-500" />
          </div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner">
              <Award size={28} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Total XP</p>
              <p className="text-3xl font-heading font-bold text-slate-900">{userStats.xp}</p>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
              style={{ width: `${Math.min(100, (userStats.xp / 5000) * 100)}%` }} 
            />
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">Top 5% of learners this week</p>
        </div>

        {/* Stat Card 2 */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BookOpen size={80} className="text-violet-500" />
          </div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center text-violet-600 shadow-inner">
              <Target size={28} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Lessons</p>
              <p className="text-3xl font-heading font-bold text-slate-900">{userStats.lessonsCompleted}</p>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-violet-400 to-purple-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(139,92,246,0.5)]" 
              style={{ width: `${Math.min(100, (userStats.lessonsCompleted / 50) * 100)}%` }} 
            />
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">3 Modules in progress</p>
        </div>

        {/* Stat Card 3 */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={80} className="text-emerald-500" />
          </div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
              <DollarSign size={28} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Quiz Score</p>
              <p className="text-3xl font-heading font-bold text-slate-900">{userStats.quizScore}</p>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
              style={{ width: `${Math.min(100, (userStats.quizScore / 200) * 100)}%` }} 
            />
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">Accuracy rate: 92%</p>
        </div>
      </div>

      {/* Featured Hero Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div 
          onClick={() => onNavigate(ViewState.CALCULATORS)}
          className="relative rounded-[2rem] p-10 overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl shadow-xl shadow-indigo-900/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-800" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity" />
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white mb-6 border border-white/20">
                <TrendingUp size={24} />
              </div>
              <h2 className="text-3xl font-heading font-bold text-white mb-3">Project Wealth</h2>
              <p className="text-indigo-100 text-lg max-w-md leading-relaxed">
                Visualize your financial future. Use our pro-grade calculators to plan SIPs, Loans, and Investments.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3 text-white font-semibold group-hover:gap-5 transition-all">
              Launch Simulator <ArrowRight size={20} />
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigate(ViewState.ADVISOR)}
          className="relative rounded-[2rem] p-10 overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl shadow-xl shadow-slate-200"
        >
          <div className="absolute inset-0 bg-white" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-100 rounded-full blur-[60px] opacity-60" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full blur-[60px] opacity-60" />
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-slate-300">
                <Zap size={24} fill="currentColor" className="text-yellow-400" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-slate-900 mb-3">Ask FinBot AI</h2>
              <p className="text-slate-600 text-lg max-w-md leading-relaxed">
                Your 24/7 financial genius. Get instant answers to complex money questions in plain English.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3 text-slate-900 font-semibold group-hover:gap-5 transition-all">
              Start Conversation <ArrowRight size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Learning */}
      <div className="glass-card rounded-[2rem] p-8 border border-white/60">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-heading font-bold text-slate-900">Trending Courses</h3>
            <p className="text-slate-500">Curated based on current market trends</p>
          </div>
          <button onClick={() => onNavigate(ViewState.LEARN)} className="text-sm text-indigo-600 font-bold hover:text-indigo-700 px-4 py-2 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors">View Library</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { title: 'The Crypto Revolution', icon: '₿', color: 'bg-orange-100 text-orange-600' },
            { title: 'Mastering ETFs', icon: '📊', color: 'bg-emerald-100 text-emerald-600' },
            { title: 'Tax Saving Hacks', icon: '🛡️', color: 'bg-blue-100 text-blue-600' }
          ].map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50 transition-all cursor-pointer group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent to-slate-50 rounded-bl-full -mr-4 -mt-4" />
              <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h4 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-indigo-700 transition-colors">{item.title}</h4>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-semibold bg-slate-100 px-2 py-1 rounded text-slate-500">Intermediate</span>
                <span className="text-xs text-slate-400">10 min read</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;