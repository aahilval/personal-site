"use client";

import { useState, useCallback, useEffect } from "react";
import { MacWindow } from "@/components/MacWindow";
import { Terminal } from "@/components/Terminal";
import { ProjectWindows } from "@/components/ProjectWindows";
import { BootSequence } from "@/components/BootSequence";

export default function Home() {
  const [booted, setBooted] = useState(false);
  const [mainVisible, setMainVisible] = useState(false);
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [focusedWindow, setFocusedWindow] = useState("terminal");
  const [terminalVisible, setTerminalVisible] = useState(true);

  useEffect(() => {
    if (booted) {
      requestAnimationFrame(() => setMainVisible(true));
    }
  }, [booted]);

  const handleOpenProject = useCallback((projectId: string) => {
    setOpenProject(projectId);
    setFocusedWindow(projectId + "-0");
  }, []);

  const handleCloseProject = useCallback(() => {
    setOpenProject(null);
    setFocusedWindow("terminal");
  }, []);

  const handleCloseTerminal = useCallback(() => {
    setTerminalVisible(false);
  }, []);

  if (!booted) {
    return <BootSequence onComplete={() => setBooted(true)} />;
  }

  // Snap terminal to left half when deed is open
  const terminalX = openProject === "deed"
    ? (typeof window !== "undefined" ? Math.round(window.innerWidth / 4 - 290) : 20)
    : undefined;

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        opacity: mainVisible ? 1 : 0,
        transition: "opacity 0.8s ease-in-out",
      }}
    >
      {/* Desktop wallpaper */}
      <div
        className="absolute inset-0 bg-no-repeat"
        style={{
          backgroundImage: "url('/bg.png')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
        }}
      />

      {/* Project detail windows */}
      {openProject && (
        <ProjectWindows
          projectId={openProject}
          onClose={handleCloseProject}
          baseZ={focusedWindow === "terminal" ? 5 : 20}
          focusedWindow={focusedWindow}
          onFocusWindow={setFocusedWindow}
        />
      )}

      {/* Main terminal */}
      {terminalVisible && (
        <MacWindow
          title="aahil@valliani — ~"
          width={580}
          height={400}
          x={terminalX}
          isMain
          onClose={handleCloseTerminal}
          zIndex={focusedWindow === "terminal" ? 50 : 10}
          onFocus={() => setFocusedWindow("terminal")}
        >
          <Terminal onOpenProject={handleOpenProject} onCloseProject={handleCloseProject} />
        </MacWindow>
      )}
    </div>
  );
}
