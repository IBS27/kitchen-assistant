# Kitchen Assistant MVP Blueprint

## 1) Product Requirements (Phase 0)

### Objective
Align on the end-to-end user journey before building Phase 1+ features.

### Primary Persona (MVP)
- Busy college student living alone (single user, single household).
- Needs low-effort daily cooking decisions around class/work schedule.
- Wants to reduce food waste without manual tracking overhead.

### Core User Jobs
- Keep ingredient inventory reasonably accurate with minimal effort.
- Decide what to cook based on real schedule and what is expiring.
- Get a practical shopping list aligned to personal grocery cadence.

### Core Flows to Support
1. Daily pantry/fridge check-in.
2. Grocery haul capture (receipt/photo) and inventory merge.
3. Weekly cooking-intent check-in (planned number of cooked meals this week).
4. Daily cooking schedule check-in (time window + shop/no-shop intent).
5. Recipe suggestion and selection.
6. Post-cooking feedback and inventory deduction.
7. Shopping list generation.

### 30-Day MVP Success Criteria
- Weekly consistency:
  - At least 5 app check-ins per week.
- Cooking follow-through:
  - At least 4 cooked meals/week sourced from app suggestions.
- Inventory accuracy:
  - Inventory feels correct at least 80% of the time.
- Waste reduction signal:
  - Near-expiry discard events trend down week over week.

## 2) Screen Map and Flow Diagrams

### Screen Map (MVP)
- Onboarding
  - Welcome
  - Sign in
  - Preferences setup
  - Permissions (camera, notifications, calendar)
- Home
  - Daily check-in card
  - Inventory health snapshot
  - Today recipe suggestions
- Inventory
  - Capture (camera)
  - AI extraction review/edit
  - Inventory history
- Grocery
  - Receipt/photo upload
  - Parsed items review/edit
  - Merge confirmation
- Planning
  - Weekly cooking-intent input
  - Cooking window confirmation
  - Shop today toggle
  - Suggested recipe list + rationale (adjusted to weekly cook target)
- Recipe Detail
  - Ingredients/use-from-inventory indicator
  - Steps
  - Substitutions
  - Cook complete
- Feedback
  - Quick rating
  - Changes made
  - Effort/taste inputs
- Shopping List
  - Auto-generated list
  - Grouped by category
  - Manual adjust/share

### Flow Diagram: Daily Cycle
```text
Open App
  -> Weekly Cooking-Intent Check-in (once/week)
  -> Daily Check-in (time window + shop intent)
  -> Inventory Status Review
  -> Recipe Suggestions
  -> Recipe Selection
  -> Cook Completion
  -> Feedback
  -> Inventory Update
```

### Flow Diagram: Grocery Update
```text
Capture Receipt/Photos
  -> AI Parse
  -> User Review/Corrections
  -> Duplicate/Merge Handling
  -> Inventory Updated
```

## 3) MVP Scope Boundaries

### In Scope (MVP)
- iOS-first experience via Expo React Native.
- Single user + single household.
- Inventory capture via image/receipt with user confirmation.
- Time-aware daily planning with calendar context.
- Weekly cooking-intent input used to tune suggestion volume.
- AI-assisted recipe suggestions and substitutions.
- Post-cook feedback loop and inventory deduction.
- Smart shopping list generation based on usage cadence.

### Explicitly Out of Scope (MVP)
- Multi-user household collaboration.
- Deep nutrition or macro optimization workflows.
- Grocery delivery provider integrations.
- Smart kitchen/IoT automations.
- Android optimization work.

### Guardrails
- Favor reliability and correction UX over model autonomy.
- Require user confirmation when extraction/generation confidence is low.
- Keep daily interactions lightweight (few taps, fast review).
