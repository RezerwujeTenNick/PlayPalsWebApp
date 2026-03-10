import Card from "./Card";

interface Props {
  icon: string;
  message: string;
  submessage?: string;
}

export default function EmptyState({ icon, message, submessage }: Props) {
  return (
    <Card className="p-10 text-center">
      <p className="text-4xl mb-3">{icon}</p>
      <p className="font-semibold text-(--color-text-secondary)">{message}</p>
      {submessage && <p className="text-sm mt-1.5 text-(--color-text-muted)">{submessage}</p>}
    </Card>
  );
}
