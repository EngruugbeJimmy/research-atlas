"use client";

import { useRef } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { CertificateDisplay } from "@/components/certification/certificate-display";
import { CertificateActions } from "@/components/certification/certificate-actions";

export function CertificatePageContent() {
  const { hydrated, progress } = useProgress();
  const certRef = useRef<HTMLDivElement>(null);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <div className="aspect-[1.414/1] w-full animate-pulse rounded-2xl bg-basin-500/5" />
      </div>
    );
  }

  if (!progress.certificate.earned) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center md:px-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-basin-500/10 text-basin-500">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="mt-5 font-display text-2xl">No certificate yet</h1>
        <p className="mt-2 text-sm text-ink/60 dark:text-paper/60">
          Complete every mission and pass the certification exam to unlock your certificate.
        </p>
        <Link
          href="/certification"
          className="mt-6 inline-block rounded-full bg-basin-500 px-6 py-2.5 text-sm font-medium text-paper hover:bg-basin-600"
        >
          Go to certification
        </Link>
      </div>
    );
  }

  const { certificate } = progress;
  const completionDate = certificate.issuedISODate
    ? new Date(certificate.issuedISODate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
  const certificateId = `RA-${certificate.issuedISODate ? new Date(certificate.issuedISODate).getTime().toString(36).toUpperCase() : "PENDING"}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <div className="text-center">
        <p className="type-eyebrow">Congratulations</p>
        <h1 className="mt-2 text-3xl font-medium md:text-4xl">Your Certificate</h1>
        <p className="mt-2 text-sm text-ink/60 dark:text-paper/60">
          Download it, or share it directly to your network.
        </p>
      </div>

      <div className="mt-10">
        <CertificateDisplay
          ref={certRef}
          learnerName={certificate.learnerName}
          completionDate={completionDate}
          certificateId={certificateId}
        />
      </div>

      <CertificateActions targetRef={certRef} learnerName={certificate.learnerName} />
    </div>
  );
}
