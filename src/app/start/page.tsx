
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/types";

async function getRoles() {
    const supabase = createClient();
    const { data, error } = await supabase.from('roles').select('*');
    
    if (error) {
        console.error("Error fetching roles:", error);
        return [];
    }
    return data as Role[];
}

export default async function StartPage() {
  const roles = await getRoles();

  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Choose Your Role</h1>
        <p className="mt-2 text-lg text-muted-foreground">Select the position you are applying for to begin your tailored interview.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {roles.map((role) => (
          <Card key={role.id} className="flex flex-col hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="text-2xl">{role.title}</CardTitle>
              <CardDescription className="pt-2 h-24 overflow-hidden">{role.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/interview/start/${role.slug}`}>
                  Start Interview <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
