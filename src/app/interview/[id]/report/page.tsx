import ReportView from "@/components/report-view";
import { interviews, roles } from "@/lib/data";
import { notFound } from "next/navigation";

export default function ReportPage({ params }: { params: { id: string } }) {
  const interview = interviews.find((i) => i.id === params.id);
  
  if (!interview) {
    notFound();
  }

  const role = roles.find((r) => r.id === interview.roleId);

  if (!role) {
    notFound();
  }
  
  const fullInterviewData = {
    ...interview,
    role,
  }

  return (
    <div className="bg-gray-50 dark:bg-background min-h-screen">
      <div className="container mx-auto py-10">
        <ReportView interview={fullInterviewData} />
      </div>
    </div>
  );
}
