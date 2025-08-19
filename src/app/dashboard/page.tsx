
import DashboardClient from "@/components/dashboard-client";
import { interviews, roles } from "@/lib/data";
import type { Interview, Role } from "@/lib/types";

async function getDashboardData() {
  // In a real app, you would fetch this from your database.
  // Here, we're using mock data.
  const interviewList = interviews as Interview[];
  const roleList = roles as Role[];
  
  return { interviews: interviewList, roles: roleList };
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
