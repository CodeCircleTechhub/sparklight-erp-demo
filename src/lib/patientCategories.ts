// Patient category tags (Baby, Child, Adolescent, Adult sub-kinds, Senior,
// Antenatal). The backend sends `category` (label) + `categoryKey`; these
// helpers cover fallbacks, colours and the filter dropdown.

export interface CategoryMeta {
  key: string;
  label: string;
  group: 'antenatal' | 'pediatric' | 'adult' | 'senior';
  className: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { key: 'antenatal', label: 'Antenatal', group: 'antenatal', className: 'bg-pink-100 text-pink-700 ring-pink-200' },
  { key: 'baby', label: 'Baby', group: 'pediatric', className: 'bg-amber-100 text-amber-700 ring-amber-200' },
  { key: 'child', label: 'Child', group: 'pediatric', className: 'bg-orange-100 text-orange-700 ring-orange-200' },
  { key: 'adolescent', label: 'Adolescent', group: 'pediatric', className: 'bg-violet-100 text-violet-700 ring-violet-200' },
  { key: 'young-adult', label: 'Young Adult', group: 'adult', className: 'bg-blue-100 text-blue-700 ring-blue-200' },
  { key: 'core-adult', label: 'Adult', group: 'adult', className: 'bg-green-100 text-green-700 ring-green-200' },
  { key: 'middle-aged', label: 'Middle-aged', group: 'adult', className: 'bg-teal-100 text-teal-700 ring-teal-200' },
  { key: 'senior', label: 'Senior', group: 'senior', className: 'bg-slate-200 text-slate-700 ring-slate-300' },
];

const BY_KEY = new Map(CATEGORIES.map((c) => [c.key, c]));

export const categoryMeta = (key?: string | null, label?: string | null): CategoryMeta => {
  if (key && BY_KEY.has(key)) return BY_KEY.get(key)!;
  if (label) {
    const hit = CATEGORIES.find((c) => c.label.toLowerCase() === label.toLowerCase());
    if (hit) return hit;
    return { key: label.toLowerCase(), label, group: 'adult', className: 'bg-gray-100 text-gray-700 ring-gray-200' };
  }
  return { key: 'unknown', label: '—', group: 'adult', className: 'bg-gray-100 text-gray-600 ring-gray-200' };
};

// filter dropdown: adult is one entry that expands into its sub-kinds
export const FILTER_OPTIONS = [
  { value: 'all', label: 'All categories', group: '' },
  { value: 'antenatal', label: 'Antenatal', group: '' },
  { value: 'baby', label: 'Baby', group: 'Pediatric' },
  { value: 'child', label: 'Child', group: 'Pediatric' },
  { value: 'adolescent', label: 'Adolescent', group: 'Pediatric' },
  { value: 'adult', label: 'All adults', group: 'Adult' },
  { value: 'young-adult', label: 'Young Adult (18–29)', group: 'Adult' },
  { value: 'core-adult', label: 'Adult (30–49)', group: 'Adult' },
  { value: 'middle-aged', label: 'Middle-aged (50–64)', group: 'Adult' },
  { value: 'senior', label: 'Senior (65+)', group: 'Adult' },
];

// backend query param: 'adult' matches every adult sub-kind server-side
export const matchesCategory = (
  p: { categoryKey?: string; adult?: boolean },
  filter: string
): boolean => {
  if (!filter || filter === 'all') return true;
  if (filter === 'adult') return !!p.adult || p.categoryKey === 'senior';
  return p.categoryKey === filter;
};
