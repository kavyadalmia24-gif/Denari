import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Trophy, BrainCircuit } from 'lucide-react';
import { QuizQuestion } from '../types';

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "What does SIP stand for in mutual funds?",
    options: ["Systematic Investment Plan", "Simple Interest Plan", "Safe Investment Policy", "Stock Investment Plan"],
    correctAnswer: 0,
    explanation: "SIP stands for Systematic Investment Plan. It is a method of investing a fixed sum regularly in a mutual fund scheme."
  },
  {
    id: 2,
    question: "Which of these is considered a 'Safe Haven' asset during market volatility?",
    options: ["Cryptocurrency", "Small Cap Stocks", "Gold", "Derivatives"],
    correctAnswer: 2,
    explanation: "Gold is historically considered a safe haven asset that investors turn to during economic instability."
  },
  {
    id: 3,
    question: "The concept of 'Compound Interest' is best described as:",
    options: ["Interest on Principal only", "Interest on Interest", "Fixed yearly return", "Tax-free return"],
    correctAnswer: 1,
    explanation: "Compound interest is calculated on the principal amount and also on the accumulated interest of previous periods."
  },
  {
    id: 4,
    question: "What is a 'Bear Market'?",
    options: ["Market going up aggressively", "Market is stagnant", "Market experiencing a prolonged price decline", "Market with high animal trading"],
    correctAnswer: 2,
    explanation: "A Bear Market describes a market condition where prices of securities are falling or are expected to fall."
  }
];

const Quiz: React.FC = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleOptionSelect = (index: number) => {
    if (isSubmitted) return;
    setSelectedOpt(index);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (selectedOpt === questions[currentQ].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelectedOpt(null);
      setIsSubmitted(false);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setSelectedOpt(null);
    setIsSubmitted(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in zoom-in duration-500">
        <div className="relative">
             <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mb-4 shadow-xl shadow-amber-100">
                <Trophy size={64} className="text-amber-500" fill="currentColor" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg animate-bounce">
                A+
            </div>
        </div>
        
        <div>
            <h2 className="text-4xl font-heading font-extrabold text-slate-900 mb-2">Assessment Complete!</h2>
            <p className="text-slate-500 text-lg">You scored <span className="font-bold text-indigo-600 text-2xl">{score}</span> out of <span className="font-bold text-slate-900 text-2xl">{questions.length}</span></p>
        </div>
        
        <div className="w-full max-w-md bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
            style={{ width: `${(score / questions.length) * 100}%` }} 
          />
        </div>

        <button 
          onClick={resetQuiz}
          className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-full hover:bg-slate-800 transition-all shadow-xl hover:-translate-y-1 font-bold"
        >
          <RefreshCw size={20} /> Retake Assessment
        </button>
      </div>
    );
  }

  const question = questions[currentQ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
             <h2 className="text-3xl font-heading font-bold text-slate-900">Financial IQ</h2>
             <p className="text-slate-500">Test your market knowledge</p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-2xl text-sm font-bold border border-indigo-100 flex items-center gap-2">
          <BrainCircuit size={18} />
          Question {currentQ + 1} / {questions.length}
        </div>
      </div>

      <div className="glass-card p-8 md:p-10 rounded-[2.5rem] border border-white/60 shadow-xl relative bg-white/40">
        <h3 className="text-2xl font-bold text-slate-800 mb-8 leading-relaxed font-heading">
          {question.question}
        </h3>

        <div className="space-y-4">
          {question.options.map((option, idx) => {
            let className = "w-full p-5 rounded-2xl text-left border-2 transition-all flex items-center justify-between group relative overflow-hidden ";
            
            if (isSubmitted) {
              if (idx === question.correctAnswer) {
                className += "border-emerald-500 bg-emerald-50 text-emerald-900";
              } else if (idx === selectedOpt) {
                className += "border-rose-500 bg-rose-50 text-rose-900";
              } else {
                className += "border-slate-100 opacity-50";
              }
            } else {
              if (selectedOpt === idx) {
                className += "border-indigo-500 bg-indigo-50 text-indigo-900 shadow-md";
              } else {
                className += "border-slate-100 hover:border-indigo-200 hover:bg-white/80 hover:shadow-sm";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={isSubmitted}
                className={className}
              >
                <span className="font-medium relative z-10 text-lg">{option}</span>
                {isSubmitted && idx === question.correctAnswer && <CheckCircle2 size={24} className="text-emerald-600 relative z-10" />}
                {isSubmitted && idx === selectedOpt && idx !== question.correctAnswer && <XCircle size={24} className="text-rose-600 relative z-10" />}
                {!isSubmitted && selectedOpt === idx && <div className="w-5 h-5 rounded-full border-4 border-indigo-500" />}
                {!isSubmitted && selectedOpt !== idx && <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-indigo-300" />}
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div className="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex gap-4 text-indigo-900 animate-in fade-in slide-in-from-bottom-2">
            <AlertCircle className="shrink-0 mt-1 text-indigo-600" size={24} />
            <div>
              <p className="font-bold mb-1 font-heading">Expert Insight:</p>
              <p className="text-base leading-relaxed opacity-90">{question.explanation}</p>
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-end">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOpt === null}
              className={`
                px-10 py-4 rounded-full font-bold transition-all text-lg shadow-lg
                ${selectedOpt === null 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 hover:-translate-y-1'
                }
              `}
            >
              Lock Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-10 py-4 rounded-full font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-lg flex items-center gap-2"
            >
              {currentQ === questions.length - 1 ? 'Finish Assessment' : 'Next Challenge'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;