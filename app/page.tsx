"use client";
import { useState, useEffect } from "react";

type Item = {
  id: number;
  type: "income" | "expense";
  amount: number;
  text: string;
  category: string;
  date: string;
};

export default function Home() {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [text, setText] = useState("");
  const [category, setCategory] = useState("食費");
  const [items, setItems] = useState<Item[]>([]);

  // 🔹 読み込み
  useEffect(() => {
    const saved = localStorage.getItem("kakeibo");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  // 🔹 追加
  const handleAdd = () => {
    if (!amount || !text) return;

    const newItem: Item = {
      id: Date.now(),
      type,
      amount: Number(amount),
      text,
      category,
      date: new Date().toLocaleDateString(),
    };

    const updated = [...items, newItem];
    setItems(updated);
    localStorage.setItem("kakeibo", JSON.stringify(updated));

    setAmount("");
    setText("");
  };

  // 🔹 削除
  const handleDelete = (id: number) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    localStorage.setItem("kakeibo", JSON.stringify(updated));
  };

  // 🔹 全削除
  const handleClear = () => {
    setItems([]);
    localStorage.removeItem("kakeibo");
  };

  // 🔹 合計
  const total = items.reduce((sum, item) => {
    return item.type === "income"
      ? sum + item.amount
      : sum - item.amount;
  }, 0);

  // 🔥 カテゴリ別合計（ここが今回のメイン！）
  const categoryTotals: { [key: string]: number } = {};

  items.forEach((item) => {
    if (item.type === "expense") {
      if (!categoryTotals[item.category]) {
        categoryTotals[item.category] = 0;
      }
      categoryTotals[item.category] += item.amount;
    }
  });

  return (
    <div style={{ padding: 20 }}>
      <h1>家計簿アプリ</h1>

      {/* 入力エリア */}
      <div style={{ marginBottom: 20 }}>
        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value as "income" | "expense")
          }
        >
          <option value="income">収入</option>
          <option value="expense">支出</option>
        </select>

        <br />

        <input
          placeholder="金額"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <br />

        <input
          placeholder="内容"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <br />

        {/* 🔥 カテゴリ */}
        {type === "expense" && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>食費</option>
            <option>交通費</option>
            <option>日用品</option>
            <option>娯楽</option>
            <option>その他</option>
          </select>
        )}

        <br />

        <button onClick={handleAdd}>追加する</button>
      </div>

      {/* 合計 */}
      <h2 style={{ color: total >= 0 ? "green" : "red" }}>
        合計: {total}円
      </h2>

      {/* 🔥 カテゴリ別合計 */}
      <h3>カテゴリ別支出</h3>
      <ul>
        {Object.entries(categoryTotals).map(([cat, amount]) => (
          <li key={cat}>
            {cat}: {amount}円
          </li>
        ))}
      </ul>

      {/* 一覧 */}
      <ul>
        {[...items].reverse().map((item) => (
          <li key={item.id}>
            <span
              style={{
                color: item.type === "income" ? "green" : "red",
              }}
            >
              {item.date}{" "}
              {item.type === "income" ? "収入" : "支出"}：
              {item.text} ({item.amount}円)
              {item.type === "expense" && `【${item.category}】`}
            </span>

            <button onClick={() => handleDelete(item.id)}>
              削除
            </button>
          </li>
        ))}
      </ul>

      {/* 全削除 */}
      <button
        onClick={handleClear}
        style={{
          background: "red",
          color: "white",
          marginTop: 20,
        }}
      >
        すべて削除
      </button>
    </div>
  );
}
