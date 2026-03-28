"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface MacWindowProps {
  title: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  onClose?: () => void;
  isMain?: boolean;
  zIndex?: number;
  onFocus?: () => void;
}

export function MacWindow({
  title,
  children,
  width = 700,
  height = 500,
  x,
  y,
  onClose,
  isMain = false,
  zIndex = 10,
  onFocus,
}: MacWindowProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(
    x !== undefined && y !== undefined ? { x, y } : null
  );
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (x !== undefined) {
      setPos((prev) => ({
        x,
        y: prev?.y ?? (window.innerHeight - height) / 2 - 30,
      }));
    } else {
      setPos({
        x: (window.innerWidth - width) / 2,
        y: (window.innerHeight - height) / 2 - 30,
      });
    }
  }, [x, y, width, height]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest(".traffic-light")) return;
      if (!pos) return;
      setIsDragging(true);
      dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
      onFocus?.();
    },
    [pos, onFocus]
  );

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isDragging]);

  const titleBarHeight = 30;

  if (!pos) return null;

  return (
    <div
      className="window-appear absolute"
      style={{
        left: pos.x,
        top: pos.y,
        width,
        zIndex,
        transition: isDragging ? "none" : "left 0.4s ease-in-out, top 0.4s ease-in-out",
        userSelect: isDragging ? "none" : "auto",
      }}
      onMouseDown={onFocus}
    >
      <div
        style={{
          borderRadius: 10,
          overflow: "hidden",
          background: "#1a1b26",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.08)",
        }}
      >
        {/* Title bar — native macOS style */}
        <div
          style={{
            height: titleBarHeight,
            background: "#24273a",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            paddingLeft: 12,
            paddingRight: 12,
            cursor: "default",
            userSelect: "none",
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Traffic lights */}
          <div className="traffic-light group/tl" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={onClose}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#ff5f57",
                border: "none",
                padding: 0,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg className="opacity-0 group-hover/tl:opacity-100 transition-opacity" width="6" height="6" viewBox="0 0 6 6" fill="none" stroke="#4d0000" strokeWidth="1.5">
                <path d="M0.5 0.5L5.5 5.5M5.5 0.5L0.5 5.5" />
              </svg>
            </button>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#febc2e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg className="opacity-0 group-hover/tl:opacity-100 transition-opacity" width="6" height="2" viewBox="0 0 6 2" fill="none" stroke="#946800" strokeWidth="1.5">
                <path d="M0.5 1H5.5" />
              </svg>
            </div>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#28c840",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg className="opacity-0 group-hover/tl:opacity-100 transition-opacity" width="6" height="6" viewBox="0 0 8 8" fill="none" stroke="#006500" strokeWidth="1.2">
                <path d="M1 4.5L3.5 7L7 1" />
              </svg>
            </div>
          </div>

          {/* Title text — centered */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
                fontFamily: '"JetBrains Mono", "SF Mono", "Menlo", "Monaco", monospace',
                fontWeight: 400,
              }}
            >
              {title}
            </span>
          </div>

          {/* Spacer to balance traffic lights */}
          <div style={{ width: 52 }} />
        </div>

        {/* Content */}
        <div
          style={{
            height: height - titleBarHeight,
            maxHeight: height - titleBarHeight,
            overflowY: isMain ? "hidden" : "auto",
            overflowX: "hidden",
            scrollbarWidth: isMain ? undefined : "none" as never,
            msOverflowStyle: isMain ? undefined : "none" as never,
            WebkitOverflowScrolling: "touch",
          }}
          className={isMain ? "" : "scroll-hidden"}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
