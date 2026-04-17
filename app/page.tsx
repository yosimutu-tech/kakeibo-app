"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [amount, setAmount] = useState("");
  const [text, setText] = useState("");
  const [items, setItems] = useState<{amount: number; text: string}[]>([]);

  // 初回読み込み（保存データ取得）
  useEffect(() => {
    const saved = localStorage.getItem("kakeibo");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  // データ保存
  useEffect(() => {
    localStorage.setItem("kakeibo", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!amount || !text) return;

    const newItem = {
      amount: Number(amount),
      text: text,
    };

    setItems([...items, newItem]);
    setAmount("");
    setText("");
  };

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h1>家計簿アプリ</h1>

      <input
        type="number"
        placeholder="金額"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <br /><br />

      <input
        type="text"
        placeholder="内容（例：食費）"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br /><br />

      <button onClick={addItem}>追加</button>

      <h2>合計：{total}円</h2>

      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.text}：{item.amount}円
          </li>
        ))}
      </ul>
    </div>
  );
}
