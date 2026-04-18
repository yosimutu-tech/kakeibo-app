"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [text, setText] = useState("");
  const [items, setItems] = useState<any[]>([]);

  // 🔵 データ読み込み
  useEffect(() => {
    const saved = localStorage.getItem("kakeibo");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  // 🔵 追加
  const handleAdd = () => {
    if (!amount || !text) return;

    const newItem = {
      id: Date.now(),
      type,
      amount: Number(amount),
      text,
      date: new Date().toLocaleDateString(),
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    localStorage.setItem("kakeibo", JSON.stringify(updatedItems));

    setAmount("");
    setText("");
  };

  // 🔵 削除
  const handleDelete = (id: number) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    localStorage.setItem("kakeibo", JSON.stringify(updatedItems));
  };

  // 🔵 合計
  const total = items.reduce((sum, item) => {
    return item.type === "income"
      ? sum + item.amount
      : sum - item.amount;
  }, 0);

  return (
    <div style={{ padding: 20 }}>
      <h1>家計簿アプリ！</h1>

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="income">収入</option>
        <option value="expense">支出</option>
      </select>

      <input
        placeholder="金額"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        placeholder="内容"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={handleAdd}>追加</button>

      <h2 style={{ color: total >= 0 ? "green" : "red" }}>
        合計: {total}円
      </h2>

      <ul>
        {[...items].reverse().map((item) => (
          <li
            key={item.id}
            style={{
              color: item.type === "income" ? "green" : "red",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
              listStyle: "none",
            }}
          >
            <span>
              {item.date}{" "}
              {item.type === "income" ? "収入" : "支出"}：{item.text}（{item.amount}円）
            </span>

            <button onClick={() => handleDelete(item.id)}>
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
