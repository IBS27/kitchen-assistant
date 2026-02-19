-- Tighten relational ownership checks for child tables so referenced parent rows
-- must belong to the authenticated user.

drop policy if exists "inventory_item_events_insert_own" on public.inventory_item_events;
create policy "inventory_item_events_insert_own"
on public.inventory_item_events for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.inventory_items as inventory_item
    where inventory_item.id = inventory_item_events.inventory_item_id
      and inventory_item.user_id = auth.uid()
  )
);

drop policy if exists "inventory_item_events_update_own" on public.inventory_item_events;
create policy "inventory_item_events_update_own"
on public.inventory_item_events for update
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.inventory_items as inventory_item
    where inventory_item.id = inventory_item_events.inventory_item_id
      and inventory_item.user_id = auth.uid()
  )
);

drop policy if exists "cook_feedback_entries_insert_own" on public.cook_feedback_entries;
create policy "cook_feedback_entries_insert_own"
on public.cook_feedback_entries for insert
with check (
  auth.uid() = user_id
  and (
    recipe_record_id is null
    or exists (
      select 1
      from public.recipe_records as recipe_record
      where recipe_record.id = cook_feedback_entries.recipe_record_id
        and recipe_record.user_id = auth.uid()
    )
  )
);

drop policy if exists "cook_feedback_entries_update_own" on public.cook_feedback_entries;
create policy "cook_feedback_entries_update_own"
on public.cook_feedback_entries for update
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and (
    recipe_record_id is null
    or exists (
      select 1
      from public.recipe_records as recipe_record
      where recipe_record.id = cook_feedback_entries.recipe_record_id
        and recipe_record.user_id = auth.uid()
    )
  )
);

drop policy if exists "shopping_list_items_insert_own" on public.shopping_list_items;
create policy "shopping_list_items_insert_own"
on public.shopping_list_items for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.shopping_lists as shopping_list
    where shopping_list.id = shopping_list_items.shopping_list_id
      and shopping_list.user_id = auth.uid()
  )
  and (
    linked_inventory_item_id is null
    or exists (
      select 1
      from public.inventory_items as inventory_item
      where inventory_item.id = shopping_list_items.linked_inventory_item_id
        and inventory_item.user_id = auth.uid()
    )
  )
);

drop policy if exists "shopping_list_items_update_own" on public.shopping_list_items;
create policy "shopping_list_items_update_own"
on public.shopping_list_items for update
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.shopping_lists as shopping_list
    where shopping_list.id = shopping_list_items.shopping_list_id
      and shopping_list.user_id = auth.uid()
  )
  and (
    linked_inventory_item_id is null
    or exists (
      select 1
      from public.inventory_items as inventory_item
      where inventory_item.id = shopping_list_items.linked_inventory_item_id
        and inventory_item.user_id = auth.uid()
    )
  )
);

-- Read-only audit checks for existing cross-owner links.
select count(*) as inventory_item_event_cross_owner_links
from public.inventory_item_events as event
join public.inventory_items as item
  on item.id = event.inventory_item_id
where event.user_id <> item.user_id;

select count(*) as cook_feedback_cross_owner_links
from public.cook_feedback_entries as feedback
join public.recipe_records as recipe
  on recipe.id = feedback.recipe_record_id
where feedback.recipe_record_id is not null
  and feedback.user_id <> recipe.user_id;

select count(*) as shopping_list_item_cross_owner_links
from public.shopping_list_items as list_item
join public.shopping_lists as list
  on list.id = list_item.shopping_list_id
left join public.inventory_items as item
  on item.id = list_item.linked_inventory_item_id
where list_item.user_id <> list.user_id
   or (
     list_item.linked_inventory_item_id is not null
     and (item.id is null or list_item.user_id <> item.user_id)
   );
