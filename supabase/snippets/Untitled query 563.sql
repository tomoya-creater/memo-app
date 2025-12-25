-- 1. RLSを有効にする（これで「勝手には見られない」状態になる）
alter table public.memos enable row level security;

-- 2. 「誰でも（anon）」が「すべての操作（ALL）」をできるように許可する
create policy "Anyone can do anything"
on public.memos
for all
to anon
using (true)
with check (true);