# Kitchen Assistant App Roadmap

## Product Goal
Build an iOS-first kitchen assistant that helps users reduce food waste, plan cooking around real schedules, and shop smarter using inventory awareness.

## Guiding Principles
- Keep the first release focused on one user and one household.
- Prioritize reliability and user trust over feature depth.
- Require user confirmation whenever AI confidence is low.
- Make daily usage lightweight so users can keep the habit.
- Treat inventory accuracy as the core of the product.

## Recommended Build Stack (High-Level)
- Mobile app: Expo + React Native (iOS-first)
- Backend platform: Supabase (Auth, database, file storage, server functions)
- AI services: multimodal model for photo and receipt understanding, language model for planning and recipe generation
- Calendar and reminders: iOS calendar access + app notifications
- Analytics and monitoring: product analytics + error tracking

## Phase 0: Product Definition and UX Blueprint
### Objective
Align on the user journey before building features.

### Build in this phase
- Define primary user personas and daily/weekly behavior.
- Finalize core user flows:
  - Daily pantry/fridge check-in
  - Grocery haul capture
  - Daily cooking schedule check-in
  - Recipe suggestion and selection
  - Post-cooking feedback
  - Shopping list generation
- Define what success looks like in the first 30 days (retention, inventory accuracy, recipe adoption).

### Output
- Product requirements document
- Screen map and flow diagrams
- MVP scope boundaries (what is explicitly out of scope)

## Phase 1: Foundation and Account Setup
### Objective
Set up a stable app foundation and user identity.

### Build in this phase
- Authentication (Sign in with Apple + simple backup sign-in method).
- User profile and preferences setup (dietary preferences, disliked foods, shopping frequency, household size).
- Basic navigation and app shell.
- Core data model design for inventory, recipes, schedules, feedback, and shopping lists.

### Output
- Users can sign in, set preferences, and access key app sections.
- Data model is finalized and ready for feature development.

## Phase 2: Inventory Capture MVP
### Objective
Make inventory creation and daily updates work reliably.

### Build in this phase
- Daily prompt for users to capture pantry and refrigerator photos.
- AI extraction of ingredient names and rough quantities.
- User review screen to confirm or correct extracted items.
- Shelf-life critical item detection and expiry date input flow.
- Inventory history tracking so changes are auditable.

### Output
- Users can build and maintain a usable ingredient inventory every day.

## Phase 3: Grocery Haul Ingestion
### Objective
Add shopping updates into the same inventory system.

### Build in this phase
- Grocery haul capture by receipt photo and item photo.
- AI extraction from receipts and packaging.
- Duplicate handling and smart merge into current inventory.
- Item-level confidence indicators so users can quickly fix uncertain entries.

### Output
- Grocery purchases update inventory with minimal manual work.

## Phase 4: Daily Planning and Calendar-Aware Cooking Windows
### Objective
Understand when the user can realistically cook.

### Build in this phase
- Calendar permission flow with clear privacy messaging.
- Daily morning check-in that confirms available cooking windows.
- User prompt asking if they will shop today.
- Simple time-aware context passed into recipe planning.

### Output
- App knows user time constraints and shopping intent for the day.

## Phase 5: Recipe Intelligence and Interactive Planning
### Objective
Generate practical daily recipes using what the user already has.

### Build in this phase
- Recipe generation based on:
  - current inventory
  - near-expiry priorities
  - available cook time
  - preferences and restrictions
  - shopping intent
- Conversational back-and-forth to refine recipe options.
- Substitution-aware recipes (works with missing ingredients and suggests optional upgrades).
- Clear rationale in suggestions (for example: "uses ingredients expiring soon").

### Output
- Users receive realistic, personalized, and waste-aware recipe options each day.

## Phase 6: Cook Completion, Inventory Deduction, and Feedback Learning
### Objective
Close the loop after meals and improve future recommendations.

### Build in this phase
- Mark recipe as cooked.
- Update inventory based on estimated or user-adjusted ingredient usage.
- Collect quick feedback (rating, what was changed, taste outcome, effort level).
- Use feedback to personalize future suggestions and ingredient priorities.

### Output
- Inventory remains accurate after cooking.
- Recommendation quality improves over time.

## Phase 7: Smart Shopping Lists and Weekly Meal Support
### Objective
Make grocery planning proactive instead of reactive.

### Build in this phase
- Shopping list generation aligned to user cadence (for example every 2 weeks).
- Staples restock logic based on user behavior and commonly used ingredients.
- Weekly meal outline with required ingredients and quantities.
- Shopping list grouped for practical store usage.

### Output
- Users get quantity-aware, schedule-aware grocery lists and a weekly plan.

## Phase 8: Quality, Trust, and Launch Readiness
### Objective
Prepare for stable real-world usage.

### Build in this phase
- Improve OCR and recognition accuracy based on pilot feedback.
- Add safety checks for low-confidence AI outputs.
- Refine notification timing and frequency.
- Add onboarding improvements and user education.
- Define support workflow and issue triage.

### Output
- Launch-ready product with stable daily workflows.

## Suggested Milestones
- Milestone 1: Foundation + Inventory MVP (Phases 1-2)
- Milestone 2: Grocery + Daily Planning (Phases 3-4)
- Milestone 3: Recipe Intelligence + Feedback Loop (Phases 5-6)
- Milestone 4: Shopping Intelligence + Launch Hardening (Phases 7-8)

## What to Defer Until After MVP
- Multi-user household collaboration
- Deep nutrition tracking and macro optimization
- Integrations with grocery delivery providers
- Advanced automation workflows and smart kitchen device integrations
- Android-specific optimization

## Definition of MVP Success
- Users can maintain inventory with low effort.
- Users receive daily recipe options that fit time and available ingredients.
- Users can complete cooking and keep inventory updated.
- Users receive reliable shopping lists aligned with their grocery cadence.
- The app measurably reduces near-expiry ingredient waste.
