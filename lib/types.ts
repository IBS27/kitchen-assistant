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

export type InventoryStorageLocation = 'pantry' | 'fridge' | 'freezer' | 'other';
export type InventoryItemStatus = 'active' | 'consumed' | 'discarded';
export type InventoryItemSource =
  | 'manual'
  | 'photo'
  | 'receipt'
  | 'recipe_adjustment';

export interface InventoryItem {
  id: string;
  user_id: string;
  name: string;
  quantity: number;
  unit: string | null;
  storage_location: InventoryStorageLocation | null;
  expires_on: string | null;
  status: InventoryItemStatus;
  confidence_score: number | null;
  source: InventoryItemSource;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
}

export type InventoryEventType =
  | 'added'
  | 'updated'
  | 'consumed'
  | 'discarded'
  | 'expired'
  | 'merged'
  | 'split'
  | 'corrected';

export interface InventoryItemEvent {
  id: string;
  user_id: string;
  inventory_item_id: string;
  event_type: InventoryEventType;
  delta_quantity: number | null;
  previous_quantity: number | null;
  new_quantity: number | null;
  notes: string | null;
  metadata: Record<string, unknown>;
  event_at: string;
  created_at: string;
}

export type RecipeSource = 'ai' | 'manual' | 'external';
export type RecipeRecordStatus = 'suggested' | 'selected' | 'cooked' | 'archived';

export interface RecipeRecord {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  ingredients: Record<string, unknown>[];
  steps: Record<string, unknown>[];
  source: RecipeSource;
  generation_context: Record<string, unknown>;
  status: RecipeRecordStatus;
  rationale: string | null;
  estimated_minutes: number | null;
  created_at: string;
  updated_at: string;
}

export interface ScheduleCheckin {
  id: string;
  user_id: string;
  checkin_date: string;
  cook_window_start: string | null;
  cook_window_end: string | null;
  available_minutes: number | null;
  will_shop_today: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface WeeklyCookingIntent {
  id: string;
  user_id: string;
  week_start_date: string;
  target_meals: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type TasteOutcome = 'loved' | 'liked' | 'neutral' | 'disliked';

export interface CookFeedbackEntry {
  id: string;
  user_id: string;
  recipe_record_id: string | null;
  cooked_at: string;
  rating: number | null;
  effort_level: number | null;
  taste_outcome: TasteOutcome | null;
  changes_made: string | null;
  would_repeat: boolean | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type ShoppingListStatus = 'draft' | 'active' | 'completed' | 'archived';
export type ShoppingListSource = 'system' | 'manual';

export interface ShoppingList {
  id: string;
  user_id: string;
  list_date: string;
  status: ShoppingListStatus;
  source: ShoppingListSource;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShoppingListItem {
  id: string;
  shopping_list_id: string;
  user_id: string;
  name: string;
  quantity: number;
  unit: string | null;
  category: string | null;
  is_checked: boolean;
  linked_inventory_item_id: string | null;
  created_at: string;
  updated_at: string;
}
