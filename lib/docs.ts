export const docs = [
  { slug: "", title: "Quickstart", group: "Getting started", description: "Choose a workflow and understand what happens next." },
  { slug: "bug-catching", title: "Bug-catching engine", group: "Understand", description: "How source concerns become reproducible, inspectable evidence." },
  { slug: "findings", title: "Findings & severity", group: "Understand", description: "Read a finding, assess its impact, and decide what to verify." },
  { slug: "evidence", title: "Evidence & verification", group: "Understand", description: "Understand findings, reproduced failures, and verified repairs." },
  { slug: "console", title: "Web console", group: "Workflows", description: "Connect GitHub, choose repositories, and inspect a pull request." },
  { slug: "github", title: "GitHub integration", group: "Workflows", description: "App permissions, PR commands, webhook setup, and delivery behavior." },
  { slug: "runtime", title: "Runtime checks", group: "Workflows", description: "Run focused checks in an isolated workspace." },
  { slug: "coding-agents", title: "Codex & Claude Code", group: "Workflows", description: "Set up the MCP server and verification skill." },
  { slug: "cli", title: "Terminal CLI", group: "Workflows", description: "Install the Rust TUI and learn its session controls." },
  { slug: "examples", title: "Examples & recipes", group: "Workflows", description: "A small regression you can reproduce, plus setup recipes for existing projects." },
  { slug: "configuration", title: "Configuration", group: "Reference", description: "Project recipes, worker settings, and client configuration." },
  { slug: "api", title: "HTTP API", group: "Reference", description: "The console’s authenticated job interface, states, and errors." },
  { slug: "security", title: "Permissions & data", group: "Reference", description: "Source access, isolation boundaries, credentials, and retained evidence." },
  { slug: "troubleshooting", title: "Troubleshooting", group: "Reference", description: "Resolve setup problems and understand current limits." },
  { slug: "architecture", title: "Architecture", group: "Engineering", description: "The control plane, workers, sandbox lifecycle, and result delivery." },
  { slug: "design-system", title: "Design system", group: "Engineering", description: "Paper, ink, pixels: the tokens and components behind OsmoGrep." },
] as const;
export const docHref = (slug: string) => slug ? `/docs/${slug}` : "/docs";
