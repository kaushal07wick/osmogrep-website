"use client";

import { useEffect, useState } from "react";
import { consoleOrigin, dashboardUrl } from "../../../lib/console";
import { GithubIcon } from "../ui/icons";

export default function SignInButton() {
  const [user, setUser] = useState<{
    name: string;
    username: string | null;
  } | null>(null);
  const [checking, setChecking] = useState(true);
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
    void refresh();
    window.addEventListener("focus", focus);
    window.addEventListener("pageshow", focus);
    return () => {
      active = false;
      controller?.abort();
      window.removeEventListener("focus", focus);
      window.removeEventListener("pageshow", focus);
    };
  }, []);
  return (
    <div className="nav-session">
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
