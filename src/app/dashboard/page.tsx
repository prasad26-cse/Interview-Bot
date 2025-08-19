import { interviews } from "@/lib/data";
import DashboardClient from "@/components/dashboard-client";

export default function DashboardPage() {
  // In a real app, you'd fetch this data from an API
  const allInterviews = interviews;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Recruiter Dashboard</h1>
      <DashboardClient interviews={allInterviews} />
    </div>
  );
}
