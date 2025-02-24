
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Group } from "./types";

interface GroupListProps {
  groups: Group[];
  selectedGroup: string;
  setSelectedGroup: (id: string) => void;
  onAddGroup: () => void;
  onRemoveGroup: (id: string) => void;
}

export const GroupList = ({
  groups,
  selectedGroup,
  setSelectedGroup,
  onAddGroup,
  onRemoveGroup
}: GroupListProps) => {
  const { toast } = useToast();

  const handleRemoveGroup = (groupId: string) => {
    if (groups.length === 1) {
      toast({
        title: "Cannot remove last group",
        description: "At least one group is required.",
        variant: "destructive",
      });
      return;
    }
    onRemoveGroup(groupId);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onAddGroup}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Group
        </Button>
      </div>
      {groups.map((group) => (
        group.id === selectedGroup && (
          <div key={group.id} className="space-y-4 border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{group.name}</h3>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveGroup(group.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )
      ))}
    </div>
  );
};
