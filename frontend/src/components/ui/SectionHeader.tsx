import { Plus } from "lucide-react";
import Button from "./Button";

interface Props {
  title: string;
  showAction?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export default function SectionHeader({ title, showAction, actionLabel, onAction }: Props) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-xl font-bold text-(--color-text-primary)">{title}</h2>
      {showAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          <Plus className="w-3.5 h-3.5" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
