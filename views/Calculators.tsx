import React, { useState, useEffect, useRef } from 'react';
import { 
  calculateSIP, 
  calculateLumpsum, 
  calculateEMI, 
  calculateFD, 
  calculateRD, 
  calculatePPF, 
  calculateInflation, 
  calculateGoal,
  calculateBudget,
  calculateSimpleInterest,
  calculateCompoundInterest
} from '../utils/calculations';
import { CalculationResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, PiggyBank, Landmark, Target, AlertTriangle, Briefcase, Coins, Wallet, Percent, PieChart as PieIcon } from 'lucide-react';

type CalculatorType = 'SIP' | 'LUMPSUM' | 'EMI' | 'FD' | 'RD' | 'PPF' | 'INFLATION' | 'GOAL' | 'BUDGET' | 'SIMPLE' | 'COMPOUND';

const Calculators: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorType>('SIP');
  
  // Inputs
  const [amount, setAmount] = useState(5000); // Principal / Monthly / Target / Income
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(5);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Configuration for each calculator type
  const config = {
    SIP: {
      label: 'SIP Calculator',
      icon: TrendingUp,
      inputs: { amount: 'Monthly Investment', rate: 'Expected Return (p.a)', years: 'Time Period (Years)' },
      defaults: { amount: 5000, rate: 12, years: 10 },
      calculate: calculateSIP,
      resultLabels: { invested: 'Invested Amount', interest: 'Est. Returns', total: 'Total Value' },
      colors: ['#6366f1', '#10b981'] // Indigo, Emerald
    },
    LUMPSUM: {
      label: 'Lumpsum',
      icon: Coins,
      inputs: { amount: 'Total Investment', rate: 'Expected Return (p.a)', years: 'Time Period (Years)' },
      defaults: { amount: 100000, rate: 12, years: 5 },
      calculate: calculateLumpsum,
      resultLabels: { invested: 'Invested Amount', interest: 'Est. Returns', total: 'Total Value' },
      colors: ['#6366f1', '#10b981']
    },
    EMI: {
      label: 'Loan EMI',
      icon: Landmark,
      inputs: { amount: 'Loan Amount', rate: 'Interest Rate (p.a)', years: 'Tenure (Years)' },
      defaults: { amount: 500000, rate: 9, years: 5 },
      calculate: calculateEMI,
      resultLabels: { invested: 'Principal Amount', interest: 'Total Interest', total: 'Total Payable' },
      colors: ['#6366f1', '#f43f5e'] // Indigo, Rose
    },
    FD: {
      label: 'Fixed Deposit',
      icon: Briefcase,
      inputs: { amount: 'Deposit Amount', rate: 'Interest Rate (p.a)', years: 'Time Period (Years)' },
      defaults: { amount: 100000, rate: 7.5, years: 5 },
      calculate: calculateFD,
      resultLabels: { invested: 'Deposit Amount', interest: 'Total Interest', total: 'Maturity Value' },
      colors: ['#6366f1', '#10b981']
    },
    RD: {
      label: 'Recurring Deposit',
      icon: PiggyBank,
      inputs: { amount: 'Monthly Deposit', rate: 'Interest Rate (p.a)', years: 'Time Period (Years)' },
      defaults: { amount: 5000, rate: 7, years: 5 },
      calculate: calculateRD,
      resultLabels: { invested: 'Total Deposited', interest: 'Total Interest', total: 'Maturity Value' },
      colors: ['#6366f1', '#10b981']
    },
    PPF: {
      label: 'PPF',
      icon: Landmark,
      inputs: { amount: 'Yearly Investment', rate: 'Interest Rate (p.a)', years: 'Time Period (Years)' },
      defaults: { amount: 100000, rate: 7.1, years: 15 },
      calculate: calculatePPF,
      resultLabels: { invested: 'Total Invested', interest: 'Total Interest', total: 'Maturity Value' },
      colors: ['#6366f1', '#10b981']
    },
    INFLATION: {
      label: 'Inflation',
      icon: AlertTriangle,
      inputs: { amount: 'Current Cost', rate: 'Inflation Rate (p.a)', years: 'Time Period (Years)' },
      defaults: { amount: 50000, rate: 6, years: 10 },
      calculate: calculateInflation,
      resultLabels: { invested: 'Current Cost', interest: 'Cost Increase', total: 'Future Cost' },
      colors: ['#64748b', '#f43f5e'] // Slate, Rose
    },
    GOAL: {
      label: 'Goal Planner',
      icon: Target,
      inputs: { amount: 'Target Amount', rate: 'Expected Return (p.a)', years: 'Time Period (Years)' },
      defaults: { amount: 1000000, rate: 12, years: 10 },
      calculate: calculateGoal,
      resultLabels: { invested: 'Total Investment', interest: 'Wealth Gained', total: 'Target Amount' },
      colors: ['#6366f1', '#10b981']
    },
    BUDGET: {
      label: '50/30/20 Rule',
      icon: Wallet,
      inputs: { amount: 'Monthly Income', rate: '', years: '' },
      defaults: { amount: 50000, rate: 0, years: 0 },
      calculate: calculateBudget,
      resultLabels: { invested: 'Needs (50%)', interest: 'Wants (30%)', total: 'Savings (20%)' },
      colors: ['#3b82f6', '#ec4899', '#10b981'] // Blue, Pink, Emerald
    },
    SIMPLE: {
      label: 'Simple Interest',
      icon: Percent,
      inputs: { amount: 'Principal Amount', rate: 'Interest Rate (p.a)', years: 'Time Period (Years)' },
      defaults: { amount: 10000, rate: 5, years: 5 },
      calculate: calculateSimpleInterest,
      resultLabels: { invested: 'Principal', interest: 'Total Interest', total: 'Total Amount' },
      colors: ['#6366f1', '#10b981']
    },
    COMPOUND: {
      label: 'Compound Interest',
      icon: PieIcon,
      inputs: { amount: 'Principal Amount', rate: 'Interest Rate (p.a)', years: 'Time Period (Years)' },
      defaults: { amount: 10000, rate: 5, years: 5 },
      calculate: calculateCompoundInterest,
      resultLabels: { invested: 'Principal', interest: 'Total Interest', total: 'Total Amount' },
      colors: ['#6366f1', '#10b981']
    }
  };

  // Handle Tab Change with Defaults
  const handleTabChange = (type: CalculatorType) => {
    setActiveTab(type);
    setAmount(config[type].defaults.amount);
    setRate(config[type].defaults.rate);
    setYears(config[type].defaults.years);
  };

  useEffect(() => {
    const calcFunc = config[activeTab].calculate;
    // @ts-ignore
    const res = calcFunc(amount, rate, years);
    setResult(res);
  }, [activeTab, amount, rate, years]);

  const activeConfig = config[activeTab];
  const COLORS = activeConfig.colors;

  // For Budget Calculator, we use the custom chartData from result
  // For others, we construct the standard Invested vs Interest data
  const chartData = activeTab === 'BUDGET' && result?.chartData 
    ? result.chartData 
    : [
        { name: activeConfig.resultLabels.invested, value: result?.investedAmount || 0, color: COLORS[0] },
        { name: activeConfig.resultLabels.interest, value: result?.totalInterest || 0, color: COLORS[1] }
      ];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-3xl font-heading font-bold text-slate-900">Financial Simulators</h2>
          <p className="text-slate-500 text-lg">Plan your future with precision using our professional tools.</p>
        </div>
        
        {/* Scrollable Navigation */}
        <div className="relative group">
            <div 
                ref={scrollRef}
                className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide snap-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
            {(Object.keys(config) as CalculatorType[]).map((type) => {
                const Icon = config[type].icon;
                const isActive = activeTab === type;
                return (
                <button
                    key={type}
                    onClick={() => handleTabChange(type)}
                    className={`
                    flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap snap-start border
                    ${isActive 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200 transform scale-105' 
                        : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                    }
                    `}
                >
                    <Icon size={16} />
                    {config[type].label}
                </button>
                );
            })}
            </div>
            {/* Fade effect on right for hint of scroll */}
            <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none md:hidden" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-[2rem] border border-white/60 shadow-xl bg-white/40">
            <div className="space-y-8">
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
                    {activeConfig.inputs.amount}
                    </label>
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">$</span>
                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-heading font-bold text-2xl text-slate-900 shadow-sm"
                        />
                    </div>
                    <input 
                    type="range" 
                    min={activeTab === 'EMI' || activeTab === 'GOAL' ? 10000 : 500} 
                    max={activeTab === 'EMI' || activeTab === 'GOAL' ? 10000000 : 500000} 
                    step={500}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full mt-4 accent-indigo-600 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer"
                    />
                </div>

                {activeTab !== 'BUDGET' && (
                  <>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
                        {activeConfig.inputs.rate}
                        </label>
                        <div className="relative">
                        <input 
                            type="number" 
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            className="w-full pl-4 pr-10 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-heading font-bold text-2xl text-slate-900 shadow-sm"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">%</span>
                        </div>
                        <input 
                        type="range" 
                        min={1} 
                        max={30} 
                        step={0.1}
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                        className="w-full mt-4 accent-indigo-600 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
                        {activeConfig.inputs.years}
                        </label>
                        <div className="relative">
                        <input 
                            type="number" 
                            value={years}
                            onChange={(e) => setYears(Number(e.target.value))}
                            className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all font-heading font-bold text-2xl text-slate-900 shadow-sm"
                        />
                        </div>
                        <input 
                        type="range" 
                        min={1} 
                        max={50} 
                        step={1}
                        value={years}
                        onChange={(e) => setYears(Number(e.target.value))}
                        className="w-full mt-4 accent-indigo-600 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer"
                        />
                    </div>
                  </>
                )}
            </div>

            {/* Special Output Cards for EMI & Goal */}
            {activeTab === 'EMI' && result?.monthlyEMI && (
                <div className="mt-8 p-6 bg-slate-900 rounded-2xl text-center shadow-xl shadow-slate-200 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                    <p className="text-xs font-bold mb-1 opacity-60 uppercase tracking-widest">Monthly EMI</p>
                    <p className="text-4xl font-heading font-bold">${result.monthlyEMI.toLocaleString()}</p>
                </div>
            )}
            
            {activeTab === 'GOAL' && result?.monthlyEMI && (
                <div className="mt-8 p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-center shadow-xl shadow-emerald-200 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                    <p className="text-xs font-bold mb-1 opacity-80 uppercase tracking-widest">Required Monthly Savings</p>
                    <p className="text-4xl font-heading font-bold">${result.monthlyEMI.toLocaleString()}</p>
                </div>
            )}
          </div>
        </div>

        {/* Visualization */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-[2rem] border border-white/60 flex flex-col items-center justify-center min-h-[340px] bg-white/40">
               <h3 className="text-slate-400 font-bold mb-6 uppercase tracking-wider text-[10px]">Asset Allocation</h3>
               {result && (
                 <div className="w-full h-64 relative">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie
                         data={chartData}
                         cx="50%"
                         cy="50%"
                         innerRadius={70}
                         outerRadius={90}
                         paddingAngle={5}
                         dataKey="value"
                         stroke="none"
                         cornerRadius={8}
                       >
                         {chartData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                         ))}
                       </Pie>
                       <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontFamily: 'Outfit' }}
                          formatter={(val: number) => `$${val.toLocaleString()}`}
                       />
                     </PieChart>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Total</span>
                            <div className="text-2xl font-bold text-slate-800">
                                ${(activeTab === 'BUDGET' ? amount : result.totalValue).toLocaleString(undefined, { notation: 'compact' })}
                            </div>
                        </div>
                   </div>
                 </div>
               )}
               <div className="flex gap-4 mt-4 justify-center flex-wrap">
                 {chartData.map((entry, idx) => (
                   <div key={idx} className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full" style={{ background: entry.color }} />
                     <span className="text-xs font-bold text-slate-500">{entry.name.split('(')[0]}</span>
                   </div>
                 ))}
               </div>
            </div>

            <div className="glass-card p-8 rounded-[2rem] border border-white/60 flex flex-col justify-center gap-5 bg-white/40">
               {activeTab === 'BUDGET' ? (
                 <>
                   <div className="bg-white/60 p-5 rounded-2xl border border-white shadow-sm">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Needs (50%)</p>
                     <p className="text-3xl font-heading font-bold text-blue-500">${result?.investedAmount.toLocaleString()}</p>
                   </div>
                   <div className="bg-white/60 p-5 rounded-2xl border border-white shadow-sm">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Wants (30%)</p>
                     <p className="text-3xl font-heading font-bold text-pink-500">${result?.totalInterest.toLocaleString()}</p>
                   </div>
                   <div className="bg-white/60 p-5 rounded-2xl border border-white shadow-sm">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Savings (20%)</p>
                     <p className="text-3xl font-heading font-bold text-emerald-500">${result?.totalValue.toLocaleString()}</p>
                   </div>
                 </>
               ) : (
                 <>
                  <div className="bg-white/60 p-5 rounded-2xl border border-white shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{activeConfig.resultLabels.invested}</p>
                    <p className="text-3xl font-heading font-bold text-slate-900">${result?.investedAmount.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-white/60 p-5 rounded-2xl border border-white shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{activeConfig.resultLabels.interest}</p>
                    <p className="text-3xl font-heading font-bold" style={{ color: COLORS[1] }}>
                        {activeTab === 'EMI' || activeTab === 'INFLATION' ? '-' : '+'}
                        ${result?.totalInterest.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="mt-2 pt-6 border-t border-slate-200/50">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{activeConfig.resultLabels.total}</p>
                    <p className="text-4xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">
                        ${result?.totalValue.toLocaleString()}
                    </p>
                  </div>
                 </>
               )}
            </div>
          </div>

          {activeTab !== 'BUDGET' && (
            <div className="glass-card p-8 rounded-[2rem] border border-white/60 shadow-xl bg-white/40">
              <h3 className="text-slate-400 font-bold mb-6 uppercase tracking-wider text-[10px]">Projection Graph</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result?.breakdown || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS[1]} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={COLORS[1]} stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis 
                          dataKey="year" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} 
                          dy={10}
                      />
                      <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} 
                          tickFormatter={(val) => `$${val/1000}k`} 
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontFamily: 'Outfit', padding: '12px' }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                        cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4'}}
                      />
                      <Area 
                          type="monotone" 
                          dataKey="balance" 
                          stroke={COLORS[1]} 
                          strokeWidth={4} 
                          fillOpacity={1} 
                          fill="url(#colorValue)" 
                          name={activeConfig.resultLabels.total}
                      />
                      <Area 
                          type="monotone" 
                          dataKey="invested" 
                          stroke={COLORS[0]} 
                          strokeWidth={4} 
                          fillOpacity={1} 
                          fill="url(#colorInvested)" 
                          name={activeConfig.resultLabels.invested} 
                      />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculators;