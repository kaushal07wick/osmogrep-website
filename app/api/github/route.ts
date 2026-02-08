import { NextResponse } from 'next/server';

const REPO_OWNER = 'kaushal07wick';
const REPO_NAME = 'OsmoGrep';

export async function GET() {
  try {
    const repoRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 3600 },
    });

    if (!repoRes.ok) {
      return NextResponse.json({ stars: 0, forks: 0, commits: 0 }, { status: 200 });
    }

    const repo = await repoRes.json();
    const stars = repo.stargazers_count ?? 0;
    const forks = repo.forks_count ?? 0;

    const commitsRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=1`, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 3600 },
    });

    let commits = 0;
    const link = commitsRes.headers.get('link') || '';
    const match = link.match(/&page=(\d+)>; rel="last"/);
    if (match) {
      commits = Number(match[1]);
    } else if (commitsRes.ok) {
      const json = await commitsRes.json();
      commits = Array.isArray(json) ? json.length : 0;
    }

    return NextResponse.json({ stars, forks, commits }, { status: 200 });
  } catch {
    return NextResponse.json({ stars: 0, forks: 0, commits: 0 }, { status: 200 });
  }
}
