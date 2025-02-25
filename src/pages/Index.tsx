import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Globe, Rocket, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 py-20">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="flex flex-col items-center gap-8 text-center">
            <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
              Level Up Your English Learning Journey
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Transform vocabulary learning into an engaging battle of knowledge. Perfect for students and educators seeking measurable results.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="rounded-full" asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Why Choose Us?</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Rocket className="h-6 w-6" />}
              title="Accelerated Learning"
              description="Boost vocabulary retention through gamified learning experiences"
            />
            <FeatureCard
              icon={<Trophy className="h-6 w-6" />}
              title="Progress Tracking"
              description="Monitor student performance with detailed analytics and insights"
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Collaborative Learning"
              description="Foster healthy competition and peer learning"
            />
            <FeatureCard
              icon={<Building className="h-6 w-6" />}
              title="Institution Ready"
              description="Seamlessly integrate with your existing educational framework"
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6" />}
              title="Global Standards"
              description="Aligned with international language learning standards"
            />
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-secondary/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="mb-8 text-3xl font-bold">Trusted by Leading Institutions</h2>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-70">
              {/* Replace these with actual logos */}
              <div className="h-12 w-32 rounded-lg bg-foreground/10"></div>
              <div className="h-12 w-32 rounded-lg bg-foreground/10"></div>
              <div className="h-12 w-32 rounded-lg bg-foreground/10"></div>
              <div className="h-12 w-32 rounded-lg bg-foreground/10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden">
            <CardContent className="flex flex-col items-center gap-6 p-12 text-center">
              <h2 className="text-3xl font-bold">Ready to Transform Your Teaching?</h2>
              <p className="max-w-2xl text-muted-foreground">
                Join thousands of educators who have already revolutionized their English teaching methods with our platform.
              </p>
              <Button size="lg" className="rounded-full" asChild>
                <Link to="/auth">Start Your Free Trial</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="group relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          {icon}
        </div>
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
