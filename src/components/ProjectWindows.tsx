"use client";

import { useState } from "react";
import { MacWindow } from "./MacWindow";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ProjectWindowsProps {
  projectId: string;
  onClose: () => void;
  baseZ: number;
  onFocusWindow: (id: string) => void;
  focusedWindow: string;
}

interface WindowDef {
  id: string;
  title: string;
  width: number;
  height: number;
  xOffset: number;
  yOffset: number;
  content: React.ReactNode;
}

function getWindows(projectId: string): WindowDef[] {
  switch (projectId) {
    case "safekids": {
      const W = typeof window !== "undefined" ? window.innerWidth : 1400;
      const H = typeof window !== "undefined" ? window.innerHeight : 900;
      const pad = 30;
      const ww = Math.min(420, (W - pad * 3) / 2);
      const wh = Math.min(380, (H - pad * 3) / 2);
      return [
        {
          id: "sk-browser",
          title: "Safari — safekids.ai",
          width: ww,
          height: wh,
          xOffset: -(W / 2) + pad + ww / 2,
          yOffset: -(H / 2) + pad + wh / 2,
          content: <SafeKidsBrowser />,
        },
        {
          id: "sk-about",
          title: "SafeKids.ai — Overview",
          width: ww,
          height: wh,
          xOffset: (W / 2) - pad - ww / 2,
          yOffset: -(H / 2) + pad + wh / 2,
          content: <SafeKidsAbout />,
        },
        {
          id: "sk-press",
          title: "Media & Press",
          width: ww,
          height: wh,
          xOffset: -(W / 2) + pad + ww / 2,
          yOffset: (H / 2) - pad - wh / 2,
          content: <SafeKidsPress />,
        },
        {
          id: "sk-patents",
          title: "Patents",
          width: ww,
          height: wh - 60,
          xOffset: (W / 2) - pad - ww / 2,
          yOffset: (H / 2) - pad - (wh - 60) / 2,
          content: <SafeKidsPatents />,
        },
      ];
    }
    case "nrl": {
      const W = typeof window !== "undefined" ? window.innerWidth : 1400;
      const H = typeof window !== "undefined" ? window.innerHeight : 900;
      const pad = 30;
      const ww = Math.min(420, (W - pad * 3) / 2);
      const wh = Math.min(380, (H - pad * 3) / 2);
      return [
        {
          id: "nrl-overview",
          title: "NRL — Solar Flare Research",
          width: ww,
          height: wh,
          xOffset: -(W / 2) + pad + ww / 2,
          yOffset: -(H / 2) + pad + wh / 2,
          content: <NRLOverview />,
        },
        {
          id: "nrl-presentations",
          title: "Presentations & Impact",
          width: ww,
          height: wh,
          xOffset: (W / 2) - pad - ww / 2,
          yOffset: -(H / 2) + pad + wh / 2,
          content: <NRLPresentations />,
        },
        {
          id: "nrl-paper",
          title: "Frontiers — Research Paper",
          width: ww,
          height: wh,
          xOffset: -(W / 2) + pad + ww / 2,
          yOffset: (H / 2) - pad - wh / 2,
          content: <NRLPaper />,
        },
      ];
    }
    case "vacha": {
      const W = typeof window !== "undefined" ? window.innerWidth : 1400;
      const H = typeof window !== "undefined" ? window.innerHeight : 900;
      const pad = 30;
      const ww = Math.min(420, (W - pad * 3) / 2);
      const wh = Math.min(380, (H - pad * 3) / 2);
      return [
        {
          id: "vacha-overview",
          title: "Vacha — Overview",
          width: ww,
          height: wh,
          xOffset: -(W / 2) + pad + ww / 2,
          yOffset: -(H / 2) + pad + wh / 2,
          content: <VachaOverview />,
        },
        {
          id: "vacha-site",
          title: "Safari — tryvacha.com",
          width: ww,
          height: wh,
          xOffset: (W / 2) - pad - ww / 2,
          yOffset: (H / 2) - pad - wh / 2,
          content: <VachaBrowser />,
        },
      ];
    }
    case "deed": {
      const W = typeof window !== "undefined" ? window.innerWidth : 1400;
      return [
        {
          id: "deed-waitlist",
          title: "Deed — Waitlist",
          width: 400,
          height: 340,
          xOffset: W / 4,
          yOffset: -20,
          content: <DeedWaitlist />,
        },
      ];
    }
    default:
      return [];
  }
}

/* ─── Mobile Content Variants (no iframes, simpler layout) ─── */

function getMobileContent(projectId: string): { title: string; content: React.ReactNode }[] {
  switch (projectId) {
    case "safekids":
      return [
        { title: "SafeKids.ai — Overview", content: <SafeKidsAbout /> },
        { title: "Media & Press", content: <SafeKidsPress /> },
        { title: "Patents", content: <SafeKidsPatents /> },
      ];
    case "nrl":
      return [
        { title: "NRL — Solar Flare Research", content: <NRLOverview /> },
        { title: "Presentations & Impact", content: <NRLPresentations /> },
      ];
    case "vacha":
      return [
        { title: "Vacha — Overview", content: <VachaOverview /> },
      ];
    case "deed":
      return [
        { title: "Deed — Waitlist", content: <DeedWaitlist /> },
      ];
    default:
      return [];
  }
}

export function ProjectWindows({
  projectId,
  onClose,
  baseZ,
  onFocusWindow,
  focusedWindow,
}: ProjectWindowsProps) {
  const isMobile = useIsMobile();

  // Mobile: full-screen scrollable overlay
  if (isMobile) {
    const panels = getMobileContent(projectId);
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background: "#1a1b26",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            height: 44,
            background: "#24273a",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            paddingLeft: 14,
            paddingRight: 14,
            flexShrink: 0,
          }}
        >
          <div style={{ transform: "scale(0.75)", transformOrigin: "left center" }}>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "#5de4c7",
                fontSize: 12,
                cursor: "pointer",
                padding: "4px 8px",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5de4c7" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              back
            </button>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
              {projectId}
            </span>
          </div>
          <div style={{ width: 48 }} />
        </div>

        {/* Scrollable content */}
        <div
          className="scroll-hidden"
          style={{
            flex: 1,
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            padding: "12px 12px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {panels.map((panel, i) => (
            <div
              key={i}
              style={{
                borderRadius: 10,
                overflow: "hidden",
                background: "#1a1b26",
                border: "1px solid rgba(255,255,255,0.06)",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  height: 28,
                  background: "#24273a",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 12,
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{panel.title}</span>
              </div>
              <div style={{ minHeight: 200 }}>{panel.content}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop: original positioned windows
  const windows = getWindows(projectId);
  const cx = typeof window !== "undefined" ? window.innerWidth / 2 : 700;
  const cy = typeof window !== "undefined" ? window.innerHeight / 2 : 400;

  return (
    <>
      {windows.map((w, i) => {
        let x = cx + w.xOffset - w.width / 2;
        let y = cy + w.yOffset - w.height / 2;
        if (typeof window !== "undefined") {
          x = Math.max(10, Math.min(x, window.innerWidth - w.width - 10));
          y = Math.max(10, Math.min(y, window.innerHeight - w.height - 10));
        }
        return (
          <MacWindow
            key={w.id}
            title={w.title}
            width={w.width}
            height={w.height}
            x={x}
            y={y}
            onClose={onClose}
            zIndex={focusedWindow === w.id ? baseZ + 100 : baseZ + i}
            onFocus={() => onFocusWindow(w.id)}
          >
            {w.content}
          </MacWindow>
        );
      })}
    </>
  );
}

/* ─── SafeKids Browser ─── */

function SafeKidsBrowser() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "#24273a", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 4 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"><path d="M9 6l6 6-6 6"/></svg>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)", fontSize: 10 }}>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          <span style={{ color: "rgba(255,255,255,0.35)" }}>https://www.safekids.ai</span>
        </div>
      </div>
      <div style={{ flex: 1, background: "#fff", overflow: "hidden" }}>
        <iframe
          src="https://www.safekids.ai"
          style={{ width: "300%", height: "300%", border: "none", transform: "scale(0.333)", transformOrigin: "0 0" }}
          title="SafeKids.ai"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
}

/* ─── SafeKids About ─── */

function SafeKidsAbout() {
  return (
    <div className="terminal-scroll" style={{ padding: 14, fontSize: 11, lineHeight: 1.6, overflowY: "auto" }}>
      <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(93,228,199,0.5)", marginBottom: 8 }}>
        What It Does
      </p>
      <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: 8 }}>
        SafeKids.ai is a real-time content classification and behavioral
        intervention system deployed across K–12 schools.
      </p>
      <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: 8 }}>
        It uses machine learning to detect harmful intent in search queries
        and intervenes BEFORE exposure.
      </p>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>
        Instead of blocking, the system applies:
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 8, paddingLeft: 8 }}>
        <span style={{ color: "#5de4c7" }}>→ Pause</span>
        <span style={{ color: "#5de4c7" }}>→ Reflect</span>
        <span style={{ color: "#5de4c7" }}>→ Redirect</span>
      </div>
      <p style={{ color: "rgba(255,255,255,0.45)", marginBottom: 12 }}>
        This reduces harmful engagement while preserving trust.
      </p>

      <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(93,228,199,0.5)", marginBottom: 6 }}>
        Impact
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 12 }}>
        {[
          "10,000+ users across K-12 schools",
          "Stopped multiple suicide attempts",
          "Prevented a possible school shooting",
        ].map((item) => (
          <div key={item} style={{ display: "flex", gap: 6 }}>
            <span style={{ color: "rgba(93,228,199,0.4)" }}>·</span>
            <span style={{ color: "rgba(255,255,255,0.45)" }}>{item}</span>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 8 }}>
        <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(93,228,199,0.5)", marginBottom: 4 }}>
          Core Principle
        </p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>"Pause, Reflect, Redirect"</p>
      </div>
    </div>
  );
}

/* ─── SafeKids Press ─── */

function SafeKidsPress() {
  const articles = [
    { outlet: "LAist", quote: "Frustrated by school web filters, one teenager created his own", url: "https://laist.com/news/education/frustrated-by-school-web-filters-one-teenager-created-his-own" },
    { outlet: "Press Democrat", quote: "Frustrated by school web filters, one Virginia teenager created his own", url: "https://www.pressdemocrat.com/article/news/frustrated-by-school-web-filters-one-teenager-created-his-own/" },
    { outlet: "The Markup", quote: "Frustrated by school web filters, a new system emerges", url: "http://themarkup.org/digital-book-banning/2024/07/24/frustrated-by-school-web-filters-one-teenager-created-his-own" },
    { outlet: "Fox 13 News", quote: "Teen creates app to protect kids from social media", url: "https://www.fox13news.com/news/teen-creates-app-to-protect-kids-from-social-media-says-total-ban-wont-work" },
    { outlet: "ABC Action News", quote: "Brothers create app using new approach to keep kids safe online", url: "https://www.abcactionnews.com/news/anchors-report/brothers-create-app-using-new-approach-to-keep-kids-safe-while-online" },
    { outlet: "CalMatters", quote: "Frustrated by school web filters", url: "https://calmatters.org/education/2024/07/web-filter/" },
    { outlet: "MDPI (Social Sciences)", quote: "Behavioral intervention model for digital safety", url: "https://www.mdpi.com/2076-0760/14/5/302" },
  ];

  return (
    <div style={{ padding: 14, fontSize: 11 }}>
      <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(93,228,199,0.5)", marginBottom: 8 }}>
        Media & Press
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {articles.map((a, i) => (
          <a
            key={i}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", display: "block", padding: "6px 8px", borderRadius: 4, border: "1px solid rgba(93,228,199,0.08)", background: "rgba(93,228,199,0.02)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(93,228,199,0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(93,228,199,0.08)"; }}
          >
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginBottom: 2 }}>"{a.quote}"</p>
            <p style={{ color: "#5de4c7", fontSize: 9, letterSpacing: "0.05em", fontWeight: 500 }}>{a.outlet}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─── SafeKids Patents ─── */

function SafeKidsPatents() {
  const patents = [
    { number: "US 11,356,734", title: "Behavioral Intervention System for Digital Content" },
    { number: "US 11,309,086", title: "AI-Based Intent Classification for Online Safety" },
    { number: "US 10,949,774", title: "Real-Time Educational Content Redirection System" },
  ];

  return (
    <div style={{ padding: 14, fontSize: 11 }}>
      <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(93,228,199,0.5)", marginBottom: 8 }}>
        Patents
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {patents.map((p) => (
          <div key={p.number} style={{ border: "1px solid rgba(93,228,199,0.1)", background: "rgba(93,228,199,0.03)", borderRadius: 6, padding: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
              <span style={{ fontSize: 10, color: "#5de4c7", fontWeight: 500 }}>{p.number}</span>
              <span style={{ fontSize: 8, color: "rgba(93,228,199,0.6)", textTransform: "uppercase", letterSpacing: "0.1em" }}>APPROVED</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10 }}>{p.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── NRL ─── */

function NRLOverview() {
  return (
    <div style={{ padding: 14, fontSize: 11, lineHeight: 1.6 }}>
      <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(93,228,199,0.5)", marginBottom: 8 }}>
        Solar Flare Research
      </p>
      <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: 8 }}>
        Developed a dataset to predict solar flares that interfere
        with Department of Defense communication systems.
      </p>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>
        The work evaluates feasibility for the:
      </p>
      <p style={{ color: "#5de4c7", fontWeight: 500, marginBottom: 8 }}>
        Multiview Observatory for Solar Terrestrial Science (MOST)
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 10, paddingLeft: 8 }}>
        <span style={{ color: "rgba(255,255,255,0.45)" }}>→ A proposed NASA flagship mission</span>
        <span style={{ color: "rgba(255,255,255,0.45)" }}>→ Uses flux rope (FR) observation tracking</span>
        <span style={{ color: "rgba(255,255,255,0.45)" }}>→ Extends predictive modeling for space weather</span>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 8 }}>
        <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(93,228,199,0.5)", marginBottom: 4 }}>
          Status
        </p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>Published research + conference validation</p>
      </div>
    </div>
  );
}

function NRLPresentations() {
  return (
    <div style={{ padding: 14, fontSize: 11, lineHeight: 1.6 }}>
      <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(93,228,199,0.5)", marginBottom: 8 }}>
        Impact
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 12 }}>
        {[
          "Enables early detection of disruptive solar activity",
          "Improves resilience of satellite + defense comms",
          "Supports next-gen space weather monitoring",
        ].map((item) => (
          <div key={item} style={{ display: "flex", gap: 6 }}>
            <span style={{ color: "rgba(96,165,250,0.5)" }}>·</span>
            <span style={{ color: "rgba(255,255,255,0.45)" }}>{item}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(93,228,199,0.5)", marginBottom: 8 }}>
        Presentations
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ border: "1px solid rgba(96,165,250,0.1)", background: "rgba(96,165,250,0.03)", borderRadius: 6, padding: 10 }}>
          <p style={{ color: "#5de4c7", fontSize: 10, fontWeight: 500, marginBottom: 2 }}>Green Bank Observatory (GBO)</p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>→ Research presentation on solar flare prediction</p>
        </div>
        <div style={{ border: "1px solid rgba(96,165,250,0.1)", background: "rgba(96,165,250,0.03)", borderRadius: 6, padding: 10 }}>
          <p style={{ color: "#5de4c7", fontSize: 10, fontWeight: 500, marginBottom: 2 }}>American Geophysical Union (AGU)</p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>→ Largest Earth + space science conference</p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>→ 25,000+ attendees · 100+ countries</p>
        </div>
      </div>
    </div>
  );
}

function NRLPaper() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "8px 10px", background: "#24273a", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
        <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(93,228,199,0.5)", marginBottom: 2 }}>Research Paper</p>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Frontiers in Astronomy and Space Sciences</p>
      </div>
      <div style={{ flex: 1, background: "#fff", overflow: "hidden" }}>
        <iframe
          src="https://www.frontiersin.org/journals/astronomy-and-space-sciences/articles/10.3389/fspas.2025.1667369/full"
          style={{ width: "300%", height: "300%", border: "none", transform: "scale(0.333)", transformOrigin: "0 0" }}
          title="Solar Flare Research Paper"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
}

/* ─── Vacha ─── */

function VachaOverview() {
  return (
    <div className="scroll-hidden" style={{ padding: 14, fontSize: 11, lineHeight: 1.6 }}>
      <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(93,228,199,0.5)", marginBottom: 8 }}>
        What It Does
      </p>
      <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: 8 }}>
        Mapping out real estate depreciation and setting up real
        estate as an investment. Only high-wealth-serving CPAs are
        paid to give tax strategies to lower taxable income —
        Vacha provides these tax strategies to middle income earners.
      </p>

      <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(93,228,199,0.5)", marginBottom: 6 }}>
        Built With
      </p>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>
        Full-stack application using Next.js, React, TypeScript,
        and Tailwind, with backend logic simulating depreciation
        schedules, 1031 exchanges, and capital-gains outcomes
        based on IRS and MACRS guidelines.
      </p>

      <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(93,228,199,0.5)", marginBottom: 6 }}>
        Process
      </p>
      <p style={{ color: "rgba(255,255,255,0.45)" }}>
        Worked with CPAs and developed a capable MVP.
      </p>
    </div>
  );
}

function VachaBrowser() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "#24273a", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 4 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"><path d="M9 6l6 6-6 6"/></svg>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)", fontSize: 10 }}>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          <span style={{ color: "rgba(255,255,255,0.35)" }}>https://tryvacha.com</span>
        </div>
      </div>
      <div style={{ flex: 1, background: "#fff", overflow: "hidden" }}>
        <iframe
          src="https://tryvacha.com"
          style={{ width: "300%", height: "300%", border: "none", transform: "scale(0.333)", transformOrigin: "0 0" }}
          title="Vacha"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
}

/* ─── Deed ─── */

function DeedWaitlist() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    window.open(
      `mailto:aahil@umich.edu?subject=${encodeURIComponent("Deed Waitlist: " + name)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nInterested in Deed.")}`,
      "_blank"
    );
    setSubmitted(true);
  };

  return (
    <div style={{ padding: 20, fontSize: 11, lineHeight: 1.6, display: "flex", flexDirection: "column" }}>
      <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(93,228,199,0.5)", marginBottom: 6 }}>
        Deed
      </p>
      <p style={{ color: "#5de4c7", fontWeight: 500, fontSize: 13, marginBottom: 10 }}>
        Automating the deed/title vertical.
      </p>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>
        Building for title. If you are in the space or just
        interested, drop your email.
      </p>

      {submitted ? (
        <div style={{ border: "1px solid rgba(93,228,199,0.15)", background: "rgba(93,228,199,0.05)", borderRadius: 6, padding: 14, textAlign: "center" }}>
          <p style={{ color: "#5de4c7", fontWeight: 500, marginBottom: 4 }}>Thanks for signing up.</p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>We'll be in touch.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 4,
              padding: "8px 10px",
              color: "rgba(255,255,255,0.8)",
              fontSize: 11,
              outline: "none",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(93,228,199,0.3)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 4,
              padding: "8px 10px",
              color: "rgba(255,255,255,0.8)",
              fontSize: 11,
              outline: "none",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(93,228,199,0.3)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
          />
          <button
            type="submit"
            style={{
              background: "#5de4c7",
              color: "#1a1b26",
              border: "none",
              borderRadius: 4,
              padding: "8px 0",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              marginTop: 4,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            Join Waitlist
          </button>
        </form>
      )}
    </div>
  );
}
