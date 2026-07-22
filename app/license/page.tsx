export const metadata = { title: "License" };

export default function LicensePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <p className="type-eyebrow">Legal</p>
      <h1 className="mt-2 text-4xl font-medium">MIT License</h1>
      <p className="mt-6 text-ink/70 dark:text-paper/70">
        Research Atlas is released under the MIT License. You are free to
        use, copy, modify, merge, publish, distribute, sublicense, and sell
        copies of the software and its content, provided the original
        copyright notice and license text are included. The full license
        text ships in the repository&apos;s <code>LICENSE</code> file.
      </p>
      <p className="mt-4 text-ink/70 dark:text-paper/70">
        The software is provided &quot;as is&quot;, without warranty of any kind. See
        the repository&apos;s LICENSE file for the complete legal text.
      </p>
    </div>
  );
}
