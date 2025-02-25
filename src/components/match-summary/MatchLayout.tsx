
import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface MatchLayoutProps {
  header: ReactNode;
  mainContent: ReactNode;
  sideContent: ReactNode;
  actions: ReactNode;
}

const MatchLayout = ({ header, mainContent, sideContent, actions }: MatchLayoutProps) => {
  return (
    <div className="container max-w-[90rem] mx-auto py-12 px-4">
      <div className="space-y-8 slide-up">
        {header}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              {mainContent}
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6">
              {sideContent}
            </Card>
          </div>
        </div>

        {actions}
      </div>
    </div>
  );
};

export default MatchLayout;
