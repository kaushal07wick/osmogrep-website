/* Next.js remounts this on every navigation, so its animation is the page transition:
   an orange bar sweeps across the top while the new page fades and lifts in. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="page-sweep pointer-events-none fixed inset-x-0 top-14 z-[240] h-[2px] origin-left bg-accent" aria-hidden="true" />
      <div className="page-enter">{children}</div>
    </>
  );
}
