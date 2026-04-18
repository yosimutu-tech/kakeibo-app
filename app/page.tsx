"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [text, setText] = useState("");
  const [items, setItems] = useState<any[]>([]);

  // 🔹 初回読み込み（保存データを読み込む）
  useEffect(() => {
    const saved = localStorage.getItem("kakeibo");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  // 🔹 追加処理
  const handleAdd = () => {
    if (!amount || !text) return;

    const newItem = {
      type,
      amount: Number(amount),
      text,
      date: new Date().toLocaleDateString(), // ←ここに追加
    };

    const updatedItems = [...items, newItem];

    setItems(updatedItems);
    localStorage.setItem("kakeibo", JSON.stringify(updatedItems));

    setAmount("");
    setText("");
  };

  // 🔹 削除処理
  const handleDelete = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);

    setItems(updatedItems);
    localStorage.setItem("kakeibo", JSON.stringify(updatedItems));
  };

  // 🔹 合計計算
  const total = items.reduce((sum, item) => {
    return item.type === "income"
      ? sum + item.amount
      : sum - item.amount;
  }, 0);

  return (
    <div style={{ padding: 20 }}>
      <h1>家計簿アプリ!</h1>

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="income">収入</option>
        <option value="expense">支出</option>
      </select>

      <input
  placeholder="金額"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  style={{ margin: "5px" }}
/>

      <input
        placeholder="内容"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={handleAdd}>追加</button>

      <h2>合計: {total}円</h2>

      <ul>
        {items.map((item, i) => (
          <li key={i} style={{ color: item.type === "income" ? "green" : "red" }}>
            {item.date}
            {item.type === "income" ? "収入" : "支出"}：
            {item.text}（{item.amount}円）

            <button onClick={() => handleDelete(i)}>
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
