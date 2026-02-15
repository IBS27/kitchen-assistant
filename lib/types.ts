export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  display_name: string | null;
  household_size: number;
  shopping_frequency_days: number;
  dietary_preferences: string[];
  disliked_foods: string[];
  onboarding_completed_at: string | null;
}
