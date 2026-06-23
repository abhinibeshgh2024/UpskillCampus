import React, { useState, useMemo } from "react";
import { cropData, CropRecord } from "./cropDataset";
import { 
  Sprout, 
  MapPin, 
  Layers, 
  Calendar, 
  Coins, 
  TrendingUp, 
  Activity, 
  Scale, 
  Lightbulb, 
  Sliders, 
  HelpCircle,
  TrendingDown
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
  Cell
} from "recharts";

// Standard rates associated with crops in India (per Quintal, estimate calibrated with historical and current MSP)
const StandardMarketPrices: Record<string, number> = {
  "Rice": 2200,
  "Wheat": 2275,
  "Sugarcane": 315, // Note: Sugarcane is high-volume and usually priced per Quintal, sugar mills pay FRP
  "Cotton": 7000,
  "Maize": 2100,
  "Mustard": 5450,
  "Chickpea": 5400,
  "Soybean": 4600,
  "Bajra": 2500,
  "Ragi": 3850
};

export default function PredictorDashboard() {
  // --- States ---
  const [selectedCrop, setSelectedCrop] = useState<string>("Rice");
  
  // Available states for chosen crop
  const availableStates = useMemo(() => {
    const states = cropData
      .filter(item => item.crop === selectedCrop)
      .map(item => item.state);
    return Array.from(new Set(states));
  }, [selectedCrop]);

  // Handle fallback when crop changes
  const [selectedState, setSelectedState] = useState<string>("Punjab");

  // Keep state updated to an available state for the selected crop
  React.useEffect(() => {
    if (availableStates.length > 0 && !availableStates.includes(selectedState)) {
      setSelectedState(availableStates[0]);
    }
  }, [selectedCrop, availableStates, selectedState]);

  // Find the exact active record
  const activeRecord = useMemo(() => {
    return cropData.find(
      item => item.crop === selectedCrop && item.state === selectedState
    ) || cropData.find(item => item.crop === selectedCrop) || cropData[0];
  }, [selectedCrop, selectedState]);

  // User input variables
  const [cultivationArea, setCultivationArea] = useState<number>(5); // in Hectares
  const [costEfficiency, setCostEfficiency] = useState<number>(0); // -20% to +20%
  const [customMarketPrice, setCustomMarketPrice] = useState<number>(0); // 0 means use standard

  // Sync market price slider to standard value when crop changes
  React.useEffect(() => {
    if (selectedCrop) {
      setCustomMarketPrice(StandardMarketPrices[selectedCrop] || 2000);
    }
  }, [selectedCrop]);

  // Available unique crops
  const uniqueCrops = useMemo(() => {
    return Array.from(new Set(cropData.map(item => item.crop)));
  }, []);

  // Projections calculations
  const projections = useMemo(() => {
    if (!activeRecord) return null;

    const baseYield = activeRecord.quantity; // Quintals / Hectare
    const baseCost = activeRecord.cost; // INR / Hectare
    const marketPrice = customMarketPrice > 0 ? customMarketPrice : (StandardMarketPrices[selectedCrop] || 2000);

    // Yield modifier: if cost efficiency is positive (representing high quality seed + fertilizer inputs), yield can increase up to 10%
    // If cost efficiency is negative (budget cuts), yield can drop up to 15%
    let yieldModifier = 1.0;
    if (costEfficiency > 0) {
      yieldModifier += (costEfficiency / 100) * 0.4; // max +8% yield
    } else {
      yieldModifier += (costEfficiency / 100) * 0.75; // max -15% yield
    }

    const adjustedYield = Number((baseYield * yieldModifier).toFixed(2));
    const totalYieldQuintals = Number((adjustedYield * cultivationArea).toFixed(1));
    const totalProductionTons = Number((totalYieldQuintals / 10).toFixed(1)); // 1 Ton = 10 Quintals

    const costPerHectare = Math.round(baseCost * (1 + costEfficiency / 100));
    const totalCultivationCost = Math.round(costPerHectare * cultivationArea);

    const grossRevenue = Math.round(totalYieldQuintals * marketPrice);
    const netProfit = grossRevenue - totalCultivationCost;
    const roiPercentage = totalCultivationCost > 0 ? Number(((netProfit / totalCultivationCost) * 100).toFixed(1)) : 0;

    return {
      adjustedYield,
      totalYieldQuintals,
      totalProductionTons,
      costPerHectare,
      totalCultivationCost,
      grossRevenue,
      netProfit,
      roiPercentage,
      marketPrice
    };
  }, [activeRecord, selectedCrop, cultivationArea, costEfficiency, customMarketPrice]);

  // State-wide yield comparison for standard bars chart
  const stateComparisonData = useMemo(() => {
    return cropData
      .filter(item => item.crop === selectedCrop)
      .map(item => ({
        state: item.state,
        yield: item.quantity,
        cost: item.cost,
        variety: item.variety
      }));
  }, [selectedCrop]);

  // Historical production simulation (2001-2014) based on state averages
  const simulatedHistory = useMemo(() => {
    if (!activeRecord) return [];
    
    // Create random-walk variation centered on active base production
    const base = activeRecord.production;
    const years = Array.from({ length: 14 }, (_, i) => 2001 + i);
    
    // Seeded random behavior for deterministic stability of charts
    let tempVal = base;
    return years.map((year, idx) => {
      // Deterministic multiplier based on year digits
      const multiplier = 0.85 + (Math.sin(year + idx * 5) * 0.12) + (idx * 0.012);
      const simulatedProd = Math.round(base * multiplier);
      const simulatedYield = (activeRecord.quantity * multiplier).toFixed(1);
      return {
        year: year.toString(),
        production: Math.round(simulatedProd / 1000), // In Thousand Tons
        yield: parseFloat(simulatedYield)
      };
    });
  }, [activeRecord]);

  // Optimization advisory suggestions
  const dynamicAdvice = useMemo(() => {
    if (!activeRecord) return [];

    const suggestions = [];

    // Yield comparisons across state
    const cropsInStates = cropData.filter(i => i.crop === selectedCrop);
    const highestYieldState = cropsInStates.reduce((prev, current) => (prev.quantity > current.quantity) ? prev : current, cropsInStates[0]);

    if (highestYieldState && highestYieldState.state !== selectedState) {
      suggestions.push({
        type: "Alternative Region",
        text: `In **${highestYieldState.state}**, the crop **${selectedCrop}** achieves a significantly higher baseline yield of **${highestYieldState.quantity} Qtl/Ha** (using variety *${highestYieldState.variety}*) compared to **${activeRecord.quantity} Qtl/Ha** in your selected region. Adopting their microclimatic soil structure or irrigation standards can elevate output.`,
        gain: `${Math.round(((highestYieldState.quantity - activeRecord.quantity) / activeRecord.quantity) * 100)}% Potential Yield Increase`
      });
    }

    // Cost optimizations
    if (selectedCrop === "Sugarcane") {
      suggestions.push({
        type: "Drip Irrigation Benefit",
        text: "Transitioning from flood basin water to scheduled Subsurface Drip Irrigation in Maharashtra/Karnataka reduces your water bills by almost 45% while driving cane density up to 22% higher.",
        gain: "✨ 25% Water Savings & Higher Sucrose"
      });
    }

    if (selectedCrop === "Rice" && selectedState === "Punjab") {
      suggestions.push({
        type: "Direct Seeded Rice (DSR)",
        text: "Adopting Direct Seeded Rice skipping classical puddling minimizes nursery labor expenses and saves substantial costs (approx ₹4,000/Hectare) in high-drain sites.",
        gain: "💸 ₹4,000/Ha Cost Savings"
      });
    }

    if (selectedCrop === "Cotton") {
      suggestions.push({
        type: "IPM Pheromone Advantage",
        text: "Using Integrated Pest Management with early pheromone traps for pink bollworm controls secondary whitefly outbreaks, lowering pesticide costs by 30%.",
        gain: "🧪 30% Safer Pest Budgets"
      });
    }

    // General high-efficiency inputs
    suggestions.push({
      type: "Seed Grading",
      text: "Utilize dynamic seed sizing and float treatment (removing hollow lightweight seeds in 10% brine solution) to ensure a uniform 94% sprout germination rate across your fields.",
      gain: "🌱 Higher Uniform Harvest Density"
    });

    return suggestions;
  }, [selectedCrop, selectedState, activeRecord]);

  return (
    <div id="predictor-dashboard-section" className="space-y-6">
      {/* Top Config Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Control Panel Card */}
        <div id="control-panel-card" className="lg:col-span-4 bg-white rounded-3xl border border-brand-border p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-brand-border">
              <div className="p-2.5 bg-brand-light-green rounded-xl text-brand-green">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-primary text-base leading-none">Simulation Controls</h3>
                <p className="text-xs text-brand-clay mt-1">Adjust farm parameters to generate custom forecasts</p>
              </div>
            </div>

            {/* Inputs Form */}
            <div className="space-y-4 mt-5">
              {/* Crop Selector */}
              <div>
                <label className="block text-xs font-bold text-brand-clay uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5 text-brand-green" />
                  Select Crop
                </label>
                <select 
                  id="crop-selection-dropdown"
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full bg-brand-bg hover:bg-[#f5f2ed] border border-brand-border rounded-xl py-2 px-3 text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-green font-medium transition-colors cursor-pointer"
                >
                  {uniqueCrops.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>

              {/* State Selector */}
              <div>
                <label className="block text-xs font-bold text-brand-clay uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-green" />
                  Target State
                </label>
                <select 
                  id="state-selection-dropdown"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-brand-bg hover:bg-[#f5f2ed] border border-brand-border rounded-xl py-2 px-3 text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-green font-medium transition-colors cursor-pointer"
                >
                  {availableStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              {/* Hectares input and slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-brand-clay uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-brand-green" />
                    Farm Cultivation Size
                  </label>
                  <span className="text-xs font-bold text-brand-green bg-brand-light-green px-2.5 py-0.5 rounded-full border border-brand-border">
                    {cultivationArea} Hectares
                  </span>
                </div>
                <input 
                  id="area-size-range"
                  type="range"
                  min="1"
                  max="100"
                  value={cultivationArea}
                  onChange={(e) => setCultivationArea(parseInt(e.target.value) || 1)}
                  className="w-full h-1.5 bg-[#f5f2ed] rounded-lg appearance-none cursor-pointer accent-brand-green focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-brand-clay mt-1">
                  <span>1 Ha (~2.47 Acres)</span>
                  <span>50 Ha</span>
                  <span>100 Ha</span>
                </div>
              </div>

              {/* Cost of Cultivation Modifier (Inputs & Fertilisers) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-brand-clay uppercase tracking-wider flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-brand-green" />
                    Quality Capital Modifier
                  </label>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    costEfficiency > 0 
                      ? "text-brand-green bg-brand-light-green border-brand-border" 
                      : costEfficiency < 0 
                        ? "text-brand-accent bg-[#fbf6f3] border-brand-border" 
                        : "text-brand-clay bg-brand-bg border-brand-border"
                  }`}>
                    {costEfficiency > 0 ? `+${costEfficiency}% (High-yield inputs)` : `${costEfficiency}%`}
                  </span>
                </div>
                <input 
                  id="efficiency-factor-range"
                  type="range"
                  min="-20"
                  max="20"
                  step="5"
                  value={costEfficiency}
                  onChange={(e) => setCostEfficiency(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-[#f5f2ed] rounded-lg appearance-none cursor-pointer accent-brand-green focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-brand-clay mt-1">
                  <span>-20% Budget Cut</span>
                  <span>Standard</span>
                  <span>+20% Max Fertilizers</span>
                </div>
              </div>

              {/* Selling Price Adjustment */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-brand-clay uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-brand-green" />
                    Market Rate (Selling Price)
                  </label>
                  <span className="text-xs font-bold text-brand-green bg-brand-light-green px-2.5 py-0.5 rounded-full border border-brand-border">
                    ₹{projections?.marketPrice} / Quintal
                  </span>
                </div>
                <input 
                  id="market-price-range"
                  type="range"
                  min={Math.round((StandardMarketPrices[selectedCrop] || 2000) * 0.6)}
                  max={Math.round((StandardMarketPrices[selectedCrop] || 2000) * 1.5)}
                  step="50"
                  value={customMarketPrice}
                  onChange={(e) => setCustomMarketPrice(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-[#f5f2ed] rounded-lg appearance-none cursor-pointer accent-brand-green focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-brand-clay mt-1">
                  <span>-40% Market Drop</span>
                  <span>Standard MSP</span>
                  <span>+50% High Demand</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-brand-border">
            <div className="bg-brand-bg p-4 rounded-2xl border border-brand-border">
              <span className="text-[10px] font-bold text-brand-clay uppercase tracking-widest block">ACTIVE VARIETY PROFILE</span>
              <div className="flex justify-between items-center mt-2.5">
                <span className="text-brand-primary font-bold text-sm">{activeRecord.variety}</span>
                <span className="text-[10px] text-brand-green bg-brand-light-green px-2.5 py-1 rounded-md border border-brand-border font-mono font-bold uppercase">{activeRecord.season}</span>
              </div>
              <div className="text-brand-clay text-xs mt-2 flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-brand-clay" />
                <span>Crop Maturity Cycle: <strong>{activeRecord.durationDays} days</strong></span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Outputs Panel Column */}
        <div id="results-and-projection-panel" className="lg:col-span-8 space-y-6">
          
          {/* Main Financial Outlook Card */}
          <div className="bg-brand-primary rounded-3xl p-6 text-white shadow-md border border-brand-sage relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-brand-green/20 rounded-full blur-2xl"></div>
            
            <div className="flex justify-between items-start pb-4 border-b border-brand-sage">
              <div>
                <span className="text-[10px] font-bold text-brand-light-green tracking-wider uppercase">Projected Economic Outlook (Simulated)</span>
                <h4 className="text-xl font-bold mt-0.5 text-white">{selectedState} — {selectedCrop}</h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-brand-sage border border-brand-green/30 text-brand-light-green px-3 py-1.5 rounded-full font-bold uppercase tracking-wider font-mono">
                  {cultivationArea} Hectares (~24 Bigas)
                </span>
              </div>
            </div>

            {/* Calculations Blocks */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              
              <div className="bg-brand-dark-input/60 border border-brand-sage/40 p-4 rounded-2xl">
                <p className="text-xs text-[#b3c0ad] font-semibold">Estimated Production</p>
                <p className="text-2xl font-black text-white mt-1 font-mono">
                  {projections?.totalProductionTons} <span className="text-xs font-normal text-[#cbd5c6]">Tons</span>
                </p>
                <div className="text-[10px] text-[#cbd3c6] mt-1.5 flex items-center gap-1 font-medium">
                  <span>({projections?.totalYieldQuintals} Quintals)</span>
                </div>
              </div>

              <div className="bg-brand-dark-input/60 border border-brand-sage/40 p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#b3c0ad] font-semibold">Outlay Cost</p>
                </div>
                <p className="text-2xl font-black text-white mt-1 font-mono">
                  ₹{projections?.totalCultivationCost.toLocaleString("en-IN")}
                </p>
                <div className="text-[10px] text-[#cbd3c6] mt-1.5 flex items-center gap-0.5">
                  <Coins className="w-3.5 h-3.5 text-brand-accent" />
                  <span>₹{projections?.costPerHectare.toLocaleString("en-IN")}/Ha</span>
                </div>
              </div>

              <div className="bg-brand-dark-input/60 border border-brand-sage/40 p-4 rounded-2xl">
                <p className="text-xs text-[#b3c0ad] font-semibold">Gross Revenue</p>
                <p className="text-2xl font-black text-[#86af79] mt-1 font-mono">
                  ₹{projections?.grossRevenue.toLocaleString("en-IN")}
                </p>
                <div className="text-[10px] text-[#cbd3c6] mt-1.5 flex items-center gap-1 font-semibold">
                  <span>@ ₹{projections?.marketPrice}/Qtl</span>
                </div>
              </div>

              <div className="bg-brand-dark-input/60 border border-brand-sage/40 p-4 rounded-2xl">
                <p className="text-xs text-[#b3c0ad] font-semibold">Net Profit / ROI</p>
                <p className={`text-2xl font-black mt-1 font-mono ${projections && projections.netProfit >= 0 ? "text-brand-light-green" : "text-brand-accent"}`}>
                  ₹{projections?.netProfit.toLocaleString("en-IN")}
                </p>
                <div className="text-[10px] mt-1.5 flex items-center gap-1 font-bold">
                  {projections && projections.netProfit >= 0 ? (
                    <span className="text-[#a5cc9a]">+{projections?.roiPercentage}% ROI</span>
                  ) : (
                    <span className="text-brand-accent">-{projections?.roiPercentage}% Loss</span>
                  )}
                </div>
              </div>

            </div>

            {/* Performance Bar info */}
            <div className="mt-6 p-4 bg-brand-sage/40 border border-brand-green/30 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="p-1 bg-brand-light-green/10 text-brand-light-green rounded-full mt-0.5">
                  <Activity className="w-4 h-4 text-brand-light-green" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">Yield Density Estimate</h5>
                  <p className="text-xs text-[#cbd5c6] mt-0.5 leading-normal">
                    Modifying high-quality inputs yields an adjusted density of <strong className="text-brand-light-green">{projections?.adjustedYield} Qtl/Ha</strong> (Baseline base yield was {activeRecord.quantity} Qtl/Ha).
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-xs text-[#cbd3c6] block font-semibold">Region-specific Zone</span>
                <span className="text-xs font-mono font-bold text-brand-light-green bg-[#1f281b] border border-brand-sage px-2.5 py-1 rounded-md mt-1 inline-block max-w-[240px] truncate overflow-hidden">
                  {activeRecord.recommendedZone}
                </span>
              </div>
            </div>

          </div>

          {/* Graphical Projections Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Chart: Yield comparison across States */}
            <div id="state-yield-compare-chart-card" className="bg-white rounded-3xl border border-brand-border p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-brand-green" />
                    Indian States Yield Comparison
                  </h4>
                  <p className="text-xs text-brand-clay mt-0.5">Production Yield (Quintals/Hectare) for {selectedCrop}</p>
                </div>
              </div>
              <div className="h-[210px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stateComparisonData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e0d5" />
                    <XAxis dataKey="state" fontSize={11} stroke="#7c614e" tickLine={false} />
                    <YAxis fontSize={11} stroke="#7c614e" tickLine={false} />
                    <Tooltip 
                      cursor={{ fill: '#f5f2ed' }} 
                      contentStyle={{ backgroundColor: '#2d3a27', color: '#fff', fontSize: '11px', border: 'none', borderRadius: '12px' }}
                    />
                    <Bar dataKey="yield" radius={[6, 6, 0, 0]}>
                      {stateComparisonData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.state === selectedState ? "#4a6741" : "#cbd3c6"} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart: Historical Production Simulation Trend */}
            <div id="historical-trends-simulation-card" className="bg-white rounded-3xl border border-brand-border p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-brand-green" />
                    Historical Yield Trend (2001-2014)
                  </h4>
                  <p className="text-xs text-brand-clay mt-0.5">Calibrated output production simulation (Thousand Tons)</p>
                </div>
              </div>
              <div className="h-[210px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simulatedHistory} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4a6741" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#4a6741" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e0d5" />
                    <XAxis dataKey="year" fontSize={10} stroke="#7c614e" tickLine={false} />
                    <YAxis fontSize={10} stroke="#7c614e" tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#2d3a27', color: '#fff', fontSize: '11px', border: 'none', borderRadius: '12px' }}
                    />
                    <Area type="monotone" dataKey="production" name="Production Index" stroke="#4a6741" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProduction)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Expert Recommendations Bento Card */}
          <div className="bg-brand-light-green/35 rounded-3xl border border-brand-border p-5 shadow-xs">
            <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1.5 mb-3">
              <Lightbulb className="w-4 h-4 text-brand-primary" />
              Dynamic Advisory Optimizer Suggestions
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dynamicAdvice.slice(0, 2).map((item, index) => (
                <div key={index} className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm relative overflow-hidden transition-all hover:translate-y-[-1px]">
                  <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 w-8 h-8 rounded-full bg-brand-light-green flex items-center justify-center">
                    <span className="text-[10px] font-extrabold text-brand-green">#{index+1}</span>
                  </div>
                  <span className="text-[10px] font-bold text-brand-clay uppercase tracking-widest block mb-1">{item.type}</span>
                  <p className="text-xs text-brand-primary leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: item.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                  <span className="text-xs font-bold text-brand-green bg-brand-light-green px-2.5 py-1 rounded-md border border-brand-border inline-block">
                    {item.gain}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
