
import ReportView from "@/components/report-view";
import { notFound } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { FullInterview, Interview, Role } from "@/lib/types";

async function getInterviewDetails(id: string): Promise<FullInterview | null> {
    const interviewDocRef = doc(db, 'interviews', id);
    const interviewSnap = await getDoc(interviewDocRef);

    if (!interviewSnap.exists()) {
        return null;
    }

    const interviewData = interviewSnap.data() as Interview;

    const roleDocRef = doc(db, 'roles', interviewData.roleId);
    const roleSnap = await getDoc(roleDocRef);

    if (!roleSnap.exists()) {
        return null; // Or handle as a partial interview
    }
    
    const roleData = roleSnap.data() as Role;

    return {
        ...interviewData,
        id: interviewSnap.id,
        role: {
            ...roleData,
            id: roleSnap.id,
        },
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
