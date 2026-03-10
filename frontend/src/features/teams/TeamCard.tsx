import { useNavigate } from "react-router-dom";
import type { Team } from "../../types/team";
import { getCategoryLabel } from "../../helpers/teamHelpers";
import { Shield, UserPlus, ChevronRight } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

interface Props {
  team: Team;
  canJoin: boolean;
  onJoin: (id: number) => void;
}

export default function TeamCard({ team, canJoin, onJoin }: Props) {
  const navigate = useNavigate();

  return (
    <Card hoverable className="p-5 group cursor-pointer">
      <div
        className="flex items-start justify-between mb-3"
        onClick={() => navigate(`/teams/${team.id}`)}
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-(--color-text-primary) group-hover:text-(--color-primary) transition-colors truncate">
            {team.name}
          </h3>
          <p className="text-xs text-(--color-text-muted) mt-1">{getCategoryLabel(team.category)}</p>
        </div>
        <div className="flex items-center gap-1 ml-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-(--color-primary)/10 border border-(--color-primary)/20 flex items-center justify-center">
            <Shield className="w-4 h-4 text-(--color-primary)" />
          </div>
          <ChevronRight className="w-4 h-4 text-(--color-text-muted) group-hover:text-(--color-primary) transition-colors" />
        </div>
      </div>
      {canJoin && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onJoin(team.id)}
          className="w-full mt-2 justify-center"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Dołącz
        </Button>
      )}
    </Card>
  );
}
