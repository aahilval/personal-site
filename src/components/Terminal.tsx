"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";

interface TerminalLine {
  type: "input" | "output" | "ascii" | "system" | "link";
  content: string;
  color?: string;
}

interface TerminalProps {
  onOpenProject: (projectId: string) => void;
  onCloseProject: () => void;
}

const ASCII_NAME = [
  "  █████╗  █████╗ ██╗  ██╗██╗██╗",
  " ██╔══██╗██╔══██╗██║  ██║██║██║",
  " ███████║███████║███████║██║██║",
  " ██╔══██║██╔══██║██╔══██║██║██║",
  " ██║  ██║██║  ██║██║  ██║██║███████╗",
  " ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝",
  "",
  " ██╗   ██╗ █████╗ ██╗     ██╗      ██╗ █████╗ ███╗   ██╗██╗",
  " ██║   ██║██╔══██╗██║     ██║      ██║██╔══██╗████╗  ██║██║",
  " ██║   ██║███████║██║     ██║      ██║███████║██╔██╗ ██║██║",
  " ╚██╗ ██╔╝██╔══██║██║     ██║      ██║██╔══██║██║╚██╗██║██║",
  "  ╚████╔╝ ██║  ██║███████╗███████╗██║██║  ██║██║ ╚████║██║",
  "   ╚═══╝  ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝",
];

const COMMANDS = [
  { cmd: "/help", desc: "List all available commands" },
  { cmd: "/about", desc: "Who is Aahil Valliani?" },
  { cmd: "/work", desc: "Featured projects & case studies" },
  { cmd: "/skills", desc: "Expertise & capabilities" },
  { cmd: "/contact", desc: "Get in touch" },
  { cmd: "/clear", desc: "Clear terminal" },
];

const WELCOME_LINES: TerminalLine[] = [
  ...ASCII_NAME.map((line) => ({ type: "ascii" as const, content: line })),
  { type: "output", content: "" },
  { type: "system", content: "Welcome, visitor." },
  { type: "output", content: "" },
  { type: "output", content: "  Type a command to explore. Start with / to see options." },
  { type: "output", content: "" },
];

const HELP_OUTPUT: TerminalLine[] = [
  { type: "output", content: "" },
  { type: "system", content: "Available commands:" },
  { type: "output", content: "" },
  { type: "output", content: "  /help     List all available commands" },
  { type: "output", content: "  /about    Who is Aahil Valliani?" },
  { type: "output", content: "  /work     Featured projects & case studies" },
  { type: "output", content: "  /skills   Expertise & capabilities" },
  { type: "output", content: "  /contact  Get in touch" },
  { type: "output", content: "  /clear    Clear terminal" },
  { type: "output", content: "" },
];

const ABOUT_OUTPUT: TerminalLine[] = [
  { type: "output", content: "" },
  { type: "system", content: "About" },
  { type: "output", content: "" },
  { type: "output", content: "  I'm Aahil Valliani, a sophomore at UMich" },
  { type: "output", content: "  studying computer science and economics." },
  { type: "output", content: "" },
  { type: "output", content: "  I spend my time playing pool and lacrosse," },
  { type: "output", content: "  watching sunday night football, building" },
  { type: "output", content: "  products (especially in healthcare) and" },
  { type: "output", content: "  studying game theory." },
  { type: "output", content: "" },
];

const SKILLS_OUTPUT: TerminalLine[] = [
  { type: "output", content: "" },
  { type: "system", content: "Skills & Technologies" },
  { type: "output", content: "" },
  { type: "output", content: "  AI/ML      Classification, NLP, Real-time inference" },
  { type: "output", content: "  Systems    Distributed systems, Edge computing, APIs" },
  { type: "output", content: "  Frontend   React, Next.js, TypeScript" },
  { type: "output", content: "  Backend    Python, Node.js, PostgreSQL" },
  { type: "output", content: "  Infra      AWS, Vercel, Docker, CI/CD" },
  { type: "output", content: "  Research   Behavioral intervention, HCI, Safety" },
  { type: "output", content: "" },
];

const CONTACT_OUTPUT: TerminalLine[] = [
  { type: "output", content: "" },
  { type: "system", content: "Contact" },
  { type: "output", content: "" },
  { type: "link", content: "  Email      aahil@umich.edu", color: "mailto:aahil@umich.edu" },
  { type: "link", content: "  LinkedIn   linkedin.com/in/aahil-valliani", color: "https://www.linkedin.com/in/aahil-valliani" },
  { type: "output", content: "" },
];

const WORK_OUTPUT: TerminalLine[] = [
  { type: "output", content: "" },
  { type: "system", content: "Projects — select one to explore:" },
  { type: "output", content: "" },
  { type: "link", content: "  [1]  SafeKids.ai  AI-powered student safety" },
  { type: "link", content: "  [2]  NRL          Solar flare prediction research" },
  { type: "link", content: "  [3]  Vacha        Real estate tax strategy platform" },
  { type: "link", content: "  [4]  Deed         Automating the deed/title vertical" },
  { type: "output", content: "" },
  { type: "output", content: "  Type a number or name to open." },
  { type: "output", content: "" },
];

const PROJECT_MAP: Record<string, string> = {
  "1": "safekids", "2": "nrl", "3": "vacha", "4": "deed",
  safekids: "safekids", "safekids.ai": "safekids", nrl: "nrl",
  vacha: "vacha", tryvacha: "vacha", deed: "deed",
};

const S = 11;

export function Terminal({ onOpenProject, onCloseProject }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>(WELCOME_LINES);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  const suggestions = useMemo(() => {
    if (!input.startsWith("/") || input.length < 1) return [];
    return COMMANDS.filter((c) => c.cmd.startsWith(input.toLowerCase()));
  }, [input]);

  useEffect(() => {
    setShowAutocomplete(input.startsWith("/") && input.length >= 1 && suggestions.length > 0);
    setSelectedSuggestion(0);
  }, [input, suggestions.length]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  const focusInput = useCallback(() => inputRef.current?.focus(), []);

  const processCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim().toLowerCase();
      const inputLine: TerminalLine = { type: "input", content: raw.trim() };

      if (cmd === "clear" || cmd === "/clear") { setLines(WELCOME_LINES); onCloseProject(); return; }

      let output: TerminalLine[] = [];
      switch (cmd) {
        case "/help": case "help": output = HELP_OUTPUT; break;
        case "/about": case "about": output = ABOUT_OUTPUT; break;
        case "/skills": case "skills": output = SKILLS_OUTPUT; break;
        case "/contact": case "contact": output = CONTACT_OUTPUT; break;
        case "/work": case "work": output = WORK_OUTPUT; break;
        default: {
          const projectId = PROJECT_MAP[cmd.replace(/^\//, "")];
          if (projectId) {
            output = [
              { type: "output", content: "" },
              { type: "system", content: `Opening ${projectId}...` },
              { type: "output", content: "" },
            ];
            setTimeout(() => onOpenProject(projectId), 300);
          } else {
            output = [
              { type: "output", content: "" },
              { type: "output", content: `  command not found: ${raw.trim()}`, color: "#f87171" },
              { type: "output", content: "  type /help for available commands." },
              { type: "output", content: "" },
            ];
          }
        }
      }
      setLines((prev) => [...prev, inputLine, ...output]);
      setHistory((prev) => [raw.trim(), ...prev]);
      setHistoryIndex(-1);
    },
    [onOpenProject]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (showAutocomplete) {
        if (e.key === "ArrowDown") { e.preventDefault(); setSelectedSuggestion((p) => Math.min(p + 1, suggestions.length - 1)); return; }
        if (e.key === "ArrowUp") { e.preventDefault(); setSelectedSuggestion((p) => Math.max(p - 1, 0)); return; }
        if (e.key === "Tab" || (e.key === "Enter" && suggestions.length > 0 && input !== suggestions[selectedSuggestion]?.cmd)) {
          e.preventDefault(); setInput(suggestions[selectedSuggestion].cmd); setShowAutocomplete(false); return;
        }
      }
      if (e.key === "Enter" && input.trim()) { setShowAutocomplete(false); processCommand(input); setInput(""); }
      else if (e.key === "ArrowUp" && !showAutocomplete) { e.preventDefault(); if (historyIndex < history.length - 1) { const n = historyIndex + 1; setHistoryIndex(n); setInput(history[n]); } }
      else if (e.key === "ArrowDown" && !showAutocomplete) { e.preventDefault(); if (historyIndex > 0) { const n = historyIndex - 1; setHistoryIndex(n); setInput(history[n]); } else { setHistoryIndex(-1); setInput(""); } }
      else if (e.key === "Escape") { setShowAutocomplete(false); }
    },
    [input, processCommand, history, historyIndex, showAutocomplete, suggestions, selectedSuggestion]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontSize: S }} onClick={focusInput}>
      <div ref={scrollRef} className="terminal-scroll" style={{ flex: 1, overflowY: "auto", padding: "10px 14px", fontSize: S, lineHeight: 1.5 }}>
        {lines.map((line, i) => (
          <div key={i} style={{ whiteSpace: "pre-wrap", fontSize: S }}>
            {line.type === "input" ? (
              <span>
                <span style={{ color: "#5de4c7" }}>~ </span>
                <span style={{ color: "rgba(255,255,255,0.7)" }}>{line.content}</span>
              </span>
            ) : line.type === "ascii" ? (
              <span style={{ display: "block", fontSize: 7, lineHeight: 1.15, color: "#5de4c7", fontWeight: 700 }}>
                {line.content}
              </span>
            ) : line.type === "system" ? (
              <span style={{ color: "#5de4c7", fontWeight: 500, fontSize: S }}>
                [{line.content}]
              </span>
            ) : line.type === "link" ? (
              <span
                style={{ color: "rgba(93,228,199,0.6)", cursor: "pointer", fontSize: S }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#5de4c7")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(93,228,199,0.6)")}
                onClick={() => {
                  const num = line.content.match(/\[(\d)\]/)?.[1];
                  if (num && PROJECT_MAP[num]) { processCommand(num); }
                  else if (line.color && (line.color.startsWith("http") || line.color.startsWith("mailto:"))) { window.open(line.color, "_blank"); }
                }}
              >
                {line.content}
              </span>
            ) : (
              <span style={{ color: line.color || "rgba(255,255,255,0.45)", fontSize: S }}>
                {line.content}
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={{ position: "relative", flexShrink: 0 }}>
        {showAutocomplete && (
          <div className="autocomplete-appear" style={{ position: "absolute", bottom: "100%", left: 0, right: 0, background: "#24273a", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {suggestions.map((s, i) => (
              <div
                key={s.cmd}
                style={{ display: "flex", alignItems: "center", padding: "3px 14px", cursor: "pointer", background: i === selectedSuggestion ? "rgba(93,228,199,0.08)" : "transparent", fontSize: S }}
                onMouseEnter={() => setSelectedSuggestion(i)}
                onClick={() => { setInput(s.cmd); setShowAutocomplete(false); inputRef.current?.focus(); }}
              >
                <span style={{ fontSize: S, fontWeight: 500, width: 80, color: "#5de4c7" }}>{s.cmd}</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{s.desc}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", padding: "6px 14px", gap: 6, borderTop: "1px solid rgba(255,255,255,0.05)", background: "#1a1b26", fontSize: S }}>
          <span style={{ fontSize: S, color: "#5de4c7" }}>~</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            style={{ flex: 1, background: "transparent", color: "rgba(255,255,255,0.8)", fontSize: S, border: "none", outline: "none", caretColor: cursorVisible ? "#5de4c7" : "transparent", padding: 0 }}
          />
        </div>
      </div>
    </div>
  );
}
