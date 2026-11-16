"use client";

import { useState } from "react";
import { SiOpenai,SiRust } from "react-icons/si";
import { LuActivity,LuCode,LuCpu,LuDatabase,LuFlaskConical,LuGitBranch,LuLayers,LuMessageSquare,LuShieldCheck,LuArrowUpRight } from "react-icons/lu";
import styles from "./ArchitectureMap.module.css";

const nodes=[
 {id:"request",title:"Review request",sub:"Dashboard or GitHub PR",icon:LuGitBranch,x:24,y:56,w:184,h:80,tag:"ENTRY",description:"A developer requests a source review, test run or repair against a specific pull-request revision.",facts:["GitHub identity and repository permissions are checked.","The requested head SHA is captured.","Opening a page does not request target execution."],boundary:"A request is permission to inspect the selected scope, not permission to merge.",link:"/docs/github"},
 {id:"admission",title:"Admission",sub:"Auth · limits · idempotency",icon:LuShieldCheck,x:270,y:56,w:184,h:80,tag:"NEXT.JS API",description:"The API validates the request, selects its workspace and persists the job before returning an ID.",facts:["Personal and team data have separate owners.","Current membership and role checks apply to team actions.","Idempotency and shared quotas prevent accidental duplicate work."],boundary:"The HTTP request does not have to stay open for the job to complete.",link:"/docs/api"},
 {id:"queue",title:"Durable queue",sub:"Jobs · leases · events",icon:LuDatabase,x:515,y:56,w:184,h:80,tag:"POSTGRESQL",description:"PostgreSQL is the shared coordination and persistence layer. A worker must hold a current lease to update a running job.",facts:["Claims use transactional row locking.","Worker-ID fencing rejects stale writes.","Model reservations, observations and publication state are retained separately."],boundary:"An expired execution is failed rather than silently replaying uncertain paid calls or tools.",link:"/docs/architecture#work-outlives-the-http-request"},
 {id:"worker",title:"Catcher worker",sub:"Trusted orchestration · E2B",icon:LuCpu,x:760,y:56,w:210,h:80,tag:"ON DEMAND",description:"A short-lived coordinator processes queued work. It owns phase transitions, cancellation, resource admission and cleanup.",facts:["Stops at its idle or maximum-lifetime bound.","Uses a separate environment from repository test execution.","Reuses the existing agent loop and sandbox adapters."],boundary:"Even a source-only assessment can incur coordinator compute; no target VM is not the same as zero infrastructure cost.",link:"/docs/runtime"},
 {id:"memory",title:"Team context",sub:"Selected channels · opt-in",icon:LuMessageSquare,x:24,y:260,w:184,h:100,tag:"OPTIONAL INPUT",description:"Relevant retained channel excerpts can add repository-specific decisions and constraints to an investigation.",facts:["An admin selects channels and maps them to a repository.","Selected channel context can inform console reviews for its mapped repository.","Messages remain untrusted context, not verified runtime facts."],boundary:"Joining a team or connecting Slack does not import every conversation or company member.",link:"/docs/security"},
 {id:"context",title:"Pinned context",sub:"Change · consumers · history",icon:LuLayers,x:270,y:260,w:184,h:100,tag:"KNOWLEDGE LAYER",description:"The engine builds a bounded context packet before asking a model for an assessment: what changed, what depends on it and what evidence supports the concern.",facts:["Base/head source and changed-hunk anchors are captured.","Manifests, tests, conventions and relevant consumers are retrieved selectively.","Revision-scoped IMPORTS/DEFINES facts and related history can be reused."],boundary:"The stored syntax graph is not a complete semantic call graph or production telemetry map.",link:"/docs/architecture#context-before-reasoning"},
 {id:"models",title:"Model roles",sub:"Investigator + advisor",icon:SiOpenai,x:515,y:260,w:184,h:100,tag:"SHARED BUDGET",description:"A primary model investigates, plans experiments and repairs. A smaller independent advisor challenges source reasoning and test validity when justified.",facts:["Current defaults: GPT-5.2 and GPT-5.4-mini.","Tools and output schemas are scoped to each phase.","All roles spend from the same request and token ledger."],boundary:"Model agreement and a persuasive explanation do not establish a reproduced bug.",link:"/docs/architecture#models-have-scoped-jobs"},
 {id:"source",title:"Source findings",sub:"Citations · suggested changes",icon:LuCode,x:760,y:260,w:210,h:100,tag:"NO TARGET VM",description:"Read-only source review can return specific findings and native GitHub suggestions without executing the target repository.",facts:["Findings require relevant source locations and causal reasoning.","Suggested fixes remain proposals for review.","Runtime-sensitive concerns can recommend a focused experiment."],boundary:"A source finding remains unverified until execution establishes the relevant behavior.",link:"/docs/findings"},
 {id:"terminal",title:"Terminal agent",sub:"Rust TUI · independent local workflow",icon:SiRust,x:24,y:464,w:430,h:90,tag:"SEPARATE APPLICATION",description:"The terminal remains a general coding agent. It works locally with its configured model, tools, sessions and permissions.",facts:["Ordinary coding does not automatically run the cloud PR pipeline.","Git, editing, shell and MCP capabilities remain available.","The cloud Catcher does not require the terminal TUI."],boundary:"Local coding sessions operate independently of cloud PR reviews.",link:"/docs/cli"},
 {id:"runtime",title:"Target sandboxes",sub:"Base → candidate → repair",icon:LuFlaskConical,x:515,y:464,w:184,h:90,tag:"EXPLICIT EXECUTION",description:"A frozen experiment runs against captured revisions in isolated E2B target sandboxes. Repair is attempted only within the configured execution scope.",facts:["The same test bytes and behavioral oracle are compared.","Original tests and environment identity are preserved.","Commands, exits, logs, patches and cleanup outcomes are retained."],boundary:"Missing setup, a false oracle or stale evidence yields a limited result, not a confirmed regression.",link:"/docs/evidence"},
 {id:"evidence",title:"Evidence & delivery",sub:"Saved report · dashboard · GitHub",icon:LuActivity,x:760,y:464,w:210,h:90,tag:"INSPECTABLE RESULT",description:"Reports join findings, execution observations and proposed corrections under a stable review identity. Publication retries independently of execution.",facts:["Source, test failure and verified repair are different states.","Individual attempts retain their original evidence.","A proposed patch is inspectable before a developer applies it."],boundary:"A successful run does not imply a published comment or an automatically merged fix.",link:"/docs/evidence"},
];
const edges=[
 {from:"request",to:"admission",d:"M208 96H270"},
 {from:"admission",to:"queue",d:"M454 96H515"},
 {from:"queue",to:"worker",d:"M699 96H760"},
 {from:"worker",to:"context",d:"M865 136V180Q865 196 849 196H378Q362 196 362 212V260"},
 {from:"memory",to:"context",d:"M208 310H270",optional:true},
 {from:"context",to:"models",d:"M454 310H515"},
 {from:"models",to:"source",d:"M699 310H760"},
 {from:"models",to:"runtime",d:"M607 360V464",optional:true},
 {from:"source",to:"evidence",d:"M865 360V464"},
 {from:"runtime",to:"evidence",d:"M699 509H760"},
];
export default function ArchitectureDiagram(){
  const [selected,setSelected]=useState("context");
  const node=nodes.find(item=>item.id===selected)!;const Icon=node.icon;
  return <figure className={styles.map}>
    <figcaption><span>SYSTEM MAP</span><label className={styles.selector}>Explore<select aria-label="Explore architecture component" value={selected} onChange={event=>setSelected(event.target.value)}>{nodes.map(item=><option value={item.id} key={item.id}>{item.title}</option>)}</select></label></figcaption>
    <div className={styles.scroll} tabIndex={0} role="region" aria-label="Interactive Catcher architecture map">
      <div className={styles.canvas}>
        <svg viewBox="0 0 1000 590" aria-hidden="true" className={styles.wires}>
          <defs><marker id="architecture-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#aaa69d"/></marker><marker id="architecture-arrow-active" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#ea580c"/></marker></defs>
          <text x="25" y="29">REQUEST & CONTROL</text><text x="25" y="234">CONTEXT & REASONING</text><text x="515" y="438">EXECUTION & RESULTS</text>
          <rect x="499" y="449" width="216" height="120" className={styles.isolation}/>
          {edges.map(edge=>{const active=edge.from===selected||edge.to===selected;return <path key={edge.from+edge.to} d={edge.d} className={styles.edge} data-active={active} data-optional={edge.optional||undefined} markerEnd={`url(#architecture-arrow${active?"-active":""})`}/>;})}
          <text x="622" y="410" className={styles.gate}>when requested</text>
        </svg>
        {nodes.map(item=>{const NodeIcon=item.icon;return <button key={item.id} className={styles.node} data-active={selected===item.id} data-separate={item.id==="terminal"||undefined} aria-pressed={selected===item.id} aria-label={item.title} onClick={()=>setSelected(item.id)} style={{left:`${item.x/10}%`,top:`${item.y/5.9}%`,width:`${item.w/10}%`,height:`${item.h/5.9}%`}}><span className={styles.nodeTag}>{item.tag}</span><span className={styles.nodeTitle}><NodeIcon aria-hidden="true"/>{item.title}</span><small>{item.sub}</small></button>;})}
      </div>
    </div>
    <div className={styles.inspector} aria-live="polite"><div className={styles.inspectorTitle}><Icon aria-hidden="true"/><span>{node.tag}</span><h3>{node.title}</h3><p>{node.description}</p></div><div className={styles.inspectorDetail}><ul>{node.facts.map(fact=><li key={fact}>{fact}</li>)}</ul><p>{node.boundary}</p><a href={node.link}>Read the guide<LuArrowUpRight aria-hidden="true"/></a></div></div>
    <div className={styles.legend}><span><i/>Normal flow</span><span><i data-optional/>Enabled or requested explicitly</span><span>Source analysis and repository execution have separate boundaries.</span></div>
  </figure>;
}
