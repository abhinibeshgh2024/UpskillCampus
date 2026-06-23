import React, { useState } from "react";
import PredictorDashboard from "./PredictorDashboard";
import RAGAssistant from "./RAGAssistant";
import { 
  Sprout, 
  MapPin, 
  TrendingUp, 
  Bot, 
  Calculator, 
  MessageSquare, 
  Info, 
  Database, 
  Award 
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"predictor" | "assistant">("predictor");

  return (
    <div className="min-h-screen bg-brand-bg text-brand-primary font-sans antialiased selection:bg-brand-light-green selection:text-brand-primary">
      
      {/* Prime Header Branding */}
      <header className="bg-white border-b border-brand-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-green text-brand-bg rounded-xl shadow-inner flex-shrink-0 animate-pulse">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-brand-primary tracking-tight">AgriPulse India</h1>
                <span className="text-[10px] bg-brand-light-green text-brand-green border border-brand-border px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                  Predictive Production Suite
                </span>
              </div>
              <p className="text-xs text-brand-clay mt-0.5 font-medium">
                Indian Crop cultivation parameters forecasting and RAG advisory grounded in historical metrics (2001-2014)
              </p>
            </div>
          </div>

          {/* Quick Stats overview */}
          <div className="flex items-center gap-4 border-l border-brand-border pl-4 md:border-l-0 md:pl-0 md:justify-end">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-brand-clay font-bold uppercase block tracking-wider font-mono">TRACKED REVENUE WINDOW</span>
              <span className="text-sm font-semibold text-brand-primary font-mono">2001 - 2014 Avg</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-brand-clay font-bold uppercase block tracking-wider font-mono">DATASET SCOPE LICENSE</span>
              <span className="text-xs font-semibold text-brand-green bg-brand-light-green px-2.5 py-0.5 rounded border border-brand-border inline-block font-mono">
                Data.gov.in Official
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Dataset Stats Row */}
        <div id="datasets-overview-metric-row" className="bg-white border border-brand-border rounded-3xl p-5 mb-6 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-light-green rounded-xl text-brand-green flex-shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-brand-clay uppercase tracking-wider block font-mono">Indexed Records</span>
              <span className="text-lg font-black text-brand-primary tracking-tight font-mono">38 Standard Zones</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-light-green rounded-xl text-brand-green flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-brand-clay uppercase tracking-wider block font-mono">Agricultural States</span>
              <span className="text-lg font-black text-brand-primary tracking-tight font-mono">12 Major Regions</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-light-green rounded-xl text-brand-green flex-shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-brand-clay uppercase tracking-wider block font-mono">Primary Cultivar Crops</span>
              <span className="text-lg font-black text-brand-primary tracking-tight font-mono">10 Key Pillars</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-light-green rounded-xl text-brand-green flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-brand-clay uppercase tracking-wider block font-mono">Sourcing Authority</span>
              <span className="text-lg font-black text-brand-primary tracking-tight font-mono">Gov of India LIC</span>
            </div>
          </div>
        </div>

        {/* Tab Controls Navigation */}
        <div className="flex border-b border-brand-border mb-6 gap-2">
          
          <button
            id="tab-yield-predictor"
            onClick={() => setActiveTab("predictor")}
            className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 text-xs font-bold leading-none border-b-2 transition-all uppercase tracking-wider ${
              activeTab === "predictor"
                ? "border-brand-green text-brand-primary bg-white shadow-xs rounded-t-xl font-extrabold"
                : "border-transparent text-brand-clay hover:text-brand-primary hover:border-brand-border"
            }`}
          >
            <Calculator className="w-4 h-4" />
            Interactive Yield Predictor
          </button>

          <button
            id="tab-rag-assistant"
            onClick={() => setActiveTab("assistant")}
            className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 text-xs font-bold leading-none border-b-2 transition-all uppercase tracking-wider ${
              activeTab === "assistant"
                ? "border-brand-green text-brand-primary bg-white shadow-xs rounded-t-xl font-extrabold"
                : "border-transparent text-brand-clay hover:text-brand-primary hover:border-brand-border"
            }`}
          >
            <Bot className="w-4 h-4" />
            Vruksha AI Advisor
          </button>

        </div>

        {/* Active Component Mounted */}
        <div className="transition-opacity duration-300">
          {activeTab === "predictor" ? (
            <PredictorDashboard />
          ) : (
            <RAGAssistant />
          )}
        </div>

      </main>

      {/* Craft Footer */}
      <footer className="bg-white border-t border-brand-border mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <p className="text-xs text-brand-clay flex items-center justify-center gap-1.5 font-medium">
            <Sprout className="w-3.5 h-3.5 text-brand-green" />
            AgriPulse India Predictor Suite. All historical datasets licensed by Open Government Data Platform (OGD) India.
          </p>
          <p className="text-[10px] text-brand-clay uppercase tracking-widest font-mono">
            Grounding models strictly using Local Document Chunking & Token-Match RAG • Fully Secure & Offline
          </p>
        </div>
      </footer>

    </div>
  );
}
