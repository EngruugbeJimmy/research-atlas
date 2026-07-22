export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <p className="type-eyebrow">Legal</p>
      <h1 className="mt-2 text-4xl font-medium">Privacy</h1>
      <div className="mt-6 space-y-4 text-ink/80 dark:text-paper/80">
        <p>
          Research Atlas stores your learning progress entirely in your
          browser&apos;s <code>localStorage</code>. No account is required, and
          no personal data is sent to any server.
        </p>
        <p>
          Vercel Analytics is used to measure aggregate page views. It does
          not use cookies and does not collect personally identifiable
          information. See{" "}
          <a
            href="https://vercel.com/docs/analytics/privacy-policy"
            className="text-basin-500 underline"
          >
            Vercel&apos;s privacy documentation
          </a>{" "}
          for details.
        </p>
        <p>
          If you use the <strong>Ask Atlas</strong> feature, the text you
          type is sent to Anthropic&apos;s API to generate a response. Anthropic&apos;s
          usage policies and privacy policy apply to that interaction. No
          conversation history is stored on Research Atlas servers.
        </p>
        <p>
          Clearing your browser&apos;s site data at any time removes all locally
          stored progress.
        </p>
      </div>
    </div>
  );
}
