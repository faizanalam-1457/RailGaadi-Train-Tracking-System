'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  Sparkles,
  Bot,
  User,
  Zap,
  Download,
  Settings,
  RefreshCw,
  Sliders,
  Terminal,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  model?: string;
  responseTimeMs?: number;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

const NVIDIA_MODELS = [
  {
    id: 'meta/llama-3.2-11b-vision-instruct',
    name: 'Llama 3.2 11B Vision & General AI',
    provider: 'Meta / NVIDIA NIM',
    desc: 'High-performance general intelligence and multi-modal model',
    badge: 'Flagship AI',
    isDefault: true,
  },
  {
    id: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning',
    name: 'NVIDIA Nemotron 30B Reasoning',
    provider: 'NVIDIA AI',
    desc: 'Specialized for complex reasoning, logic, and analytical tasks',
    badge: 'NVIDIA Reasoning',
    isDefault: false,
  },
  {
    id: 'nvidia/nemotron-3-super-120b-a12b',
    name: 'NVIDIA Nemotron 120B Super',
    provider: 'NVIDIA AI',
    desc: 'Large parameter NVIDIA foundation model for comprehensive answers',
    badge: '120B Super',
    isDefault: false,
  },
];

const STARTER_PROMPTS = [
  {
    title: 'Rail Tech & Safety',
    prompt: 'Explain how India’s KAVACH Automatic Train Protection (ATP) anti-collision technology works at an architectural level.',
    icon: Zap,
  },
  {
    title: 'Code & Automation',
    prompt: 'Write a Python script that parses train schedule JSON and calculates average delay analytics per station.',
    icon: Terminal,
  },
  {
    title: 'High-Speed Rail Analysis',
    prompt: 'Compare the technical specifications and energy efficiency of Vande Bharat Express vs Japan Shinkansen Bullet Train.',
    icon: Sparkles,
  },
  {
    title: 'General Knowledge & Logic',
    prompt: 'Provide a comprehensive breakdown of Quantum Computing applications in logistics and transport routing.',
    icon: Cpu,
  },
];

export function GeneralIntelligenceClient() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('meta/llama-3.2-11b-vision-instruct');
  const [systemPrompt, setSystemPrompt] = useState(
    'You are a world-class General Intelligence AI Assistant powered by NVIDIA NIM API. You excel at complex reasoning, coding, science, mathematics, literature, and in-depth analytical questions. Deliver clear, detailed, and formatted responses.'
  );
  const [showSettings, setShowSettings] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('railgaadi_general_ai_history');
      if (saved) {
        const parsed: ChatSession[] = JSON.parse(saved);
        if (parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to load chat history:', e);
    }

    // Default new session if empty
    createNewSession();
  }, []);

  // Save to localStorage on sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      try {
        localStorage.setItem('railgaadi_general_ai_history', JSON.stringify(sessions));
      } catch (e) {
        console.error('Failed to save chat history:', e);
      }
    }
  }, [sessions]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, activeSessionId, isLoading]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = activeSession?.messages || [];

  const createNewSession = () => {
    const newId = `session_${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'New Intelligence Conversation',
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    if (activeSessionId === id) {
      if (updated.length > 0) {
        setActiveSessionId(updated[0].id);
      } else {
        createNewSession();
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || isLoading) return;

    setInput('');

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Update session title if first query
    const isFirstMsg = messages.length === 0;
    const sessionTitle = isFirstMsg
      ? queryText.slice(0, 35) + (queryText.length > 35 ? '...' : '')
      : activeSession?.title || 'General Chat';

    // Add user message to state
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            title: sessionTitle,
            messages: [...s.messages, userMessage],
          };
        }
        return s;
      })
    );

    setIsLoading(true);

    try {
      const historyForApi = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      historyForApi.push({ role: 'user', content: queryText });

      const res = await fetch('/api/ai/nvidia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyForApi,
          model: selectedModel,
          systemInstruction: systemPrompt,
        }),
      });

      const json = await res.json();

      if (json.success && json.data?.reply) {
        const assistantMsg: Message = {
          id: `msg_ai_${Date.now()}`,
          role: 'assistant',
          content: json.data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: json.data.model || selectedModel,
          responseTimeMs: json.data.responseTimeMs,
        };

        setSessions((prev) =>
          prev.map((s) => {
            if (s.id === activeSessionId) {
              return {
                ...s,
                messages: [...s.messages, assistantMsg],
              };
            }
            return s;
          })
        );
      } else {
        throw new Error(json.error?.message || 'Failed to fetch response');
      }
    } catch (err: any) {
      console.error('Chat submit error:', err);
      const errorMsg: Message = {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Connection Error**: ${err.message || 'Unable to connect to NVIDIA API endpoint.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: [...s.messages, errorMsg],
            };
          }
          return s;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const exportChatMarkdown = () => {
    if (!messages.length) return;
    const md = messages
      .map((m) => `### ${m.role === 'user' ? 'User' : 'NVIDIA AI'}\n${m.content}\n`)
      .join('\n---\n\n');

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeSession?.title || 'general_ai_chat'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] w-full rounded-2xl overflow-hidden glass-panel border border-slate-200/80 dark:border-slate-800/80 shadow-2xl">
      {/* Left Sidebar - Chat History & Config */}
      <aside className="hidden md:flex w-72 flex-col bg-slate-900/90 text-slate-100 border-r border-slate-800 p-3 justify-between">
        <div className="flex flex-col gap-3 overflow-hidden flex-1">
          {/* Header & New Chat Button */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-100">
              <Cpu className="h-5 w-5 text-emerald-400" />
              <span>NVIDIA General AI</span>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              title="AI System Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={createNewSession}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rail-blue to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-semibold text-xs transition-all shadow-md active:scale-98"
          >
            <Plus className="h-4 w-4" />
            <span>New General AI Chat</span>
          </button>

          {/* Model Selector Card */}
          <div className="bg-slate-850/80 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Active NVIDIA Model</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                GPU NIM
              </span>
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-lg text-xs p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {NVIDIA_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.badge})
                </option>
              ))}
            </select>
          </div>

          {/* Chat History List */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 pt-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">
              Recent Chats
            </span>
            {sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={cn(
                    'group flex items-center justify-between gap-2 p-2 rounded-xl text-xs font-medium cursor-pointer transition-all',
                    isActive
                      ? 'bg-slate-800 text-emerald-300 font-semibold border border-slate-700'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 text-slate-500 group-hover:text-emerald-400" />
                    <span className="truncate">{session.title}</span>
                  </div>
                  {sessions.length > 1 && (
                    <button
                      onClick={(e) => deleteSession(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 text-center">
          Powered by NVIDIA NIM API Microservices
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-slate-950/40 dark:bg-slate-950/80 relative overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b border-slate-200/50 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between bg-white/60 dark:bg-slate-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>General Intelligence</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono">
                  NVIDIA NIM
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Powered by Meta Llama 3.3 70B & NVIDIA GPU Microservices
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={exportChatMarkdown}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                title="Export Chat as Markdown"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>
            )}
            <button
              onClick={createNewSession}
              className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rail-blue text-white text-xs font-medium"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New</span>
            </button>
          </div>
        </header>

        {/* System Prompt Settings Drawer (if open) */}
        {showSettings && (
          <div className="p-4 bg-slate-900 text-white border-b border-slate-800 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-emerald-400" />
                <span>Custom General Intelligence System Instructions</span>
              </label>
              <button
                onClick={() => setShowSettings(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Done
              </button>
            </div>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              placeholder="Enter system prompt for AI..."
            />
          </div>
        )}

        {/* Message Feed / Workspace */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.length === 0 ? (
            /* Starter Recommendation Cards */
            <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center py-8">
              <div className="h-16 w-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center text-white shadow-xl mb-4 animate-bounce">
                <Sparkles className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                NVIDIA General Intelligence Studio
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-8 max-w-lg">
                Ask anything — from general knowledge, logic reasoning, and code architecture to in-depth Indian Railways telemetry analysis.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                {STARTER_PROMPTS.map((starter, idx) => {
                  const Icon = starter.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(starter.prompt)}
                      className="group p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/50 hover:shadow-lg transition-all flex flex-col justify-between gap-3 text-left"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {starter.title}
                        </span>
                        <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        "{starter.prompt}"
                      </p>
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                        <span>Ask AI</span>
                        <ChevronRight className="h-3 w-3" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={cn('flex gap-3 max-w-3xl mx-auto', isUser ? 'justify-end' : 'justify-start')}
                >
                  {!isUser && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-sm mt-1">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div className="space-y-1 max-w-[85%] sm:max-w-[80%]">
                    {/* Header */}
                    <div className={cn('flex items-center gap-2 text-[10px] text-slate-400 px-1', isUser && 'justify-end')}>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        {isUser ? 'You' : 'NVIDIA AI'}
                      </span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                      {msg.responseTimeMs && (
                        <span className="font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                          {msg.responseTimeMs}ms
                        </span>
                      )}
                    </div>

                    {/* Bubble Content */}
                    <div
                      className={cn(
                        'p-4 rounded-2xl text-xs leading-relaxed shadow-sm transition-all',
                        isUser
                          ? 'bg-rail-blue text-white rounded-tr-none'
                          : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                      )}
                    >
                      <div className="whitespace-pre-wrap font-sans break-words">{msg.content}</div>

                      {!isUser && (
                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-mono text-[9px] truncate max-w-[180px]">
                            {msg.model || selectedModel}
                          </span>
                          <button
                            onClick={() => copyToClipboard(msg.content, msg.id)}
                            className="flex items-center gap-1 hover:text-slate-200 transition-colors p-1"
                          >
                            {copiedMsgId === msg.id ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {isUser && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-200 shadow-sm mt-1">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {isLoading && (
            <div className="flex gap-3 max-w-3xl mx-auto">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm animate-pulse">
                <Cpu className="h-4 w-4" />
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-500" />
                <span>NVIDIA NIM GPU microservice synthesizing intelligent response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer Form */}
        <footer className="p-3 sm:p-4 border-t border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 max-w-3xl mx-auto"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask NVIDIA General Intelligence anything..."
              className="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-10 sm:h-11 w-10 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 shrink-0"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </form>
          <p className="text-[10px] text-center text-slate-400 mt-2 font-mono">
            Powered by NVIDIA API NIM Cloud Infrastructure & Meta Llama 3.3
          </p>
        </footer>
      </main>
    </div>
  );
}
