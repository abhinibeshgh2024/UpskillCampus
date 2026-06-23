/**
 * India Agriculture Crop Production Dataset and Advisory Articles
 * Time period: 2001-2014, updated with standard Indian agricultural metrics.
 */

export interface CropRecord {
  id: string;
  crop: string;
  variety: string;
  state: string;
  quantity: number; // Avg Yield in Quintals per Hectare
  production: number; // Avg Annual Production in Tons (state range)
  season: string; // Kharif, Rabi, Zaid + Duration
  durationDays: number; // Crop cycle duration in days
  unit: string; // Default 'Tons' for Production
  cost: number; // Cost of cultivation & production in INR per Hectare
  recommendedZone: string; // Region, soil type, temperature zone
}

export interface AdvisoryArticle {
  id: string;
  title: string;
  category: "Soil & Water" | "Pest Control" | "Financial Advice" | "Crop Guide" | "Sustainable Farming";
  cropMatch?: string[]; // Specific crops this article applies to
  stateMatch?: string[]; // Specific states
  content: string;
  keyTakeaways: string[];
}

export const cropData: CropRecord[] = [
  // --- RICE (Kharif, high water demand) ---
  {
    id: "rice-pb-01",
    crop: "Rice",
    variety: "Pusa Basmati-1121",
    state: "Punjab",
    quantity: 48,
    production: 11200000,
    season: "Kharif (Medium)",
    durationDays: 135,
    unit: "Tons",
    cost: 32000,
    recommendedZone: "Indo-Gangetic Plain, Clayey Loam Soils, assured irrigation"
  },
  {
    id: "rice-up-01",
    crop: "Rice",
    variety: "Sarna (MTU 7029)",
    state: "Uttar Pradesh",
    quantity: 42,
    production: 14500000,
    season: "Kharif (Long)",
    durationDays: 145,
    unit: "Tons",
    cost: 28000,
    recommendedZone: "Eastern Valleys, alluvial sandy clay soils"
  },
  {
    id: "rice-wb-01",
    crop: "Rice",
    variety: "Swarna-Sub1",
    state: "West Bengal",
    quantity: 44,
    production: 15200000,
    season: "Kharif (Medium)",
    durationDays: 140,
    unit: "Tons",
    cost: 29500,
    recommendedZone: "Gangetic Delta, alluvial fertile soil, heavy monsoon rain"
  },
  {
    id: "rice-ap-01",
    crop: "Rice",
    variety: "BPT 5204 (Samba Mahsuri)",
    state: "Andhra Pradesh",
    quantity: 46,
    production: 8500000,
    season: "Kharif (Long)",
    durationDays: 150,
    unit: "Tons",
    cost: 34000,
    recommendedZone: "Krishna-Godavari Delta, dark clayey loam backwater soils"
  },
  {
    id: "rice-tn-01",
    crop: "Rice",
    variety: "CR 1009 (Samba)",
    state: "Tamil Nadu",
    quantity: 45,
    production: 5800000,
    season: "Kharif (Long)",
    durationDays: 155,
    unit: "Tons",
    cost: 33000,
    recommendedZone: "Cauvery Delta, heavy clay alluvial soil, high humidity"
  },
  {
    id: "rice-mh-01",
    crop: "Rice",
    variety: "Karjat-3",
    state: "Maharashtra",
    quantity: 36,
    production: 2900000,
    season: "Kharif (Medium)",
    durationDays: 125,
    unit: "Tons",
    cost: 27000,
    recommendedZone: "Konkan Coastal Belt, laterite soils, heavy rainfall"
  },

  // --- WHEAT (Rabi, cool climate, well-drained loams) ---
  {
    id: "wheat-pb-01",
    crop: "Wheat",
    variety: "HD-2967",
    state: "Punjab",
    quantity: 52,
    production: 16500000,
    season: "Rabi (Medium)",
    durationDays: 140,
    unit: "Tons",
    cost: 29000,
    recommendedZone: "Sutlej-Ganga Plain, rich loamy soils, controlled winter sprinkler irrigation"
  },
  {
    id: "wheat-hr-01",
    crop: "Wheat",
    variety: "WH-1105",
    state: "Haryana",
    quantity: 50,
    production: 11500000,
    season: "Rabi (Medium)",
    durationDays: 138,
    unit: "Tons",
    cost: 28500,
    recommendedZone: "Semiarid loamy alluvial soils"
  },
  {
    id: "wheat-up-01",
    crop: "Wheat",
    variety: "PBW-343",
    state: "Uttar Pradesh",
    quantity: 45,
    production: 30000000,
    season: "Rabi (Medium)",
    durationDays: 135,
    unit: "Tons",
    cost: 26000,
    recommendedZone: "Upper & Middle Gangetic Plains, mild winter temperatures"
  },
  {
    id: "wheat-mp-01",
    crop: "Wheat",
    variety: "GW-322 (Sharbati)",
    state: "Madhya Pradesh",
    quantity: 38,
    production: 14000000,
    season: "Rabi (Short)",
    durationDays: 120,
    unit: "Tons",
    cost: 24000,
    recommendedZone: "Malwa Plateau, heavy black clay soil, high sun maturity"
  },
  {
    id: "wheat-rj-01",
    crop: "Wheat",
    variety: "Raj-3765",
    state: "Rajasthan",
    quantity: 40,
    production: 9800000,
    season: "Rabi (Medium)",
    durationDays: 130,
    unit: "Tons",
    cost: 25000,
    recommendedZone: "Canal-irrigated Sandy Loams (Sri Ganganagar, Kota)"
  },

  // --- SUGARCANE (Cash crop, very long duration, heavy irrigation) ---
  {
    id: "sugar-up-01",
    crop: "Sugarcane",
    variety: "Co-0238 (Karan-4)",
    state: "Uttar Pradesh",
    quantity: 780, // High yield in quintals per hectare
    production: 135000000,
    season: "Kharif/Annual (Long)",
    durationDays: 330,
    unit: "Tons",
    cost: 85000,
    recommendedZone: "Subtropical Terai Belt, rich loam with organic matter"
  },
  {
    id: "sugar-mh-01",
    crop: "Sugarcane",
    variety: "Co-86032 (Nayana)",
    state: "Maharashtra",
    quantity: 920,
    production: 82000000,
    season: "Annual (Long)",
    durationDays: 360,
    unit: "Tons",
    cost: 98000,
    recommendedZone: "Deccan Southern Trap, deep black cotton soils, drip-irrigated canal water"
  },
  {
    id: "sugar-ka-01",
    crop: "Sugarcane",
    variety: "Co-62175",
    state: "Karnataka",
    quantity: 880,
    production: 38000000,
    season: "Annual (Long)",
    durationDays: 350,
    unit: "Tons",
    cost: 92000,
    recommendedZone: "Belagavi & Krishna Basin, alluvial riversides"
  },
  {
    id: "sugar-tn-01",
    crop: "Sugarcane",
    variety: "CoC-24",
    state: "Tamil Nadu",
    quantity: 980,
    production: 24000000,
    season: "Annual (Extra-Long)",
    durationDays: 380,
    unit: "Tons",
    cost: 105000,
    recommendedZone: "Coastal delta plains, intensive well irrigation, highly saline-resilient"
  },

  // --- COTTON (Fiber cash crop, medium rain, black soil) ---
  {
    id: "cotton-gj-01",
    crop: "Cotton",
    variety: "Bt Cotton (Hybrid-6)",
    state: "Gujarat",
    quantity: 26, // Yield in quintals/hectare
    production: 10500000,
    season: "Kharif (Long)",
    durationDays: 180,
    unit: "Tons",
    cost: 45000,
    recommendedZone: "Kathiawar peninsula, black regur clay soils, dry climate with sparse rain"
  },
  {
    id: "cotton-mh-01",
    crop: "Cotton",
    variety: "Bt Cotton (Yugendra)",
    state: "Maharashtra",
    quantity: 18,
    production: 7200000,
    season: "Kharif (Medium)",
    durationDays: 165,
    unit: "Tons",
    cost: 40000,
    recommendedZone: "Vidarbha and Marathwada region, shallow black soils, rain-fed cultivation"
  },
  {
    id: "cotton-ap-01",
    crop: "Cotton",
    variety: "Bunny Bt",
    state: "Andhra Pradesh",
    quantity: 22,
    production: 5300000,
    season: "Kharif (Long)",
    durationDays: 175,
    unit: "Tons",
    cost: 43000,
    recommendedZone: "Guntur & Kurnool red mixed loams, high inputs"
  },
  {
    id: "cotton-pb-01",
    crop: "Cotton",
    variety: "LH-2076",
    state: "Punjab",
    quantity: 24,
    production: 1800000,
    season: "Kharif (Medium)",
    durationDays: 160,
    unit: "Tons",
    cost: 41000,
    recommendedZone: "Semi-arid southwestern Punjab plains, canal irrigated"
  },

  // --- MAIZE (High starch nutrient feed) ---
  {
    id: "maize-ka-01",
    crop: "Maize",
    variety: "Deccan Double Hybrid",
    state: "Karnataka",
    quantity: 48,
    production: 3800000,
    season: "Kharif (Medium)",
    durationDays: 110,
    unit: "Tons",
    cost: 21000,
    recommendedZone: "Central dry zone, red gravelly soils with organic composting"
  },
  {
    id: "maize-ap-01",
    crop: "Maize",
    variety: "Dharang Hybrid-33",
    state: "Andhra Pradesh",
    quantity: 52,
    production: 4100000,
    season: "Rabi (Medium)",
    durationDays: 120,
    unit: "Tons",
    cost: 23000,
    recommendedZone: "Godavari sands, high winter residual moisture"
  },
  {
    id: "maize-bh-01",
    crop: "Maize",
    variety: "Shaktiman-1 (QPM)",
    state: "Bihar",
    quantity: 45,
    production: 2800000,
    season: "Rabi (Long)",
    durationDays: 140,
    unit: "Tons",
    cost: 19500,
    recommendedZone: "North Bihar floodplains, rich silt deposits"
  },
  {
    id: "maize-mp-01",
    crop: "Maize",
    variety: "JVM-421",
    state: "Madhya Pradesh",
    quantity: 28,
    production: 3200000,
    season: "Kharif (Short)",
    durationDays: 95,
    unit: "Tons",
    cost: 17000,
    recommendedZone: "Tribal hilly zones, well-drained low-fertility soils"
  },

  // --- MUSTARD & RAPESEED (Rabi Oilseed, dry conditions) ---
  {
    id: "mustard-rj-01",
    crop: "Mustard",
    variety: "Pusa Mustard-25 (NPJ-112)",
    state: "Rajasthan",
    quantity: 18,
    production: 3400000,
    season: "Rabi (Short)",
    durationDays: 110,
    unit: "Tons",
    cost: 14500,
    recommendedZone: "Arid soils, low frost resistance, high oil concentration"
  },
  {
    id: "mustard-up-01",
    crop: "Mustard",
    variety: "Varuna (T-59)",
    state: "Uttar Pradesh",
    quantity: 16,
    production: 1200000,
    season: "Rabi (Short)",
    durationDays: 115,
    unit: "Tons",
    cost: 13800,
    recommendedZone: "Alluvial sandy loams of central districts"
  },
  {
    id: "mustard-hr-01",
    crop: "Mustard",
    variety: "RH-749",
    state: "Haryana",
    quantity: 19,
    production: 980000,
    season: "Rabi (Short)",
    durationDays: 120,
    unit: "Tons",
    cost: 14800,
    recommendedZone: "Southern dry regions, high chemical oil yields"
  },

  // --- CHICKPEA / GRAM (Pulses, nitrogen fixing) ---
  {
    id: "gram-mp-01",
    crop: "Chickpea",
    variety: "Jakhar-9218",
    state: "Madhya Pradesh",
    quantity: 14,
    production: 4200000,
    season: "Rabi (Medium)",
    durationDays: 110,
    unit: "Tons",
    cost: 13000,
    recommendedZone: "Bundelkhand dry loams, black cotton moisture retentive soil"
  },
  {
    id: "gram-rj-01",
    crop: "Chickpea",
    variety: "GNG-1581 (Gangaur)",
    state: "Rajasthan",
    quantity: 12,
    production: 1800000,
    season: "Rabi (Short)",
    durationDays: 105,
    unit: "Tons",
    cost: 12500,
    recommendedZone: "Sparsely irrigated loams, high dry temperature tolerance"
  },
  {
    id: "gram-mh-01",
    crop: "Chickpea",
    variety: "Vijay",
    state: "Maharashtra",
    quantity: 15,
    production: 1500000,
    season: "Rabi (Short)",
    durationDays: 100,
    unit: "Tons",
    cost: 13500,
    recommendedZone: "Western Maharashtra clayey plates, highly wilt resistant"
  },

  // --- SOYBEAN (Kharif oilseed/protein) ---
  {
    id: "soy-mp-01",
    crop: "Soybean",
    variety: "JS 335",
    state: "Madhya Pradesh",
    quantity: 16,
    production: 6500000,
    season: "Kharif (Short)",
    durationDays: 100,
    unit: "Tons",
    cost: 16500,
    recommendedZone: "Malwa & Narmada river valley damp soils, high sunshine days"
  },
  {
    id: "soy-mh-01",
    crop: "Soybean",
    variety: "JS 93-05",
    state: "Maharashtra",
    quantity: 15,
    production: 3800000,
    season: "Kharif (Short)",
    durationDays: 95,
    unit: "Tons",
    cost: 15800,
    recommendedZone: "Marathwada rich basalt plateaus, early maturing"
  },
  {
    id: "soy-rj-01",
    crop: "Soybean",
    variety: "RKS 45",
    state: "Rajasthan",
    quantity: 13,
    production: 950000,
    season: "Kharif (Short)",
    durationDays: 98,
    unit: "Tons",
    cost: 15200,
    recommendedZone: "Southeast plains (Hadoti region), medium textured soil"
  },

  // --- BAJRA / PEARL MILLET (Extremely dry, nutrition rich) ---
  {
    id: "bajra-rj-01",
    crop: "Bajra",
    variety: "Proagro-9444 (Hybrid)",
    state: "Rajasthan",
    quantity: 15,
    production: 4800000,
    season: "Kharif (Short)",
    durationDays: 85,
    unit: "Tons",
    cost: 9500,
    recommendedZone: "Thar Desert borders, extremely low rain, high dunes"
  },
  {
    id: "bajra-up-01",
    crop: "Bajra",
    variety: "Pioneer 86M86",
    state: "Uttar Pradesh",
    quantity: 22,
    production: 1800000,
    season: "Kharif (Short)",
    durationDays: 90,
    unit: "Tons",
    cost: 11000,
    recommendedZone: "Agra-Mathura arid belt, dry hot summer climate"
  },
  {
    id: "bajra-gj-01",
    crop: "Bajra",
    variety: "GHB-558",
    state: "Gujarat",
    quantity: 20,
    production: 1200000,
    season: "Kharif (Short)",
    durationDays: 88,
    unit: "Tons",
    cost: 10500,
    recommendedZone: "Saurashtra and dry sandy loams"
  },

  // --- RAGI / FINGER MILLET (Hilly dry regions) ---
  {
    id: "ragi-ka-01",
    crop: "Ragi",
    variety: "GPU-28",
    state: "Karnataka",
    quantity: 28,
    production: 1600000,
    season: "Kharif (Medium)",
    durationDays: 115,
    unit: "Tons",
    cost: 11000,
    recommendedZone: "Southern Karnataka dry plains (Tumakuru, Kolar red gravel soils)"
  },
  {
    id: "ragi-tn-01",
    crop: "Ragi",
    variety: "CO-15",
    state: "Tamil Nadu",
    quantity: 26,
    production: 320000,
    season: "Kharif (Medium)",
    durationDays: 110,
    unit: "Tons",
    cost: 11500,
    recommendedZone: "Coimbatore and Dharmapuri dry elevations"
  }
];

export const advisoryArticles: AdvisoryArticle[] = [
  {
    id: "art-soil-prep-rice",
    title: "Optimizing Rice Puddling and Water Economy in Punjab and Bengal",
    category: "Soil & Water",
    cropMatch: ["Rice"],
    stateMatch: ["Punjab", "West Bengal", "Andhra Pradesh"],
    content: "Puddling is standard for transplanting puddle-grown rice because it damages soil macropores to limit vertical percolation losses and suppresses weed emergence. However, Pusa Basmati or MTB variety performance in high-drain sites improves significantly by adding organic manure 15 days prior to tillage. Direct Seeded Rice (DSR) is a recommended water-saving substitute that cuts water needs by 20-30% in Punjab plains by skipping conventional puddling, using chemical herbicides (pendimethalin) for initial weed control, and delaying first irrigation to 21 days post-sowing to trigger deep roots.",
    keyTakeaways: [
      "Puddling reduces water percolation, but damages long-term structure for subsequent wheat crops.",
      "Direct Seeded Rice (DSR) saves up to 30% irrigation water in Punjab.",
      "Green manure (Sesbania) incorporation enhances Soil Organic Carbon (SOC) and improves crop density."
    ]
  },
  {
    id: "art-rust-wheat",
    title: "Combating Yellow Rust and Rot in High Yield Wheat (HD-2967)",
    category: "Pest Control",
    cropMatch: ["Wheat"],
    stateMatch: ["Punjab", "Haryana", "Uttar Pradesh"],
    content: "Stripe rust or Yellow Rust (Puccinia striiformis) thrives in cool, damp conditions in Northern India. The variety HD-2967, once fully resilient, has seen regional resistance breakdown. Farmers must inspect crops during late December and early January. Apply propiconazole (Tilt 25 EC @ 0.1%) at the initial emergence of yellow streak pustules on leaves. Avoid over-irrigation during terminal grain-filling phases (late February to March) as this causes lodging, root mold, and waterlogging which significantly reduces production tons.",
    keyTakeaways: [
      "Monitor canopy close closely in early winter months for yellow leaf stripes.",
      "Avoid excess nitrogen fertilizers which heighten lush canopy susceptibility to rust spore germination.",
      "Utilize multi-varietal planting blocks (e.g., HD-2967 mixed with WH-1105) to reduce epidemics."
    ]
  },
  {
    id: "art-sugarcane-roi",
    title: "Drip Irrigation & Nutrient Management to Boost Sugarcane Yield in Maharashtra",
    category: "Soil & Water",
    cropMatch: ["Sugarcane"],
    stateMatch: ["Maharashtra", "Karnataka", "Tamil Nadu"],
    content: "Sugarcane is an extremely water-intensive annual crop, requiring 1500-2500 mm water. Standard flood irrigation leads to severe soil salinization and low sugar recovery rates in Deccan Southern soils. Shifting to subsurface drip irrigation delivers water and water-soluble fertilizers directly to the active root zone, cutting consumption by 45% and increasing cane tonnage by 25%. Adequate potassium application (K2O @ 120 kg/ha) is critical to support osmotic balance, drought tolerance, and rich sucrose accumulation under dry Deccan conditions.",
    keyTakeaways: [
      "Subsurface drip irrigation increases sugar content and prevents soil salinization.",
      "Fertigation with water-soluble urea and potash reduces fertilizer wastage by 40%.",
      "Trash mulching (bagasse or leaf layers) conserves soil moisture and controls early weeds."
    ]
  },
  {
    id: "art-cotton-pest",
    title: "Managing Pink Bollworm and Sucking Pests in Bt Cotton",
    category: "Pest Control",
    cropMatch: ["Cotton"],
    stateMatch: ["Gujarat", "Maharashtra", "Andhra Pradesh"],
    content: "Bt Cotton revolutionized yields in India but remains highly vulnerable to secondary pests like Pink Bollworm (Pectinophora gossypiella) and whiteflies. Integrated Pest Management (IPM) is crucial. Farmers in Gujarat should install pheromone traps (5 per hectare) at 45 days crop age to monitor adult moth activity. If trap catches exceed 8 moths/day for 3 consecutive days, apply neem-based sprays or bio-agents like Trichogramma bactrae. Avoid chemical pyrethroids early in the season as they terminate beneficial predator bugs, causing secondary pest outbreaks.",
    keyTakeaways: [
      "Install pheromone traps early to monitor moth thresholds before spraying heavy chemicals.",
      "Refugium borders (planting non-Bt seeds in boundary rows) delay resistance development.",
      "Neem seed kernel extract (NSKE 5%) is highly effective against early sucking whiteflies."
    ]
  },
  {
    id: "art-millet-dryland",
    title: "Arid Zone Soil Moisture Conservation for Bajra and Ragi",
    category: "Sustainable Farming",
    cropMatch: ["Bajra", "Ragi"],
    stateMatch: ["Rajasthan", "Karnataka", "Gujarat", "Tamil Nadu"],
    content: "Millet cultivation is the backbone of food security in dryland India. Bajra in western Rajasthan and Ragi in Tumakuru (Karnataka) are highly resilient but benefit immensely from simple water harvesting modules. Intercropping Bajra with nitrogen-fixing pulses like Moth bean or Cowpea (ratio 2:1) reduces financial risks of monsoon failure and enriches soil nitrogen reserves. Adopt micro-furrows during sowing to collect fleeting rainwater and divert it directly into seed rows, enhancing seed emergence rates by 25%.",
    keyTakeaways: [
      "Pulse intercropping (e.g., Pearl Millet + Cowpea) guarantees income during drought years.",
      "Bund building and shallow digging before monsoons capture maximum surface runoff.",
      "Bio-fertilizers like Azospirillum and Phosphobacteria improve nutrient uptake in coarse soils."
    ]
  },
  {
    id: "art-finance-loans",
    title: "Navigating Agriculture Credit, Crop Insurance, and Cost Management",
    category: "Financial Advice",
    content: "The Cost of Cultivation varies highly between labor-intensive rice/sugarcane and low-maintenance millets/oilseeds. Indian farmers can manage risks through the Pradhan Mantri Fasal Bima Yojana (PMFBY), with subsidized premium caps of 1.5% for Rabi crops, 2% for Kharif, and 5% for commercial cash crops (Cotton, Sugarcane). Leverage the Kisan Credit Card (KCC) for crop cultivation loans offering interest subvention schemes which bring effective interest rates down to 4% for timely repayments, preventing high-interest informal loans.",
    keyTakeaways: [
      "Utilize Kisan Credit Cards (KCC) for low-interest cultivation capital (4% rate).",
      "Sow certified seeds from state corporations (e.g., NSC) for subsidized rates and seed guarantee.",
      "Purchase PMFBY crop insurance prior to sowing seasons to guard against extreme weather disasters."
    ]
  }
];
