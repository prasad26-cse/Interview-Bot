import type { Question } from "@/lib/types";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface QuestionCardProps {
  question: Question;
  currentNum: number;
  totalNum: number;
}

export default function QuestionCard({ question, currentNum, totalNum }: QuestionCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardDescription>
          Question {currentNum} of {totalNum}
        </CardDescription>
        <CardTitle className="text-2xl leading-relaxed">
          {question.prompt}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Badge variant="outline">Category: {question.category}</Badge>
        <Badge variant="outline">Difficulty: {question.difficulty}/5</Badge>
      </CardContent>
    </Card>
  );
}
