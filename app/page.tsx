"use client";

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react"; // useEffectを追加
import { Memo } from "@/types/memo";

export default function MemoPage() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [inputText, setInputText] = useState("");

  // --- 1. データの読み込み (useEffect) ---
  useEffect(() => {
    const fetchMemos = async () => {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('取得失敗:', error.message);
      } else if (data) {
        // DBの created_at (文字列) を Date オブジェクトに変換して入れる
        const formattedData = data.map(m => ({
          id: m.id,
          content: m.content,
          createAt: new Date(m.created_at) // DBの created_at を createAt に変換
        }));
        setMemos(formattedData);
      }
    };
    fetchMemos();
  }, []);

  // --- 2. データの追加 ---
  const addMemo = async () => {
  if (!inputText) return;

  const { data, error } = await supabase
      .from('memos')
      .insert([{ content: inputText }])
      .select();

    if (error) {
      console.error("追加失敗:", error.message);
    } else if (data && data.length > 0) {
      const newMemo = {
        id: data[0].id,
        content: data[0].content,
        createAt: new Date(data[0].created_at) // ここも名前を合わせる
      };
      setMemos([...memos, newMemo]);
      setInputText("");
    }
  };

  // --- 3. データの削除 ---
  const deleteMemo = async (id: string) => {
    const { error } = await supabase
      .from('memos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("削除失敗:", error.message);
    } else {
      setMemos(memos.filter(memo => memo.id !== id));
    }
  };

  return (
    <main className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-black">シンプルメモ</h1>

      <div className="flex gap-2 mb-8">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing || e.keyCode === 229) return;
            if (e.key === 'Enter') addMemo();
          }}
          className="border p-2 rounded flex-1 text-black bg-white px-3"
          placeholder="メモを入力"
        />
        <button
          onClick={addMemo}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          追加
        </button>
      </div>

      <ul className="flex flex-col gap-3">
        {memos.map((memo) => (
          <li key={memo.id} className="p-3 border rounded shadow-sm flex justify-between items-center bg-white text-black">
            <div className="flex flex-col">
              <span className="font-medium">{memo.content}</span>
              <span className="text-xs text-gray-400">
                {memo.createAt?.toLocaleTimeString() || "時刻不明"}
              </span>
            </div>
            <button
              onClick={() => deleteMemo(memo.id)}
              className="text-red-500 hover:bg-red-50 px-3 py-1 rounded text-sm border border-red-200 transition-colors"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}