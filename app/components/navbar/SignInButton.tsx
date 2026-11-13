"use client";

import { useEffect, useRef, useState } from "react";
import { consoleOrigin, dashboardUrl } from "../../../lib/console";
import { GithubIcon } from "../ui/icons";
import LogoMark from "../LogoMark";

export default function SignInButton() {
  const [user, setUser] = useState<{
    name: string;
    username: string | null;
  } | null>(null);
  const [checking, setChecking] = useState(true);
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    let active = true;
    let controller: AbortController | undefined;
    async function refresh() {
      controller?.abort();
      const current = new AbortController();
      controller = current;
      try {
        const response = await fetch(`${consoleOrigin}/api/account/session`, {
          credentials: "include",
          cache: "no-store",
          signal: AbortSignal.any([current.signal, AbortSignal.timeout(8000)]),
        });
        if (!response.ok) throw Error("Session unavailable");
        const data = await response.json();
        if (active && controller === current) setUser(data.user);
      } catch {
        if (active && !current.signal.aborted) setUser(null);
      } finally {
        if (active && controller === current) setChecking(false);
      }
    }
    const focus = () => {
      void refresh();
    };
    const close = (event: PointerEvent) => {
      if (menu.current && !menu.current.contains(event.target as Node))
        menu.current.open = false;
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu.current?.open) {
        menu.current.open = false;
        menu.current.querySelector("summary")?.focus();
      }
    };
    void refresh();
    window.addEventListener("focus", focus);
    window.addEventListener("pageshow", focus);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      active = false;
      controller?.abort();
      window.removeEventListener("focus", focus);
      window.removeEventListener("pageshow", focus);
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  return (
    <div className="nav-session">
      {user && (
        <details ref={menu} className="nav-session-account">
          <summary aria-label={`Account: ${user.username || user.name}`}>
            <LogoMark className="nav-session-mark" />
            <span>{user.username || user.name}</span>
            <i aria-hidden="true">⌄</i>
          </summary>
          <div className="nav-session-menu">
            <strong>{user.name}</strong>
            <span>
              {user.username ? `@${user.username}` : "GitHub connected"}
            </span>
            <a href={dashboardUrl}>
              Open dashboard <span aria-hidden="true">↗</span>
            </a>
            <form action={`${consoleOrigin}/api/account/logout`} method="post">
              <button type="submit">
                Log out <span aria-hidden="true">↗</span>
              </button>
            </form>
          </div>
        </details>
      )}
      <a href={dashboardUrl} className="group nav-session-action">
        <span className="nav-session-dissolve" aria-hidden="true">
          {Array.from({ length: 32 }, (_, i) => (
            <span
              key={i}
              className="nav-dissolve"
              style={{ transitionDelay: `${((i * 13) % 32) * 9}ms` }}
            />
          ))}
        </span>
        {!user && <GithubIcon className="relative h-4 w-4" />}
        <span className="relative">
          {checking ? "Workspace" : user ? "Dashboard" : "Sign in"}
        </span>
        {user && (
          <span className="relative" aria-hidden="true">
            ↗
          </span>
        )}
      </a>
    </div>
  );
}
