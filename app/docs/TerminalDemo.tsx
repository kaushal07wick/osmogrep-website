"use client";

import { useEffect,useRef } from "react";
import styles from "./EngineeringGuides.module.css";

export default function TerminalDemo(){
  const ref=useRef<HTMLVideoElement>(null);
  useEffect(()=>{
    const video=ref.current!;
    const motion=matchMedia("(prefers-reduced-motion: reduce)");
    let visible=false,manuallyPaused=false,automaticPause=false;
    const sync=()=>{if(!visible||document.hidden||motion.matches||manuallyPaused){if(!video.paused){automaticPause=true;video.pause();}}else void video.play().catch(()=>{});};
    const paused=()=>{if(automaticPause){automaticPause=false;return;}manuallyPaused=true;};
    const played=()=>{manuallyPaused=false;};
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:0.1});
    observer.observe(video);sync();
    video.addEventListener("pause",paused);video.addEventListener("play",played);
    motion.addEventListener("change",sync);document.addEventListener("visibilitychange",sync);
    return()=>{observer.disconnect();motion.removeEventListener("change",sync);document.removeEventListener("visibilitychange",sync);video.removeEventListener("pause",paused);video.removeEventListener("play",played);video.pause();};
  },[]);
  return <video className={styles.demo} ref={ref} autoPlay loop muted playsInline controls preload="metadata" poster="/media/osmogrep-terminal-poster.jpg" width={1920} height={1094} aria-label="OsmoGrep terminal demo">
    <source src="/media/osmogrep-terminal.mp4" type="video/mp4"/>
    Your browser cannot play this video. <a href="/media/osmogrep-terminal.mp4">Open the terminal demo</a>.
  </video>;
}
