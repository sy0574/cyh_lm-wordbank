
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Brain, Globe, GraduationCap, Rocket, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export default function Index() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/setup");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex-1 relative isolate overflow-hidden bg-gradient-to-b from-background to-primary/5 pt-14">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%)]" />
        <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Learn English Through Interactive Battles
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Transform vocabulary learning into an engaging battle of knowledge. Our platform combines 
              gamification with proven learning methods to help students master English effectively.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="gap-2"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
              >
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose WordBattle?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our platform combines proven learning methods with engaging gameplay
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.name} className="group hover:shadow-lg transition-all">
                  <CardContent className="relative p-6">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {feature.icon}
                    </div>
                    <dt className="text-xl font-semibold leading-7">
                      {feature.name}
                    </dt>
                    <dd className="mt-4 text-base leading-7 text-muted-foreground">
                      {feature.description}
                    </dd>
                  </CardContent>
                </Card>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate bg-primary/5">
        <div className="py-24 px-6 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Transform Your English Learning?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Join thousands of students who have already improved their English vocabulary with WordBattle.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button
                size="lg"
                onClick={handleGetStarted}
              >
                {isAuthenticated ? "Start Learning" : "Get Started for Free"}
              </Button>
              <Button
                variant="outline"
                size="lg"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    name: "Smart Learning",
    description: "Our AI-powered system adapts to your learning pace and style, ensuring optimal progress.",
    icon: <Brain className="h-6 w-6" />,
  },
  {
    name: "Global Standards",
    description: "Curriculum aligned with international English language learning standards.",
    icon: <Globe className="h-6 w-6" />,
  },
  {
    name: "Proven Results",
    description: "Over 90% of students show significant improvement in vocabulary retention.",
    icon: <Trophy className="h-6 w-6" />,
  },
  {
    name: "Accelerated Learning",
    description: "Learn faster through our gamified approach and spaced repetition system.",
    icon: <Rocket className="h-6 w-6" />,
  },
  {
    name: "Professional Support",
    description: "Access to expert educators and a supportive learning community.",
    icon: <GraduationCap className="h-6 w-6" />,
  },
];
