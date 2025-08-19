
"use client";

import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import type { FullInterview, Role } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { Eye, Trash2, ChevronDown, ChevronUp, Hourglass } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface DashboardClientProps {
  interviews: FullInterview[];
  allRoles: Role[];
}

export default function DashboardClient({ interviews: initialInterviews, allRoles }: DashboardClientProps) {
  const [interviews, setInterviews] = useState(initialInterviews);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openCollapsibles, setOpenCollapsibles] = useState<Record<string, boolean>>({});

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
  
  const toggleCollapsible = (id: string) => {
      setOpenCollapsibles(prev => ({...prev, [id]: !prev[id]}));
  }

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
              <TableHead className="w-12"></TableHead>
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
                  <Collapsible asChild key={interview.id} open={openCollapsibles[interview.id] || false} onOpenChange={() => toggleCollapsible(interview.id)} tagName="tbody">
                  <React.Fragment>
                  <TableRow className="cursor-pointer">
                    <TableCell>
                       <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="icon">
                              {openCollapsibles[interview.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              <span className="sr-only">Toggle details</span>
                          </Button>
                       </CollapsibleTrigger>
                    </TableCell>
                    <TableCell className="font-medium" onClick={() => toggleCollapsible(interview.id)}>{interview.candidate.name}</TableCell>
                    <TableCell onClick={() => toggleCollapsible(interview.id)}>{getRoleTitle(interview.roleId)}</TableCell>
                    <TableCell onClick={() => toggleCollapsible(interview.id)}>
                      <Badge variant={interview.status === 'scored' ? 'default' : 'secondary'}>
                        {interview.status}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={() => toggleCollapsible(interview.id)}>{new Date(interview.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right font-semibold text-lg text-primary" onClick={() => toggleCollapsible(interview.id)}>
                      {interview.evaluation?.overallScore ? `${interview.evaluation.overallScore.toFixed(1)}/5` : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/dashboard/report/${interview.id}`} onClick={(e) => e.stopPropagation()}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>

                      <AlertDialog onOpenChange={(open) => open && false}>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={(e) => e.stopPropagation()}>
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
                  <CollapsibleContent asChild>
                      <TableRow>
                          <TableCell colSpan={7} className="p-0">
                              <div className="p-4 bg-muted/50">
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                     <Card>
                                        <CardHeader>
                                            <CardTitle>Questions &amp; Answers</CardTitle>
                                            <CardDescription>Transcribed responses from the candidate.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                                            {interview.responses.length > 0 ? interview.responses.map((response, index) => (
                                                <div key={response.questionId} className="border-b pb-2 last:border-b-0">
                                                    <p className="font-semibold">Q{index + 1}: {response.questionPrompt}</p>
                                                    <p className="text-sm text-muted-foreground pl-4 pt-1 whitespace-pre-wrap">A: {response.transcript || "No transcript available."}</p>
                                                </div>
                                            )) : (
                                                <p className="text-muted-foreground">No responses recorded for this interview.</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>AI Performance Review</CardTitle>
                                            <CardDescription>Summary of the candidate's performance.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {interview.evaluation ? (
                                                <>
                                                    <div>
                                                        <h4 className="font-semibold text-sm mb-1">Summary</h4>
                                                        <p className="text-sm text-muted-foreground">{interview.evaluation.summary}</p>
                                                    </div>
                                                     <div>
                                                        <h4 className="font-semibold text-sm mb-2">Strengths</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {interview.evaluation.strengths.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                                                        </div>
                                                    </div>
                                                     <div>
                                                        <h4 className="font-semibold text-sm mb-2">Weaknesses</h4>
                                                         <div className="flex flex-wrap gap-2">
                                                            {interview.evaluation.weaknesses.map(w => <Badge key={w} variant="destructive">{w}</Badge>)}
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <Alert>
                                                    <Hourglass className="h-4 w-4" />
                                                    <AlertTitle>Evaluation Pending</AlertTitle>
                                                    <AlertDescription>
                                                        The AI evaluation is not yet complete for this interview.
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </CardContent>
                                    </Card>
                                  </div>
                              </div>
                          </TableCell>
                      </TableRow>
                  </CollapsibleContent>
                  </React.Fragment>
                  </Collapsible>
              ))
            ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
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
