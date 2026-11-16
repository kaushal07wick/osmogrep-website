import Link from "next/link";
import { SiRust, SiOpenai, SiAnthropic } from "react-icons/si";
import { LuArrowUpRight, LuCode, LuGitBranch, LuKeyboard, LuShieldCheck } from "react-icons/lu";
import CopyCommandBlock from "../components/CopyCommandBlock";
import TerminalDemo from "./TerminalDemo";
import styles from "./EngineeringGuides.module.css";

const source="https://github.com/kaushal07wick/OsmoGrep";
export default function TerminalGuide(){
  return <>
    <section id="watch-the-terminal" className={styles.section}>
      <h2 className="sr-only">Terminal walkthrough</h2>
      <TerminalDemo/>
      <div className={styles.capabilities}>{[
        {icon:LuGitBranch,title:"Inside your project",text:"Read source, edit files and run local commands through the agent’s tools."},
        {icon:LuCode,title:"Choose your model",text:"Select a provider and model. Bring your own credentials or a local endpoint."},
        {icon:LuShieldCheck,title:"Control tool access",text:"Choose permissions, inspect changes and interrupt an active run with Escape."},
      ].map(({icon:Icon,title,text})=><div key={title}><Icon aria-hidden="true"/><h3>{title}</h3><p>{text}</p></div>)}</div>
    </section>
    <section id="install" className={styles.section}>
      <div className={styles.sectionHeading}><span className={styles.number}>01</span><div><h2>Install. Open a project. Start coding.</h2><p>The npm launcher downloads the matching Rust binary on first launch.</p></div></div>
      <CopyCommandBlock code="npm install -g osmogrep"/>
      <div className={styles.requirements}><SiRust aria-hidden="true"/><span>Rust binary</span><span>Node.js 22.19+ for the npm launcher</span><a href={`${source}/releases`} target="_blank" rel="noreferrer">Release downloads<LuArrowUpRight aria-hidden="true"/></a></div>
      <details className="docs-details"><summary>Shell installer or build from source</summary><h3>Shell installer</h3><CopyCommandBlock code="curl -fsSL https://osmogrep.com/install.sh | sh"/><h3>Build with Rust 1.89+</h3><CopyCommandBlock code={`cargo install --git ${source} --locked`}/></details>
    </section>
    <section id="start-a-session" className={styles.section}>
      <div className={styles.sectionHeading}><span className={styles.number}>02</span><div><h2>Give the agent a real workspace.</h2><p>Start in the repository you want to work on.</p></div></div>
      <CopyCommandBlock code={`cd /path/to/your-repo\nosmogrep`}/>
      <div className={styles.sessionSteps}><div><span>CONNECT</span><h3>Set up your model</h3><p>Use <code>/key</code> for credentials and <code>/model</code> to choose the active model. Newly saved keys use the OS credential store.</p><div className={styles.providerMarks}><SiOpenai aria-label="OpenAI"/><SiAnthropic aria-label="Anthropic"/><span>Custom endpoints &amp; local providers</span></div></div><div><span>ASK</span><h3>Describe the outcome</h3><p>Include the behavior you expect and the command that checks it. The agent can gather source context as it works.</p><blockquote>Inspect the retry change. Reproduce the failure, make a small fix, and rerun the relevant tests.</blockquote></div></div>
      <p className={styles.note}>The Rust terminal agent is a separate application from the cloud Catcher. A normal coding session does not automatically start the hosted PR-verification pipeline.</p>
    </section>
    <section id="shell" className={styles.section}>
      <div className={styles.sectionHeading}><span className={styles.number}>03</span><div><h2>Keep the shell within reach.</h2><p>Prefix a command with <code>!</code> to execute it locally in the terminal session.</p></div></div>
      <CopyCommandBlock code={`!git status\n!rg "retry|timeout" src\n!cargo test -q`}/>
      <div className={styles.controlNote}><LuShieldCheck aria-hidden="true"/><p><code>/permissions</code> controls tool access. Review the diff before accepting a change; <code>/undo</code> restores the last captured file edit.</p></div>
    </section>
    <section id="slash" className={styles.section}>
      <div className={styles.sectionHeading}><LuKeyboard className={styles.headingIcon} aria-hidden="true"/><div><h2>A few controls to remember.</h2><p>The installed version’s <code>/help</code> is the complete command reference.</p></div></div>
      <div className={styles.commandGrid}>{[
        ["/model","Provider & model","Choose the model and API connection."],
        ["/permissions","Tool access","Select the permission mode for your session."],
        ["/sessions","Session history","Find, resume or fork a saved conversation."],
        ["/usage","Token usage","Inspect recorded input, output and cache reuse."],
        ["/settings","Make it yours","Appearance, shortcuts and workspace controls."],
        ["/verify","Verification ledger","Inspect the terminal agent’s recorded verification."],
      ].map(([command,title,text])=><div key={command}><code>{command}</code><h3>{title}</h3><p>{text}</p></div>)}</div>
      <div className={styles.shortcuts}><span><kbd>Esc</kbd>Interrupt the active run</span><span><kbd>⌘ ←</kbd><span>or</span><kbd>Ctrl S</kbd>Session switcher</span><span><code>/exit</code>Close the app</span></div>
      <div className={styles.sourceLinks}><a href={`${source}/blob/master/docs/reference.md`} target="_blank" rel="noreferrer">Full terminal reference<LuArrowUpRight aria-hidden="true"/></a><Link href="/docs/architecture">How cloud verification works<LuArrowUpRight aria-hidden="true"/></Link></div>
    </section>
  </>;
}
