import { Paginated } from '@/types';

export function paginate<T>(items: T[], page = 1, limit = 10): Paginated<T> {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const total = items.length;
  const totalPages = Math.ceil(total / safeLimit) || 1;
  const startIndex = (safePage - 1) * safeLimit;
  const paginatedItems = items.slice(startIndex, startIndex + safeLimit);

  return {
    items: paginatedItems,
    total,
    page: safePage,
    limit: safeLimit,
    totalPages,
  };
}

export function sortItems<T>(
  items: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    if (valA === valB) return 0;
    if (valA === undefined || valA === null) return 1;
    if (valB === undefined || valB === null) return -1;

    const modifier = order === 'asc' ? 1 : -1;
    if (typeof valA === 'number' && typeof valB === 'number') {
      return (valA - valB) * modifier;
    }

    return String(valA).localeCompare(String(valB)) * modifier;
  });
}
