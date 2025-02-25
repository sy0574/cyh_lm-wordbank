
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
    <div className="container max-w-[90rem] mx-auto py-8 px-4">
      <div className="space-y-6">
        {header}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6 space-y-6">
            {mainContent}
          </Card>
          <Card className="lg:col-span-1 p-6">
            {sideContent}
          </Card>
        </div>
        <div className="flex justify-between items-center">
          {actions}
        </div>
      </div>
    </div>
  );
};

export default MatchLayout;
