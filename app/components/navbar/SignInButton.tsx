import { consoleUrl } from '../../../lib/console';
import { GithubIcon } from './icons';

/** Sign-in cell. On hover a grid of squares flips to orange in scattered order (pixel dissolve). */
export default function SignInButton() {
  return (
    <a href={consoleUrl} className="group relative flex items-center gap-2.5 overflow-hidden bg-ink px-5 font-medium text-white sm:px-6">
      <span className="absolute inset-0 grid grid-cols-8 grid-rows-4" aria-hidden="true">
        {Array.from({ length: 32 }, (_, i) => (
          <span key={i} className="nav-dissolve bg-accent" style={{ transitionDelay: `${((i * 13) % 32) * 9}ms` }} />
        ))}
      </span>
      <GithubIcon className="relative h-4 w-4" />
      <span className="relative">Sign in</span>
    </a>
  );
}
