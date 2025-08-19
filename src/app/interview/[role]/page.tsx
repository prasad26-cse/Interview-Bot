import { createInterview } from "@/lib/actions";
import { notFound } from "next/navigation";
import InterviewPlayer from "@/components/interview-player";

export default async function InterviewPage({ params }: { params: { role: string } }) {
  const interviewData = await createInterview(params.role);

  if (!interviewData) {
    notFound();
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50">
      <InterviewPlayer interviewData={interviewData} />
    </div>
  );
}
