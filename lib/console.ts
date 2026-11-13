const base = new URL(process.env.NEXT_PUBLIC_CONSOLE_URL || (process.env.NODE_ENV === "development" ? "http://127.0.0.1:3001" : "https://app.osmogrep.com"));
export const consoleUrl = base.toString();
base.searchParams.set("example", "checkout");
export const exampleUrl = base.toString();
