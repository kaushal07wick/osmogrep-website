"use client";

import { useId, useState } from "react";
import { LuArrowRight, LuArrowUpRight, LuFolder, LuKeyRound, LuTerminal } from "react-icons/lu";
import { SiAnthropic, SiNpm, SiOpenai, SiRust } from "react-icons/si";
import CopyCommandBlock from "../components/CopyCommandBlock";
import styles from "./TerminalSetup.module.css";

const steps = [
  { label:"Install", detail:"Get the CLI", icon:SiNpm, heading:"Install once.", description:"The npm launcher downloads the native Rust binary for your machine. No Rust toolchain is needed.", command:"npm install -g osmogrep", location:"Your shell", note:"Requires Node.js 22.19+ for the npm launcher." },
  { label:"Open", detail:"Choose a project", icon:LuFolder, heading:"Start with your code.", description:"Launch inside the repository you want to work on. Its files, shell and Git history become your workspace.", command:"cd /path/to/your-repo\nosmogrep", location:"Your repository", note:"Use /permissions to choose the agent’s tool access." },
  { label:"Connect", detail:"Select your model", icon:LuKeyRound, heading:"Bring your preferred model.", description:"Add credentials with /key, then choose a provider and model with /model. Newly saved keys use the OS credential store.", command:"/key\n/model", location:"Inside OsmoGrep", note:"Run each slash command in the agent’s prompt." },
];
export default function TerminalSetup() {
  const [active,setActive]=useState(0);
  const headingId=useId(),current=steps[active],Icon=current.icon;
  return <div id="start-a-session" className={styles.setup}>
    <div className={styles.steps} role="group" aria-label="Quick start steps">{steps.map((step,index)=><button type="button" key={step.label} aria-pressed={active===index} onClick={()=>setActive(index)}><span className={styles.index}>0{index+1}</span><span><strong>{step.label}</strong><small>{step.detail}</small></span><LuArrowRight aria-hidden="true"/></button>)}</div>
    <div className={styles.panels} role="region" aria-labelledby={headingId}>
      <div className={styles.terminal}><div className={styles.terminalLabel}><LuTerminal aria-hidden="true"/><span>{current.location}</span><span>0{active+1} / 03</span></div><div className={styles.command}><span aria-hidden="true">{active===2?">":"$"}</span><CopyCommandBlock key={active} className={styles.copy} code={current.command}/></div><p>{current.note}</p><span className={styles.terminalFoot}><SiRust aria-hidden="true"/>Native Rust agent</span></div>
      <div className={styles.explanation}><Icon className={styles.stageIcon} aria-hidden="true"/><h3 id={headingId}>{current.heading}</h3><p>{current.description}</p>{active===0&&<a href="https://github.com/kaushal07wick/OsmoGrep/releases" target="_blank" rel="noreferrer">Download a binary instead<LuArrowUpRight aria-hidden="true"/></a>}{active===1&&<div className={styles.keyHint}><kbd>Esc</kbd>Interrupt an active run</div>}{active===2&&<div className={styles.providers}><SiOpenai aria-label="OpenAI"/><SiAnthropic aria-label="Anthropic"/><span>Custom endpoints<br/>&amp; local providers</span></div>}{active<2&&<button type="button" className={styles.next} onClick={()=>setActive(active+1)}>Next: {steps[active+1].label.toLowerCase()}<LuArrowRight aria-hidden="true"/></button>}</div>
    </div>
  </div>;
}
