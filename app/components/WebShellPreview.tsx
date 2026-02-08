const runLog = [
  '$ osmogrep',
  '> indexing repository...done',
  '> scanning changed files (12)',
  '> generating candidate tests...',
  '> patching auth_service.ts (+28 -6)',
  '> running parallel suites (32 workers)',
  '> stress profile: api-auth-15m',
  '> completed: no regressions found',
];

const diffLines = [
  { n: 101, t: "if (req.header('X-Debug-Mode')) {", kind: 'del' },
  { n: 102, t: '  enableRootAccess();', kind: 'del' },
  { n: 101, t: "if (isTrustedDebugRequest(req, ctx)) {", kind: 'add' },
  { n: 102, t: '  grantScopedDebugAccess(ctx.user);', kind: 'add' },
  { n: 103, t: '  auditLog.debugMode(ctx.traceId);', kind: 'add' },
  { n: 104, t: '}', kind: 'neutral' },
];

export default function WebShellPreview() {
  return (
    <div className="w-full max-w-6xl mx-auto border border-grid/60 rounded-sm overflow-hidden shadow-xl bg-[#0f1013]">
      <div className="h-9 border-b border-white/10 bg-[#16171b] flex items-center justify-between px-3 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-red-400/80 rounded-[2px]" />
          <span className="w-2 h-2 bg-amber-300/80 rounded-[2px]" />
          <span className="w-2 h-2 bg-green-400/80 rounded-[2px]" />
        </div>
        <span className="font-mono tracking-wide">osmogrep runtime preview</span>
        <span className="inline-flex items-center gap-1.5 text-[10px] border border-white/10 px-2 py-0.5 rounded-sm">
          <span className="w-1.5 h-1.5 bg-emerald-400 pulse-dot" />
          live
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] min-h-[360px] bg-[#101218]">
        <div className="relative border-b md:border-b-0 md:border-r border-white/10 p-3 md:p-4">
          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-accent/12 to-transparent pointer-events-none scan-sweep" />
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Session Stream</div>
          <div className="font-mono text-[12px] md:text-[13px] leading-6 text-slate-300 space-y-1">
            {runLog.map((line, idx) => (
              <div key={line} className={`${idx % 2 === 0 ? 'text-slate-300' : 'text-slate-400'}`}>
                <span className="text-accent mr-2">{String(idx + 1).padStart(2, '0')}</span>
                {line}
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 md:p-4 bg-[#0d0f14]">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Patch Diff</div>
          <div className="bg-[#13161d]/70 px-3 py-2 text-[11px] text-slate-400 font-mono mb-1">
            auth_service.ts
          </div>
          <div className="font-mono text-[12px] md:text-[13px]">
            {diffLines.map((line, idx) => (
              <div
                key={`${line.n}-${idx}`}
                className={`px-3 py-1.5 border-b border-white/5 flex items-start gap-3 ${
                  line.kind === 'add'
                    ? 'bg-emerald-500/10 text-emerald-200'
                    : line.kind === 'del'
                      ? 'bg-red-500/10 text-red-200'
                      : 'bg-transparent text-slate-300'
                }`}
              >
                <span className="w-8 shrink-0 text-[10px] text-slate-500">{line.n}</span>
                <span>{line.kind === 'add' ? '+' : line.kind === 'del' ? '-' : '·'}</span>
                <span>{line.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
