
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Users } from "lucide-react";
import { Group } from "./types";
import { Label } from "@/components/ui/label";

interface GroupSelectProps {
  groups: Group[];
  selectedGroup: string;
  onSelectGroup: (groupId: string) => void;
  onAddGroup: () => void;
  onRemoveGroup: (groupId: string) => void;
}

export const GroupSelect = ({
  groups,
  selectedGroup,
  onSelectGroup,
  onAddGroup,
  onRemoveGroup
}: GroupSelectProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Group Selection</Label>
        <Button variant="outline" size="sm" onClick={onAddGroup}>
          <Plus className="w-4 h-4 mr-2" />
          Add Group
        </Button>
      </div>
      
      <Select value={selectedGroup} onValueChange={onSelectGroup}>
        <SelectTrigger>
          <SelectValue placeholder="Select a group" />
        </SelectTrigger>
        <SelectContent>
          {groups.map((group) => (
            <SelectItem key={group.id} value={group.id}>
              {group.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {groups.map((group) => (
        group.id === selectedGroup && (
          <div key={group.id} className="space-y-4 border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {group.name}
              </h3>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemoveGroup(group.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {group.students.map((student) => (
                <div key={student.id} className="flex items-center gap-2">
                  {student.avatar && (
                    <img
                      src={student.avatar}
                      alt={`${student.name}'s avatar`}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div className="flex-1 px-3 py-2 bg-muted rounded-md">
                    {student.name}
                  </div>
                </div>
              ))}
              {group.students.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  Please select a class to load students
                </p>
              )}
            </div>
          </div>
        )
      ))}
    </div>
  );
};
