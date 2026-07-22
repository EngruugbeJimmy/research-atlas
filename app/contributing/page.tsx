export const metadata = { title: "Contributing" };

export default function ContributingPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <p className="type-eyebrow">Open source</p>
      <h1 className="mt-2 text-4xl font-medium">Contribute</h1>
      <div className="mt-6 space-y-4 text-ink/70 dark:text-paper/70">
        <p>
          Research Atlas is open-source and welcoming of contributions. The
          highest-value things to add right now are new lesson content for
          Missions 02–12, additional interactive simulations, and peer
          review of the existing scientific content in Missions 00 and 01.
        </p>
        <p>
          Before contributing, read the{" "}
          <code className="font-mono text-sm">CONTRIBUTING.md</code> in the
          repository, which covers the mandatory lesson structure (story,
          plain English, math, simulation, code, research connection, quiz,
          challenge, teach-back), the Bluewater Basin data conventions, and
          the PR review process.
        </p>
        <p>
          All content must use Bluewater Basin data, not real-world
          unpublished datasets. All scientific claims should be accurate and
          beginner-accessible. See the repository for the full contribution
          guide.
        </p>
      </div>
    </div>
  );
}
