"use client";

const dockApps = [
  { name: "Finder", gradient: "from-[#4da6ff] to-[#0066cc]" },
  { name: "Safari", gradient: "from-[#5ac8fa] to-[#007aff]" },
  { name: "Messages", gradient: "from-[#5af25a] to-[#34c759]" },
  { name: "Mail", gradient: "from-[#5ac8fa] to-[#007aff]" },
  { name: "Music", gradient: "from-[#fc5c65] to-[#eb3b5a]" },
  { name: "Terminal", gradient: "from-[#2d2d2d] to-[#1a1a1a]", active: true },
  { name: "Code", gradient: "from-[#0078d4] to-[#005a9e]" },
  { name: "Notes", gradient: "from-[#ffd43b] to-[#f59f00]" },
  { name: "Settings", gradient: "from-[#868e96] to-[#495057]" },
];

export function Dock() {
  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50">
      <div
        className="flex items-end gap-1 px-2.5 py-1.5 rounded-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(30px) saturate(150%)",
          WebkitBackdropFilter: "blur(30px) saturate(150%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        {dockApps.map((app) => (
          <div key={app.name} className="group relative flex flex-col items-center">
            <div className="absolute -top-8 px-2.5 py-1 rounded-md text-[10px] text-white/80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10"
              style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}>
              {app.name}
            </div>
            <div
              className={`w-10 h-10 rounded-[10px] bg-gradient-to-br ${app.gradient} transition-transform duration-200 group-hover:-translate-y-2 cursor-default`}
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.35)" }}
            />
            {app.active && (
              <div className="w-1 h-1 rounded-full bg-white/40 mt-0.5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
