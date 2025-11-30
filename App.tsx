import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import Calculators from './views/Calculators';
import Quiz from './views/Quiz';
import Learn from './views/Learn';
import Advisor from './views/Advisor';
import Market from './views/Market';
import AuthModal from './components/AuthModal';
import { ViewState, UserStats } from './types';
import { Menu } from 'lucide-react';
import { supabase } from './services/supabaseClient';
import { Session } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Centralized User State
  const [userStats, setUserStats] = useState<UserStats>({
    xp: 850,
    lessonsCompleted: 3,
    quizScore: 0,
    walletBalance: 10000,
    holdings: [],
    watchlist: ['TCH', 'BIO', 'AIX', 'GRN'],
    completedChapterIds: []
  });

  // 1. Check for active session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
          // Reset to defaults on logout
          setUserStats({
            xp: 850,
            lessonsCompleted: 3,
            quizScore: 0,
            walletBalance: 10000,
            holdings: [],
            watchlist: ['TCH', 'BIO', 'AIX', 'GRN'],
            completedChapterIds: []
          });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch User Profile from Supabase
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
          console.warn('Could not fetch profile (Table might not exist yet). Using local state.');
          return;
      }

      if (data) {
        setUserStats({
          xp: data.xp || 850,
          lessonsCompleted: data.lessons_completed || 3,
          quizScore: data.quiz_score || 0,
          walletBalance: data.wallet_balance !== null ? data.wallet_balance : 10000,
          holdings: data.holdings || [],
          watchlist: data.watchlist || ['TCH', 'BIO', 'AIX', 'GRN'],
          completedChapterIds: data.completed_chapter_ids || []
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // 3. Debounced Save to Supabase
  useEffect(() => {
    if (!session) return;

    const saveData = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('user_profiles')
          .upsert({
            id: session.user.id,
            xp: userStats.xp,
            lessons_completed: userStats.lessonsCompleted,
            quiz_score: userStats.quizScore,
            wallet_balance: userStats.walletBalance,
            holdings: userStats.holdings,
            watchlist: userStats.watchlist,
            completed_chapter_ids: userStats.completedChapterIds,
            updated_at: new Date()
          });

        if (error) {
             // Silent fail if table doesn't exist to prevent spamming console
             // console.warn('Sync failed:', error.message);
        }
      } catch (err) {
        // Ignore
      }
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(saveData);
  }, [userStats, session]);


  // Ensure userStats has required fields (patch for stale state)
  useEffect(() => {
    setUserStats(prev => {
      const updates: Partial<UserStats> = {};
      if (!prev.watchlist) updates.watchlist = ['TCH', 'BIO', 'AIX', 'GRN'];
      if (prev.walletBalance === undefined) updates.walletBalance = 10000;
      if (!prev.holdings) updates.holdings = [];
      if (!prev.completedChapterIds) updates.completedChapterIds = [];
      
      if (Object.keys(updates).length > 0) {
        return { ...prev, ...updates };
      }
      return prev;
    });
  }, []);

  const updateStats = (newStats: Partial<UserStats>) => {
    setUserStats(prev => ({ ...prev, ...newStats }));
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} userStats={userStats} />;
      case ViewState.CALCULATORS:
        return <Calculators />;
      case ViewState.QUIZ:
        return <Quiz />;
      case ViewState.LEARN:
        return <Learn userStats={userStats} updateStats={updateStats} />;
      case ViewState.ADVISOR:
        return <Advisor />;
      case ViewState.MARKET:
        return <Market key="market-final-fix" userStats={userStats} updateStats={updateStats} />;
      default:
        return <Dashboard onNavigate={setCurrentView} userStats={userStats} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative selection:bg-violet-200 selection:text-violet-900">
      {/* Decorative Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-[20%] right-[20%] w-[300px] h-[300px] bg-teal-100/40 rounded-full blur-[80px] pointer-events-none" />

      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        session={session}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        {/* Mobile Header */}
        <div className="md:hidden bg-white/80 backdrop-blur-md p-4 flex items-center justify-between border-b border-slate-200/50 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-indigo-900 font-heading font-bold text-xl">
             Denari
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 hover:text-indigo-600 transition-colors">
            <Menu size={24} />
          </button>
        </div>

        {/* Main Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto pb-10">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;