import type { Metadata } from "next";
import { DocArticle, Quickstart } from "./content";
export const metadata: Metadata = { title: "Documentation", alternates: { canonical: "/docs" }, description: "Set up the OsmoGrep console, terminal CLI, and Codex or Claude Code verification workflow." };
export default function Page() { return <DocArticle slug=""><Quickstart /></DocArticle>; }
