import { categoryMeta } from '../../lib/patientCategories';

interface CategoryTagProps {
  categoryKey?: string | null;
  category?: string | null;
  className?: string;
}

export default function CategoryTag({ categoryKey, category, className = '' }: CategoryTagProps) {
  const meta = categoryMeta(categoryKey, category);
  if (!meta.key || meta.key === 'unknown') return null;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${meta.className} ${className}`}
    >
      {meta.label}
    </span>
  );
}
