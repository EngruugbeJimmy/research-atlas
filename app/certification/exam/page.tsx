import { ExamRunner } from "@/components/certification/exam-runner";

export const metadata = {
  title: "Certification Exam",
  description: "A 25-question exam drawn from every Research Atlas mission. Pass with 70% or higher to unlock your certificate.",
};

export default function ExamPage() {
  return <ExamRunner />;
}
