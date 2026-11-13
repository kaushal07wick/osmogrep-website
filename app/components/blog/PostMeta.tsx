const displayDate = (value: string) => new Date(`${value}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
export default function PostMeta({ date, updated, author, readingMinutes }: { date: string; updated?: string; author: string; readingMinutes: number }) {
  return <div className="post-meta"><time dateTime={date}>{displayDate(date)}</time><span aria-hidden="true">/</span><span>{readingMinutes} min read</span><span aria-hidden="true">/</span><span>{author}</span>{updated && updated !== date && <><span aria-hidden="true">/</span><span>Updated <time dateTime={updated}>{displayDate(updated)}</time></span></>}</div>;
}
