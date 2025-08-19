
import ReportView from "@/components/report-view";
import { notFound } from "next/navigation";
import type { FullInterview } from "@/lib/types";
import { interviews } from "@/lib/data";

async function getInterviewDetails(id: string): Promise<FullInterview | null> {
    // In a real app, this would be a database call.
    // Here we find the interview in our mock data.
    const interview = interviews.find(i => i.id === id);
    
    if (!interview) {
        return null;
    }

    return interview as FullInterview;
}


export default async function ReportPage({ params }: { params: { id: string } }) {
  const interview = await getInterviewDetails(params.id);
  
  if (!interview) {
    notFound();
  }

  return (
    <div className="bg-gray-50 dark:bg-background min-h-screen">
      <div className="container mx-auto py-10">
        <ReportView interview={interview} />
      </div>
    </div>
  );
}
