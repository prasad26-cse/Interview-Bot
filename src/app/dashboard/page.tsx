
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DashboardClient from "@/components/dashboard-client";
import type { Interview, Role } from "@/lib/types";

async function getDashboardData() {
  const interviewsCol = collection(db, 'interviews');
  const interviewSnapshot = await getDocs(interviewsCol);
  const interviewList = interviewSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Interview));

  const rolesCol = collection(db, 'roles');
  const roleSnapshot = await getDocs(rolesCol);
  const roleList = roleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Role));
  
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
