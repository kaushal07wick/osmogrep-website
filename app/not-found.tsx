import Link from "next/link";
import BugRunner from "./components/BugRunner";
import "./bug-runner.css";

export default function NotFound() {
  return (
    <main className="missing-page">
      <div className="missing-heading">
        <span>404 // ROUTE_NOT_FOUND</span>
        <h1>Well. That’s a bug.</h1>
        <p>This page is missing. Your reflexes don’t have to be.</p>
      </div>
      <BugRunner />
      <nav className="missing-exits" aria-label="Leave the missing page">
        <Link href="/" aria-label="Back to home">← Back to home</Link>
        <Link href="/web">Open the console ↗</Link>
      </nav>
    </main>
  );
}
