import { formatNumber } from '@/utils/parseSaveFile';

interface SingleStatCardProps {
  title: string;
  description: string;
  value: number;
}

export function SingleStatCard({ title, description, value }: SingleStatCardProps) {
  return (
    <div className="text-center py-8">
      <p className="text-gray-400 text-sm font-figtree mb-2">{description}</p>
      <p className="text-4xl font-figtree font-bold text-tier-maverick mb-2">
        {formatNumber(value)}
      </p>
      <p className="text-gray-300 font-alegreya text-lg">{title}</p>
    </div>
  );
}
