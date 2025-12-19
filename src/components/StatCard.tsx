interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

export function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 md:p-6 text-center">
      <h3
        className="text-sm md:text-base font-alegreya text-tier-basic mb-1"
        style={{ fontVariant: 'small-caps' }}
      >
        {title}
      </h3>
      <p className="text-2xl md:text-3xl font-figtree font-bold text-tier-maverick">
        {value}
      </p>
      {subtitle && (
        <p className="text-xs md:text-sm font-figtree text-gray-400 mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
