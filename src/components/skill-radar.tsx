"use client";

import type { Skills } from "@/lib/types";
import {
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";

interface SkillRadarProps {
  skills: Skills;
}

export default function SkillRadar({ skills }: SkillRadarProps) {
  const data = Object.entries(skills).map(([name, value]) => ({
    skill: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    score: value,
    fullMark: 5,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <defs>
          <radialGradient id="colorUv">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </radialGradient>
        </defs>
        <PolarGrid />
        <PolarAngleAxis dataKey="skill" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
        <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
        <Tooltip
            contentStyle={{
                background: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
            }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
