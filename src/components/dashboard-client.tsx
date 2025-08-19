
"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Interview, Role } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { Eye, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface DashboardClientProps {
  interviews: Interview[];
  allRoles: Role[];
}

export default function DashboardClient({ interviews: initialInterviews, allRoles }: DashboardClientProps) {
  const [interviews, setInterviews] = useState(initialInterviews);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  
  useEffect(() => {
    setInterviews(initialInterviews);
  }, [initialInterviews]);

  const filteredInterviews = useMemo(() => {
    return interviews.filter((interview) => {
      const roleMatch = roleFilter === 'all' || interview.roleId === roleFilter;
      const statusMatch = statusFilter === 'all' || interview.status === statusFilter;
      return roleMatch && statusMatch;
    });
  }, [interviews, roleFilter, statusFilter]);
  
  const getRoleTitle = (roleId: string) => allRoles.find(r => r.id === roleId)?.title || 'Unknown Role';

  const handleDelete = async (interviewId: string) => {
    // This is a mock delete. In a real app, this would be a database call.
    setInterviews(interviews.filter(i => i.id !== interviewId));
    toast({
        title: "Success",
        description: "Interview record deleted successfully (mock).",
    });
  };

  return (
    <div>
      <div className="flex space-x-4 mb-6">
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {allRoles.map(role => (
              <SelectItem key={role.id} value={role.id}>{role.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="scored">Scored</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInterviews.length > 0 ? (
              filteredInterviews.map((interview) => (
                <TableRow key={interview.id}>
                  <TableCell className="font-medium">{interview.candidate.name}</TableCell>
                  <TableCell>{getRoleTitle(interview.roleId)}</TableCell>
                  <TableCell>
                    <Badge variant={interview.status === 'scored' ? 'default' : 'secondary'}>
                      {interview.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(interview.submittedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right font-semibold text-lg text-primary">
                    {interview.evaluation?.overallScore ? `${interview.evaluation.overallScore}/5` : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/dashboard/report/${interview.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the interview record for {interview.candidate.name}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(interview.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No interviews found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
