
import ReportView from "@/components/report-view";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { FullInterview, Interview, Role } from "@/lib/types";

async function getInterviewDetails(id: string): Promise<FullInterview | null> {
    const supabase = createClient();
    
    const { data, error } = await supabase
        .from('interviews')
        .select(`
            *,
            role:roles(*),
            candidate:profiles(*)
        `)
        .eq('id', id)
        .single();
    
    if (error || !data) {
        console.error("Error fetching interview details:", error);
        return null;
    }

    const interviewData = data as any;

    return {
        id: interviewData.id,
        roleId: interviewData.roleId,
        status: interviewData.status,
        createdAt: interviewData.created_at,
        submittedAt: interviewData.submitted_at,
        evaluation: interviewData.evaluation,
        responses: interviewData.responses,
        role: {
            id: interviewData.role.id,
            title: interviewData.role.title,
            slug: interviewData.role.slug,
            description: interviewData.role.description,
        },
        candidate: {
            id: interviewData.candidate.id,
            name: interviewData.candidate.full_name,
            email: interviewData.candidate.email,
            role: interviewData.candidate.role,
            avatarUrl: interviewData.candidate.avatar_url,
        }
    }
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
