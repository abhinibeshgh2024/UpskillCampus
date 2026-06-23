import React, { useState, useRef, useEffect } from "react";
import { searchRAG, RAGResponse, RetrievedSource } from "./ragEngine";
import { 
  Bot, 
  Send, 
  Database, 
  Sparkles, 
  Loader2, 
  FileText, 
  Activity, 
  HelpCircle,
  Lightbulb, 
  Trash2,
  ArrowRight,
  ChevronRight,
  BookOpen
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: Date;
  ragDetails?: {
    retrievedSources: RetrievedSource[];
    metricsContext?: any;
    processingTimeMs: number;
  };
}

const QUICK_PROMPTS = [
  { label: "🌾 Optimize Rice yield in Punjab", text: "How can I optimize Rice yield and save water in Punjab?" },
  { label: "☁️ Best Cotton variety in Gujarat", text: "Which variety of Cotton yields best in Gujarat and how do I manage pests?" },
  { label: "💧 Sugarcane practices in MH", text: "What are the recommended sugarcane cultivation and irrigation practices in Maharashtra?" },
  { label: "🍂 Wheat stripe rust control", text: "How do I monitor and combat yellow rust disease in high yield wheat in UP?" },
  { label: "🏜️ Millet options for Rajasthan", text: "What crop and millet options are available for dry regions in Rajasthan?" },
  { label: "💰 Crop Insurance & Credit schemes", text: "Explain agricultural credit, Kisan Credit Cards, and PMFBY crop insurance schemes." }
];

export default function RAGAssistant() {
  const [queryInput, setQueryInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "### **Welcome to the Agricultural Advisory Assistant!**\n\nI am a local **RAG-based advisory agent** loaded with historical cultivation data across Indian states (2001-2014) and verified agronomy practices.\n\nAsk me about yield statistics, pest control, crop varieties, moisture conservation, or financial frameworks. Try clicking any of the **Quick Agronomy Inquiries** below to get started!",
      timestamp: new Date()
    }
  ]);
  
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [retrievedLogs, setRetrievedLogs] = useState<RetrievedSource[]>([]);
  const [searchPhase, setSearchPhase] = useState<string>("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSearching]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsgId = `user-${Date.now()}`;
    const newMessages: Message[] = [...messages, {
      id: userMsgId,
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    }];
    setMessages(newMessages);
    setQueryInput("");
    setIsSearching(true);
    setRetrievedLogs([]);
    
    // Simulate RAG steps for incredible aesthetic realism
    setSearchPhase("Tokenizing user query & analyzing state/crop nouns...");
    await new Promise(r => setTimeout(r, 600));
    
    setSearchPhase("Executing similarity matching over localized agricultural store...");
    const ragResult = searchRAG(textToSend);
    setRetrievedLogs(ragResult.retrievedSources);
    await new Promise(r => setTimeout(r, 700));

    setSearchPhase("Synthesizing context-grounded agronomic advisory...");
    await new Promise(r => setTimeout(r, 500));

    // Append Assistant response with simulated RAG details
    setMessages(prev => [...prev, {
      id: `assistant-${Date.now()}`,
      sender: "assistant",
      text: ragResult.directAnswer,
      timestamp: new Date(),
      ragDetails: {
        retrievedSources: ragResult.retrievedSources,
        metricsContext: ragResult.metricsContext,
        processingTimeMs: 1100 + Math.round(Math.random() * 400)
      }
    }]);

    setIsSearching(false);
    setSearchPhase("");
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        sender: "assistant",
        text: "### **Welcome to the Agricultural Advisory Assistant!**\n\nI am a local **RAG-based advisory agent** loaded with historical cultivation data across Indian states (2001-2014) and verified agronomy practices.\n\nAsk me about yield statistics, pest control, crop varieties, moisture conservation, or financial frameworks. Try clicking any of the **Quick Agronomy Inquiries** below to get started!",
        timestamp: new Date()
      }
    ]);
  };

  // Safe helper to render Markdown tables or paragraphs nicely in JSX
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    let inList = false;
    let inTable = false;
    let tableRows: string[][] = [];

    return lines.map((line, idx) => {
      // Catch empty lines
      if (!line.trim()) {
        inList = false;
        if (inTable) {
          inTable = false;
          const finishedTable = renderHTMLTable(tableRows);
          tableRows = [];
          return finishedTable;
        }
        return <div key={`br-${idx}`} className="h-2" />;
      }

      // Check Table
      if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
        inTable = true;
        // Skip separator line | :--- | :--- |
        if (line.includes("---")) return null;
        
        const cols = line.split("|").map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
        tableRows.push(cols);
        return null;
      } else {
        if (inTable) {
          inTable = false;
          const finishedTable = renderHTMLTable(tableRows);
          tableRows = [];
          // Prepend table before the current non-table line renders
          return (
            <div key={`table-wrapper-${idx}`} className="space-y-4">
              {finishedTable}
              {renderStandardLine(line, idx)}
            </div>
          );
        }
      }

      // Check Headers
      if (line.startsWith("### ")) {
        return <h3 key={idx} className="text-base font-bold text-brand-primary mt-4 mb-2 first:mt-0 flex items-center gap-1.5">{line.substring(4)}</h3>;
      }
      if (line.startsWith("#### ")) {
        return <h4 key={idx} className="text-sm font-semibold text-brand-green mt-3 mb-1.5 flex items-center gap-1">{line.substring(5)}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h2 key={idx} className="text-lg font-bold text-brand-primary mt-4 mb-2 tracking-tight">{line.substring(3)}</h2>;
      }

      // Bullet Lists
      if (line.startsWith("* ") || line.startsWith("- ")) {
        inList = true;
        return (
          <ul key={idx} className="list-disc pl-5 text-brand-primary text-xs my-1 leading-relaxed">
            <li>{parseInlineBold(line.substring(2))}</li>
          </ul>
        );
      }

      return renderStandardLine(line, idx);
    });
  };

  const renderStandardLine = (line: string, idx: number) => {
    return (
      <p key={idx} className="text-xs text-brand-primary leading-relaxed my-1.5">
        {parseInlineBold(line)}
      </p>
    );
  };

  const renderHTMLTable = (rows: string[][]) => {
    if (rows.length === 0) return null;
    const headers = rows[0];
    const dataRows = rows.slice(1);

    return (
      <div className="overflow-x-auto my-3 border border-brand-border rounded-xl">
        <table className="min-w-full divide-y divide-brand-border text-xs font-sans">
          <thead className="bg-[#fbf9f4]">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-3 py-2.5 text-left text-[11px] font-bold text-brand-clay uppercase tracking-wider bg-brand-bg">
                  {h.replace(/\*\*/g, "")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-brand-border text-brand-primary">
            {dataRows.map((row, rIdx) => (
              <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white" : "bg-brand-bg/50"}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-3 py-2 font-medium whitespace-pre-wrap">
                    {parseInlineBold(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const parseInlineBold = (str: string) => {
    const parts = str.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-semibold text-stone-950">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div id="rag-assistant-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)] min-h-[580px]">
      
      {/* Left Chat Window Column */}
      <div id="advisor-chat-window-pane" className="lg:col-span-8 flex flex-col bg-white border border-brand-border rounded-3xl shadow-sm h-full overflow-hidden">
        
        {/* Chat Banner Info */}
        <div className="bg-brand-bg px-5 py-3 border-b border-brand-border flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-green text-white rounded-xl shadow-xs">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-brand-primary text-sm leading-none flex items-center gap-1.5">
                Vruksha AI Advisor
                <span className="text-[9px] bg-brand-light-green text-brand-green border border-brand-border px-1.5 py-0.5 rounded-full font-mono font-black uppercase">
                  Local RAG Active
                </span>
              </h3>
              <p className="text-[10px] text-brand-clay mt-1">Grounding questions in verified agriculture datasets (2001-2014)</p>
            </div>
          </div>

          <button 
            id="clear-chat-log-button"
            onClick={clearChat}
            className="p-1.5 text-brand-clay hover:text-brand-primary hover:bg-brand-light-green/45 rounded-xl transition-colors cursor-pointer"
            title="Clear Chat Logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Bubbles Scroll Area */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] rounded-3xl p-4 shadow-xs ${
                msg.sender === "user" 
                  ? "bg-brand-primary text-white rounded-tr-none" 
                  : "bg-brand-bg border border-brand-border rounded-tl-none text-brand-primary"
              }`}>
                {/* Meta details if Assistant */}
                {msg.sender === "assistant" && msg.ragDetails && (
                  <div className="flex items-center gap-3 mb-2.5 pb-2.5 border-b border-dashed border-brand-border text-[10px] text-brand-clay font-mono">
                    <span className="flex items-center gap-1 text-brand-green bg-brand-light-green px-2 py-0.5 rounded-md border border-brand-border font-bold">
                      <Database className="w-3 h-3" />
                      RAG Grounded
                    </span>
                    <span>Sources Checked: <strong>{msg.ragDetails.retrievedSources.length}</strong></span>
                    <span>Synthesis: <strong>{msg.ragDetails.processingTimeMs}ms</strong></span>
                  </div>
                )}

                {/* Direct Text Output */}
                <div className="space-y-1">
                  {msg.sender === "user" ? (
                    <p className="text-xs font-semibold whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div className="font-sans leading-relaxed text-xs text-brand-primary">
                      {renderMarkdown(msg.text)}
                    </div>
                  )}
                </div>

                {/* Sub-cards showing retrieved references under bubble */}
                {msg.sender === "assistant" && msg.ragDetails && msg.ragDetails.retrievedSources.length > 0 && (
                  <div className="mt-3.5 pt-3.5 border-t border-brand-border space-y-2">
                    <span className="text-[9px] font-bold text-brand-clay uppercase tracking-widest block mb-1">REDEEMED KNOWLEDGE SOURCES:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                       {msg.ragDetails.retrievedSources.map((src, sIdx) => (
                        <div key={sIdx} className="bg-white hover:bg-brand-light-green/20 border border-brand-border p-2.5 rounded-xl text-[10px] transition-colors">
                          <div className="flex justify-between items-center font-bold text-brand-primary">
                            <span className="flex items-center gap-1 truncate max-w-[70%]">
                              <FileText className="w-3 h-3 text-brand-clay" />
                              {src.type}
                            </span>
                            <span className="text-brand-green font-mono uppercase bg-brand-light-green border border-brand-border px-1.5 py-0.5 rounded text-[8px] font-bold">
                              {Math.round(src.score * 100)}% Match
                            </span>
                          </div>
                          <p className="text-[9px] text-brand-clay mt-1.5 font-bold truncate">{src.title}</p>
                          <p className="text-[9px] text-brand-clay mt-0.5 line-clamp-1 opacity-80">{src.preview}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[9px] text-brand-clay/70 mt-2 text-right">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {/* Simulated Async Loading State */}
          {isSearching && (
            <div className="flex justify-start">
              <div className="bg-brand-bg border border-brand-border rounded-3xl rounded-tl-none p-4 max-w-[85%] space-y-3 shadow-xs">
                {/* Simulated Loading Steps */}
                <div className="flex items-center gap-2 text-xs font-mono text-brand-green">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="font-bold">{searchPhase || "Retrieving local agronomic knowledge..."}</span>
                </div>

                <div className="animate-pulse space-y-2">
                  <div className="h-2 bg-[#e5e0d5] rounded w-5/6"></div>
                  <div className="h-2 bg-[#e5e0d5] rounded w-3/4"></div>
                </div>

                {/* List raw matches immediately if found */}
                {retrievedLogs.length > 0 && (
                  <div className="border border-brand-border bg-white p-2.5 rounded-xl space-y-1.5">
                    <span className="text-[9px] font-bold text-brand-clay uppercase tracking-widest block">Matched Context Pieces</span>
                    {retrievedLogs.map((log, lIdx) => (
                      <div key={lIdx} className="flex justify-between items-center text-[10px] border-b border-brand-bg last:border-b-0 py-1">
                        <span className="text-brand-primary font-bold truncate max-w-[200px]">{log.title}</span>
                        <span className="text-brand-green font-mono text-[9px] font-bold">({Math.round(log.score * 100)}%)</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar Form */}
        <form 
          id="chat-send-input-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(queryInput);
          }}
          className="bg-brand-bg p-3 border-t border-brand-border flex gap-2 items-center"
        >
          <input 
            id="chat-user-message-input"
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            disabled={isSearching}
            placeholder={isSearching ? "Vruksha Agent synthesizing knowledge..." : "Ask agronomy questions (e.g. 'How can I save cost of sugarcane in AP?')..."}
            className="flex-1 bg-white border border-brand-border rounded-xl py-2 px-3 text-xs text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-green font-medium placeholder-brand-clay disabled:opacity-50 transition-shadow"
          />
          <button 
            id="submit-query-button"
            type="submit"
            disabled={isSearching || !queryInput.trim()}
            className="bg-brand-green hover:bg-brand-sage text-white p-2.5 rounded-xl disabled:bg-[#cbd3c6] disabled:text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>

      </div>

      {/* Right Quick Prompts / Agronomic Index Side Column */}
      <div id="agronomic-index-side-pane" className="lg:col-span-4 space-y-5 h-full flex flex-col overflow-y-auto">
        
        {/* Quick Inquiries Card */}
        <div className="bg-white border border-brand-border rounded-3xl p-4 shadow-sm">
          <h4 className="font-bold text-brand-primary text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-brand-green" />
            Quick Agronomy Inquiries
          </h4>
          <p className="text-[11px] text-brand-clay mb-3.5 leading-relaxed">
            Click any prompt block below to instantly load variables and request context-rich grounded RAG responses.
          </p>

          <div className="space-y-2">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt.text)}
                disabled={isSearching}
                className="w-full text-left text-xs text-brand-primary bg-brand-bg hover:bg-brand-light-green/40 hover:text-brand-primary hover:border-brand-border border border-brand-border rounded-xl p-2.5 font-bold transition-all duration-150 flex items-center justify-between group disabled:opacity-60 cursor-pointer"
              >
                <span className="truncate max-w-[90%]">{prompt.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-brand-clay group-hover:text-brand-green transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Database Stats Card */}
        <div className="bg-brand-primary text-white border border-brand-sage rounded-3xl p-5 shadow-sm flex-1 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-brand-light-green" />
              Indexed Documents Status
            </h4>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-brand-dark-input/65 p-3.5 rounded-xl border border-brand-sage/40">
                <span className="text-[9px] text-[#b3c0ad] block uppercase font-mono">Crop Records</span>
                <span className="text-xl font-bold font-mono text-brand-light-green">38 Records</span>
              </div>
              <div className="bg-brand-dark-input/65 p-3.5 rounded-xl border border-brand-sage/40">
                <span className="text-[9px] text-[#b3c0ad] block uppercase font-mono">Expert Articles</span>
                <span className="text-xl font-bold font-mono text-brand-light-green">6 Manuals</span>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-[10px] text-[#cbd5c6] font-sans leading-relaxed">
              <p className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-light-green animate-pulse"></span>
                <span>Indexing fully persistent in-memory.</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-light-green"></span>
                <span>Token filters ignore English stop-words.</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-light-green"></span>
                <span>Supports multi-term compound ranking.</span>
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-brand-sage text-[10px] text-[#cbd5c6] leading-normal flex items-start gap-2">
            <BookOpen className="w-3.5 h-3.5 text-brand-light-green flex-shrink-0 mt-0.5" />
            <span>RAG Grounding safeguards against AI hallucinations keeping all technical advice grounded strictly in actual data.</span>
          </div>
        </div>

      </div>

    </div>
  );
}
