# Kitchen Assistant

Kitchen Assistant is an iOS-first mobile app that helps people cook with what they already have, reduce food waste, and plan groceries more intelligently.

## Vision
The app should make everyday kitchen decisions easier:
- Know what ingredients are currently available.
- Use items that are close to expiring before they go to waste.
- Suggest realistic meals based on time, preferences, and shopping plans.
- Keep grocery shopping focused on what is actually needed.

## Core Product Experience
### 1. Daily Inventory Refresh
Users are prompted each day to capture what is in their fridge and pantry. The app updates an ingredient inventory and flags items that may need expiry-date confirmation.

### 2. Grocery Haul Updates
After shopping, users can capture receipts or item photos so newly purchased ingredients are added to the same inventory.

### 3. Cooking Schedule Awareness
The app asks for daily cooking availability and uses calendar context to understand how much time the user has to cook.

### 4. Recipe Planning
Using inventory, expiry urgency, schedule, and user preferences, the app suggests practical recipes and can adapt when some ingredients are missing.

### 5. Post-Cook Learning Loop
After a meal, the app updates inventory based on what was used and captures user feedback to improve future suggestions.

### 6. Smart Shopping Lists
Based on household cadence (for example every 2 weeks), staple usage, and an upcoming meal plan, the app generates quantity-aware shopping lists.

## Product Principles
- Inventory accuracy is foundational.
- Low-confidence AI outputs should always be user-reviewable.
- Daily interactions should be short and lightweight.
- Recommendations should optimize for waste reduction and real-life constraints.
- Personalization should improve continuously from user behavior and feedback.

## MVP Scope
The initial version focuses on:
- Single-user household flow
- Reliable inventory capture and upkeep
- Daily recipe suggestions tied to time and ingredient availability
- Basic learning from post-cook feedback
- Shopping list generation aligned with user shopping frequency

## Authentication (Current)
- Current Phase 1 baseline: email/password + Google OAuth.
- Temporary roadmap deviation (February 18, 2026): Apple Sign-In is intentionally deferred until after Phase 1 hardening.

## Out of Scope for MVP
- Multi-user collaborative households
- Advanced nutrition analytics
- Grocery delivery integrations
- Smart appliance integrations
- Android-specific optimization

## Success Criteria
- Users keep inventory up to date with minimal effort.
- Recipe suggestions are practical and frequently used.
- Near-expiry ingredient waste decreases over time.
- Grocery trips become more predictable and efficient.

## Roadmap
Detailed phased planning is maintained in:
- `/Users/srinivasib/Developer/kitchen-assistant/plan.md`
