
import DashboardClient from "@/components/dashboard-client";
import { createClient } from "@/lib/supabase/server";
import type { Interview, Role } from "@/lib/types";

async function getDashboardData() {
  const supabase = createClient();

  const { data: interviews, error: interviewsError } = await supabase
    .from('interviews')
    .select(`*, candidate:profiles(*)`);
  
  const { data: roles, error: rolesError } = await supabase
    .from('roles')
    .select('*');

  if (interviewsError || rolesError) {
    console.error("Error fetching dashboard data:", interviewsError || rolesError);
    return { interviews: [], roles: [] };
  }
  
  // The 'candidate' field is an object from the profiles table.
  // We need to adjust the type to match what the client component expects.
  const interviewList = interviews.map(interview => ({
      ...interview,
      candidate: {
          id: interview.candidate.id,
          name: interview.candidate.full_name,
          email: interview.candidate.email,
          role: interview.candidate.role,
          avatarUrl: interview.candidate.avatar_url,
      }
  })) as unknown as Interview[];
  
  return { interviews: interviewList, roles: roles as Role[] };
}


export default async function DashboardPage() {
  const { interviews, roles } = await getDashboardData();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Recruiter Dashboard</h1>
      <DashboardClient interviews={interviews} allRoles={roles} />
    </div>
  );
}
