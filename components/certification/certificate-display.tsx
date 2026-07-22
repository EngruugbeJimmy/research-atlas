import { forwardRef } from "react";
import { Compass } from "lucide-react";

interface CertificateDisplayProps {
  learnerName: string;
  completionDate: string; // pre-formatted display string
  certificateId: string;
}

export const CertificateDisplay = forwardRef<HTMLDivElement, CertificateDisplayProps>(
  ({ learnerName, completionDate, certificateId }, ref) => {
    return (
      <div
        ref={ref}
        className="relative mx-auto aspect-[1.414/1] w-full max-w-3xl overflow-hidden bg-[#f7f3e8] p-10 text-[#1f2d2a] shadow-2xl md:p-14"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        {/* Border frame */}
        <div className="absolute inset-4 border-2 border-[#2f6f5e]/70 md:inset-6" />
        <div className="absolute inset-5 border border-[#2f6f5e]/30 md:inset-7" />

        <div className="relative flex h-full flex-col items-center justify-between text-center">
          <div>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#2f6f5e] text-[#2f6f5e]">
              <Compass className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.3em] text-[#2f6f5e]">
              Research Atlas
            </p>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#5b6b63]">
              Certificate of Achievement
            </p>
            <p className="mt-6 text-sm text-[#5b6b63]">This certifies that</p>
            <h1 className="mt-3 px-4 text-3xl md:text-5xl" style={{ fontFamily: "'Palatino Linotype', Georgia, serif" }}>
              {learnerName || "Your Name"}
            </h1>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-[#5b6b63]">
              has successfully completed all thirteen missions of the Research
              Atlas curriculum, demonstrating applied proficiency in
              statistics, GIS, machine learning, and scientific research
              methods through the Bluewater Basin investigation.
            </p>
          </div>

          <div className="flex w-full items-end justify-between text-left text-xs text-[#5b6b63]">
            <div>
              <p className="border-t border-[#2f6f5e]/50 pt-1 font-medium text-[#1f2d2a]">
                Atlas AI
              </p>
              <p>Instructor, Research Atlas</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#5b6b63]/70">
                Certificate ID
              </p>
              <p className="font-mono text-[10px]">{certificateId}</p>
            </div>
            <div className="text-right">
              <p className="border-t border-[#2f6f5e]/50 pt-1 font-medium text-[#1f2d2a]">
                {completionDate}
              </p>
              <p>Date of Completion</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CertificateDisplay.displayName = "CertificateDisplay";
