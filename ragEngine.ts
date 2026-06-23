import { cropData, advisoryArticles, CropRecord, AdvisoryArticle } from "./cropDataset";

export interface RetrievedSource {
  title: string;
  type: "Crop Data Record" | "Advisory Article";
  score: number; // 0 to 1
  preview: string;
  originalId: string;
}

export interface RAGResponse {
  query: string;
  directAnswer: string;
  retrievedSources: RetrievedSource[];
  metricsContext?: {
    crop?: string;
    state?: string;
    avgYield?: number;
    variety?: string;
    cost?: number;
    recommendedZone?: string;
  };
  cropCalculators?: CropRecord[];
}

// Stop words to clean queries
const STOP_WORDS = new Set([
  "how", "what", "why", "where", "when", "which", "who", "whom", "whose",
  "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
  "do", "does", "did", "to", "the", "in", "of", "a", "an", "and", "or",
  "for", "about", "with", "by", "on", "at", "to", "from", "me", "my", "your"
]);

export function cleanAndTokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
}

export function searchRAG(query: string): RAGResponse {
  const tokens = cleanAndTokenize(query);
  
  if (tokens.length === 0) {
    return {
      query,
      directAnswer: "Please ask a specific agriculture query, such as 'How can I increase Rice yield in Punjab?', 'Best variety of Cotton in Gujarat', or 'Recommend a high-yield Rabi crop with low cost'.",
      retrievedSources: []
    };
  }

  // Score Crop Records
  const scoredCrops = cropData.map(record => {
    let score = 0;
    const cropLower = record.crop.toLowerCase();
    const stateLower = record.state.toLowerCase();
    const varietyLower = record.variety.toLowerCase();
    const seasonLower = record.season.toLowerCase();
    const zoneLower = record.recommendedZone.toLowerCase();

    tokens.forEach(token => {
      if (cropLower.includes(token)) score += 3.5;
      if (stateLower.includes(token)) score += 3.0;
      if (varietyLower.includes(token)) score += 2.5;
      if (seasonLower.includes(token)) score += 1.5;
      if (zoneLower.includes(token)) score += 1.0;
    });

    // Normalize score
    const maxPossible = tokens.length * 3.5;
    const normalizedScore = maxPossible > 0 ? Math.min(score / maxPossible, 1.0) : 0;

    return { record, score: normalizedScore };
  }).filter(item => item.score > 0.15);

  // Score Advisory Articles
  const scoredArticles = advisoryArticles.map(article => {
    let score = 0;
    const titleLower = article.title.toLowerCase();
    const contentLower = article.content.toLowerCase();
    
    tokens.forEach(token => {
      if (titleLower.includes(token)) score += 4.0;
      if (contentLower.includes(token)) score += 1.5;
      
      // Match crop list
      if (article.cropMatch?.some(c => c.toLowerCase().includes(token))) {
        score += 3.0;
      }
      // Match state list
      if (article.stateMatch?.some(s => s.toLowerCase().includes(token))) {
        score += 2.5;
      }
    });

    const maxPossible = tokens.length * 4.0;
    const normalizedScore = maxPossible > 0 ? Math.min(score / maxPossible, 1.0) : 0;

    return { article, score: normalizedScore };
  }).filter(item => item.score > 0.15);

  // Sort them
  scoredCrops.sort((a, b) => b.score - a.score);
  scoredArticles.sort((a, b) => b.score - a.score);

  // Take top sources for display
  const retrievedSources: RetrievedSource[] = [];
  
  scoredCrops.slice(0, 2).forEach(item => {
    retrievedSources.push({
      title: `${item.record.state} ${item.record.crop} (${item.record.variety})`,
      type: "Crop Data Record",
      score: Math.round(item.score * 100) / 100,
      preview: `Yield: ${item.record.quantity} Qtl/Ha | Cost: ₹${item.record.cost}/Ha | Zone: ${item.record.recommendedZone}`,
      originalId: item.record.id
    });
  });

  scoredArticles.slice(0, 2).forEach(item => {
    retrievedSources.push({
      title: item.article.title,
      type: "Advisory Article",
      score: Math.round(item.score * 100) / 100,
      preview: item.article.content.slice(0, 150) + "...",
      originalId: item.article.id
    });
  });

  // Sort sources by score
  retrievedSources.sort((a, b) => b.score - a.score);

  // Determine key matched subjects
  const primeCrop = scoredCrops[0]?.record.crop;
  const primeState = scoredCrops[0]?.record.state || scoredArticles[0]?.article.stateMatch?.[0];
  const primeRecord = scoredCrops[0]?.record;
  const primeArticle = scoredArticles[0]?.article;

  // Synthesize Direct Response
  let directAnswer = "";

  if (primeRecord && primeArticle) {
    directAnswer = `### **Advisory Insights for ${primeRecord.crop} in ${primeRecord.state}**\n\n`;
    directAnswer += `Based on our integrated RAG database, **${primeRecord.crop}** cultivation in **${primeRecord.state}** yields an average of **${primeRecord.quantity} Quintals/Hectare (Qtl/Ha)** using the recommended **${primeRecord.variety}** variety. The typical cost of cultivation is estimated at **₹${primeRecord.cost} per Hectare**, and it matures in a cycle of **${primeRecord.durationDays} days** during the **${primeRecord.season}** season.\n\n`;
    
    directAnswer += `#### **Key Agronomic Recommendations:**\n`;
    directAnswer += `* **Favorable agro-climatic corridor:** ${primeRecord.recommendedZone}.\n`;
    directAnswer += `* **Field Practice:** ${primeArticle.content}\n\n`;
    
    if (primeArticle.keyTakeaways.length > 0) {
      directAnswer += `#### **Actionable Takeaways for Farmers:**\n`;
      primeArticle.keyTakeaways.forEach(takeaway => {
        directAnswer += `* ${takeaway}\n`;
      });
    }
  } else if (primeRecord) {
    directAnswer = `### **Data Profile: ${primeRecord.crop} in ${primeRecord.state}**\n\n`;
    directAnswer += `We retrieved a highly relevant crop parameter profile for **${primeRecord.crop}** in **${primeRecord.state}**:\n\n`;
    directAnswer += `| Metric / Parameter | Value / Recommendation |\n`;
    directAnswer += `| :--- | :--- |\n`;
    directAnswer += `| **Recommended Variety** | ${primeRecord.variety} |\n`;
    directAnswer += `| **Average Base Yield** | ${primeRecord.quantity} Qtl/Ha |\n`;
    directAnswer += `| **Cultivation Cost** | ₹${primeRecord.cost} per Hectare |\n`;
    directAnswer += `| **Sowing Season** | ${primeRecord.season} |\n`;
    directAnswer += `| **Harvest Duration** | ~${primeRecord.durationDays} days |\n`;
    directAnswer += `| **Recommended Soil/Ecozone** | ${primeRecord.recommendedZone} |\n\n`;
    directAnswer += `You can use our **Interactive Production Predictor** on the left dashboard tab to simulate dynamic acreages with this crop profiles to calculate exact tons, cost outlays, and net earnings.`;
  } else if (primeArticle) {
    directAnswer = `### **Expert Advisory: ${primeArticle.title}**\n\n`;
    directAnswer += `${primeArticle.content}\n\n`;
    
    if (primeArticle.keyTakeaways.length > 0) {
      directAnswer += `#### **Agronomist Fast Checklist:**\n`;
      primeArticle.keyTakeaways.forEach(takeaway => {
        directAnswer += `* ${takeaway}\n`;
      });
    }
  } else {
    // General match fallback
    directAnswer = `### **Agricultural Resource Response**\n\n`;
    directAnswer += `I found some information related to your search context **"${query}"** in our Indian agricultural dataset:\n\n`;
    
    const relatedCrops = Array.from(new Set(cropData.filter(c => 
      tokens.some(t => c.crop.toLowerCase().includes(t) || c.state.toLowerCase().includes(t))
    ).map(c => `${c.variety} (${c.crop}) in ${c.state}`)));

    if (relatedCrops.length > 0) {
      directAnswer += `**Relevant Crop Varieties Indexed:**\n`;
      relatedCrops.slice(0, 5).forEach(c => {
        directAnswer += `* **${c}**\n`;
      });
      directAnswer += `\n`;
    }

    const generalArticle = advisoryArticles.find(a => 
      a.category === "Financial Advice" || a.category === "Sustainable Farming"
    );

    if (generalArticle) {
      directAnswer += `#### **Recommended Standard Practices:**\n`;
      directAnswer += `${generalArticle.content}\n\n`;
      directAnswer += `**Advice Checklist:**\n`;
      generalArticle.keyTakeaways.forEach(t => {
        directAnswer += `* ${t}\n`;
      });
    } else {
      directAnswer += `Our database tracks production records across India between 2001 and 2014, covering states such as Punjab, UP, Maharashtra, and Karnataka, as well as crops like Rice, Wheat, Cotton, Sugarcane, and Millets. Try refining your question with specific states or crops for detailed technical summaries and financial yield forecasts!`;
    }
  }

  return {
    query,
    directAnswer,
    retrievedSources,
    metricsContext: primeRecord ? {
      crop: primeRecord.crop,
      state: primeRecord.state,
      avgYield: primeRecord.quantity,
      variety: primeRecord.variety,
      cost: primeRecord.cost,
      recommendedZone: primeRecord.recommendedZone
    } : undefined,
    cropCalculators: scoredCrops.map(sc => sc.record).slice(0, 3)
  };
}
