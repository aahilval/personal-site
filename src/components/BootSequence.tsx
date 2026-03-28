"use client";

import { useState, useEffect } from "react";

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  { text: "booting system...", delay: 0 },
  { text: "loading kernel modules", delay: 300 },
  { text: "██████░░░░░░░░░░  38%", delay: 600 },
  { text: "██████████░░░░░░  64%", delay: 900 },
  { text: "████████████████  100%", delay: 1200 },
  { text: "", delay: 1400 },
  { text: "initializing network interfaces... ok", delay: 1500 },
  { text: "mounting filesystems... ok", delay: 1700 },
  { text: "starting display server... ok", delay: 1900 },
  { text: "", delay: 2100 },
  { text: "enter...", delay: 2200 },
];

const TOTAL_DURATION = 2900;

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), line.delay));
    });

    timers.push(setTimeout(() => setFading(true), TOTAL_DURATION));
    timers.push(setTimeout(() => onComplete(), TOTAL_DURATION + 1000));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0a0b10",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        opacity: fading ? 0 : 1,
        transition: "opacity 1s ease-in-out",
      }}
    >
      <div style={{ width: "100%", maxWidth: 360, padding: "0 24px", fontSize: 11, lineHeight: 1.8 }}>
        {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            style={{
              color: line.text === "enter..."
                ? "#5de4c7"
                : line.text.includes("██")
                ? "#5de4c7"
                : "rgba(255,255,255,0.4)",
              fontWeight: line.text === "enter..." ? 500 : 400,
            }}
          >
            {line.text === "" ? "\u00A0" : line.text}
          </div>
        ))}
        <span
          style={{
            display: "inline-block",
            width: 7,
            height: 13,
            background: "#5de4c7",
            animation: "blink 1s step-end infinite",
            verticalAlign: "text-bottom",
            marginTop: 2,
          }}
        />
      </div>
    </div>
  );
}
