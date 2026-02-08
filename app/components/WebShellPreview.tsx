export default function WebShellPreview() {
  return (
    <div className="w-full max-w-6xl mx-auto border border-grid/50 rounded-xl overflow-hidden shadow-2xl shadow-black/20 flex flex-col lg:flex-row h-[560px] bg-[#1e1e1e]">

      {/* Left Pane: VS Code Mock */}
      <div className="flex-1 flex flex-col bg-[#1e1e1e] text-[#cccccc] font-mono text-xs border-r border-[#2b2b2b]">
        {/* Window Controls & Title */}
        <div className="h-10 bg-[#18181b] flex items-center px-4 justify-between select-none">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:bg-[#FEBC2E]/80 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-[#28C840] hover:bg-[#28C840]/80 transition-colors" />
          </div>
          <div className="text-[11px] font-medium text-[#999] tracking-tight">auth_service.ts — osmogrep-demo</div>
          <div className="w-10" />
        </div>

        {/* Editor Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar (Activity Bar) */}
          <div className="w-12 bg-[#18181b] flex flex-col items-center py-4 gap-6 border-r border-[#2b2b2b]">
            <div className="w-6 h-6 border-l-2 border-white opacity-90 cursor-pointer" />
            <div className="w-6 h-6 border-l-2 border-transparent opacity-40 hover:opacity-100 transition-opacity cursor-pointer" />
            <div className="w-6 h-6 border-l-2 border-transparent opacity-40 hover:opacity-100 transition-opacity cursor-pointer" />
            <div className="w-6 h-6 border-l-2 border-transparent opacity-40 hover:opacity-100 transition-opacity cursor-pointer text-accent" />
          </div>

          {/* File Explorer (Simplified) */}
          <div className="w-48 bg-[#18181b] border-r border-[#2b2b2b] flex flex-col hidden md:flex">
            <div className="px-4 py-3 text-[10px] font-bold text-[#6f6f6f] tracking-wider uppercase">Explorer</div>
            <div className="px-2 space-y-0.5">
              <div className="flex items-center gap-1.5 px-2 py-1 text-[#e1e4e8] bg-[#2a2d2e] rounded-sm cursor-pointer">
                <span className="text-[#d7ba7d]">▾</span>
                <span className="font-medium">src</span>
              </div>
              <div className="pl-6 space-y-0.5 text-[#9cdcfe]">
                <div className="px-2 py-1 rounded-sm bg-[#37373d] text-white">auth_service.ts</div>
                <div className="px-2 py-1 opacity-70 hover:opacity-100 cursor-pointer">middleware.ts</div>
                <div className="px-2 py-1 opacity-70 hover:opacity-100 cursor-pointer">types.d.ts</div>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 text-[#e1e4e8] opacity-70 mt-2">
                <span className="text-[#d7ba7d]">▸</span>
                <span>tests</span>
              </div>
            </div>
          </div>

          {/* Code Content */}
          <div className="flex-1 flex flex-col bg-[#1e1e1e]">
            {/* Tabs */}
            <div className="flex bg-[#18181b]">
              <div className="px-4 py-2.5 bg-[#1e1e1e] text-[#ffffff] text-[11px] border-t-2 border-accent flex items-center gap-2">
                <span>auth_service.ts</span>
                <span className="opacity-0 hover:opacity-100">×</span>
              </div>
              <div className="px-4 py-2.5 text-[#9ca3af] text-[11px] hover:bg-[#1e1e1e]/50 cursor-pointer flex items-center gap-2">
                <span>middleware.ts</span>
              </div>
            </div>

            {/* LOC */}
            <div className="flex-1 p-4 font-mono text-[13px] leading-6 overflow-hidden relative">
              {/* Line Numbers */}
              <div className="absolute left-0 top-4 bottom-0 w-12 text-right pr-4 text-[#4e4e4e] select-none">
                1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9
              </div>

              {/* Code */}
              <div className="pl-12">
                <div><span className="text-[#C586C0]">import</span> express <span className="text-[#C586C0]">from</span> <span className="text-[#CE9178]">'express'</span>;</div>
                <div><span className="text-[#C586C0]">import</span> {'{ verifySignature }'} <span className="text-[#C586C0]">from</span> <span className="text-[#CE9178]">'./middleware'</span>;</div>
                <br />
                <div><span className="text-[#569CD6]">const</span> app = <span className="text-[#DCDCAA]">express</span>();</div>
                <div>app.<span className="text-[#DCDCAA]">use</span>(express.<span className="text-[#DCDCAA]">json</span>());</div>
                <br />
                <div><span className="text-[#6A9955]">// 🛡️ Osmogrep WatchDog: Active</span></div>
                <div className="bg-[#3c1414]/50 border-l-2 border-red-500 pl-2 -ml-2">
                  <span className="text-[#C586C0]">if</span> (req.<span className="text-[#DCDCAA]">header</span>(<span className="text-[#CE9178]">'X-Debug-Mode'</span>)) {'{'}
                </div>
                <div className="bg-[#3c1414]/50 border-l-2 border-red-500 pl-2 -ml-2">
                  &nbsp;&nbsp;<span className="text-[#DCDCAA]">enableRootAccess</span>(); <span className="text-[#f87171] font-bold">{'// <!- CORE RISK'}</span>
                </div>
                <div>{'}'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane: Terminal Image */}
      <div className="flex-1 bg-[#0d0d0d] flex flex-col justify-center items-center overflow-hidden relative border-t lg:border-t-0 lg:border-l border-[#2b2b2b]">
        {/* Placeholder for the user's image, assuming it fills the pane */}
        <div className="absolute inset-0 bg-[#0d0d0d]">
          {/* Using standard img for now as requested by plan */}
          <img
            src="/osmogrep.png"
            alt="Osmogrep Terminal Interface"
            className="w-full h-full object-cover object-left-top opacity-95 hover:opacity-100 transition-opacity"
          />
        </div>

        {/* Overlay Badge (Optional polish) */}
        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur text-white text-[10px] px-2 py-1 rounded border border-white/10 flex items-center gap-1.5 shadow-lg z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span>Live Session</span>
        </div>
      </div>

    </div>
  );
}
