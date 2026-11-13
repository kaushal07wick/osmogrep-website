export default function ArchitectureDiagram() {
  return <figure className="docs-architecture">
    <figcaption>From request to result <span>System diagram</span></figcaption>
    <div className="docs-diagram-scroll" tabIndex={0} role="region" aria-label="Execution flow diagram, scroll horizontally on small screens">
      <svg viewBox="0 0 720 610" role="img" aria-labelledby="execution-flow-title execution-flow-desc">
        <title id="execution-flow-title">How a hosted OsmoGrep request is handled</title>
        <desc id="execution-flow-desc">A console request or GitHub command is validated and queued. The requested job either reviews source code or runs tests in an isolated VM. Both paths save results for the dashboard and GitHub. Source review does not automatically start a VM.</desc>
        <defs><marker id="execution-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="currentColor" strokeWidth="1.5" /></marker></defs>
        <g className="docs-diagram-connectors" fill="none" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#execution-arrow)">
          <path d="M360 90V132" />
          <path d="M360 210V238H186V278" />
          <path d="M360 210V238H534V278" />
          <path d="M186 382V412H360V444" />
          <path d="M534 382V412H360" markerEnd="none" />
          <path d="M360 518V544H186V567" />
          <path d="M360 518V544H534V567" />
        </g>
        <g className="docs-diagram-nodes">
          <rect x="36" y="24" width="648" height="66" rx="6" />
          <rect x="36" y="134" width="648" height="76" rx="6" />
          <rect x="36" y="278" width="300" height="104" rx="6" />
          <rect className="docs-diagram-runtime" x="384" y="278" width="300" height="104" rx="6" />
          <rect x="36" y="446" width="648" height="72" rx="6" />
        </g>
        <g textAnchor="middle">
          <text className="docs-diagram-title" x="360" y="51">1. Request a review or a runtime check</text>
          <text x="360" y="75">Web console or GitHub PR command</text>
          <text className="docs-diagram-title" x="360" y="164">2. Check permissions &amp; queue the job</text>
          <text x="360" y="190">API + PostgreSQL · ownership, limits and progress</text>
          <text className="docs-diagram-title" x="186" y="310">3A. Source review</text>
          <text x="186" y="339">Inspect the change for bugs.</text>
          <text x="186" y="363">No VM is started.</text>
          <text className="docs-diagram-title" x="534" y="310">3B. Runtime check</text>
          <text x="534" y="339">Tests in an isolated VM.</text>
          <text x="534" y="363">Can propose and check a fix.</text>
          <text className="docs-diagram-title" x="360" y="475">4. Save the result &amp; evidence</text>
          <text x="360" y="501">Findings, command output and any proposed patch</text>
          <text className="docs-diagram-title" x="186" y="592">Dashboard</text>
          <text className="docs-diagram-title" x="534" y="592">GitHub PR</text>
        </g>
      </svg>
    </div>
    <p className="docs-diagram-caption">The job type selects the path. Reading code does not automatically start a VM.</p>
  </figure>;
}
