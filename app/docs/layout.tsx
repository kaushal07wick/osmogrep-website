import DocsShell from "./DocsShell";
import "./docs.css";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <DocsShell>{children}</DocsShell>;
}
