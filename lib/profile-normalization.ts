export function normalizeDietaryPreferences(preferences: string[]): string[] {
  const cleaned = preferences
    .map((value) => value.trim())
    .filter((value) => value.length > 0 && value.toLowerCase() !== 'none');

  return Array.from(new Set(cleaned));
}

export function normalizeDislikedFoods(foods: string[]): string[] {
  const deduped = new Map<string, string>();

  foods.forEach((food) => {
    const trimmed = food.trim();
    if (!trimmed) return;

    const canonical = trimmed.toLowerCase();
    if (!deduped.has(canonical)) {
      deduped.set(canonical, trimmed);
    }
  });

  return Array.from(deduped.values());
}
