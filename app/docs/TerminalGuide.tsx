import Link from "next/link";
import { LuArrowUpRight, LuCode, LuGitBranch, LuKeyboard, LuShieldCheck, LuTerminal } from "react-icons/lu";
import CopyCommandBlock from "../components/CopyCommandBlock";
import TerminalDemo from "./TerminalDemo";
import TerminalSetup from "./TerminalSetup";
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
      <div className={styles.sectionHeading}><LuTerminal className={styles.headingIcon} aria-hidden="true"/><div><h2>Start in your repository.</h2><p>Install the CLI, open your project and connect a model.</p></div></div>
      <TerminalSetup/>
      <details className="docs-details"><summary>Shell installer or build from source</summary><h3>Shell installer</h3><CopyCommandBlock code="curl -fsSL https://osmogrep.com/install.sh | sh"/><h3>Build with Rust 1.89+</h3><CopyCommandBlock code={`cargo install --git ${source} --locked`}/></details>
      <p className={styles.note}>For hosted pull request reviews, use the <Link href="/docs/console">dashboard workflow</Link>.</p>
    </section>
    <section id="shell" className={styles.section}>
      <div className={styles.sectionHeading}><LuTerminal className={styles.headingIcon} aria-hidden="true"/><div><h2>Keep the shell within reach.</h2><p>Prefix a command with <code>!</code> to execute it locally in the terminal session.</p></div></div>
      <CopyCommandBlock code="!git status"/><p>Use your project’s commands in the same way, such as <code>!npm test</code> or <code>!cargo test</code>.</p>
      <div className={styles.controlNote}><LuShieldCheck aria-hidden="true"/><p><code>/permissions</code> controls tool access. Review the diff before accepting a change; <code>/undo</code> restores the last captured file edit.</p></div>
    </section>
    <section id="slash" className={styles.section}>
      <div className={styles.sectionHeading}><LuKeyboard className={styles.headingIcon} aria-hidden="true"/><div><h2>A few controls to remember.</h2><p>Use <code>/help</code> to browse all commands.</p></div></div>
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
