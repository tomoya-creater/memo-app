-- メモを保存するテーブルを作成
create table memos (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  created_at timestamp with time zone default now()
);