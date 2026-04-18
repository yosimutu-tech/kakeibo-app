"use client";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

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

  useEffect(() => {
    const saved = localStorage.getItem("kakeibo");
    if (saved) setItems(JSON.parse(saved));
  }, []);

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

  const handleDelete = (id: number) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    localStorage.setItem("kakeibo", JSON.stringify(updated));
  };

  const handleClear = () => {
    setItems([]);
    localStorage.removeItem("kakeibo");
  };

  // 合計
  const total = items.reduce((sum, item) => {
    return item.type === "income"
      ? sum + item.amount
      : sum - item.amount;
  }, 0);

  // カテゴリ集計
  const categoryTotals: { [key: string]: number } = {};
  items.forEach((item) => {
    if (item.type === "expense") {
      categoryTotals[item.category] =
        (categoryTotals[item.category] || 0) + item.amount;
    }
  });

  // 🎨 パステルカラー
  const pastelColors = [
    "#FFB3BA",
    "#FFDFBA",
    "#FFFFBA",
    "#BAFFC9",
    "#BAE1FF",
  ];

  // 📊 グラフデータ
  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: pastelColors,
      },
    ],
  };

  return (
    <div style={{ padding: 20, background: "#f9f9f9" }}>
      <h1 style={{ textAlign: "center" }}>家計簿アプリ</h1>

      {/* 入力 */}
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value as "income" | "expense")
          }
        >
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

        <button
          onClick={handleAdd}
          style={{
            background: "#77dd77",
            color: "white",
            borderRadius: 8,
            padding: 10,
            width: "100%",
          }}
        >
          追加する
        </button>
      </div>

      {/* 合計 */}
      <h2
        style={{
          textAlign: "center",
          color: total >= 0 ? "#77dd77" : "#ff6961",
        }}
      >
        合計: {total}円
      </h2>

      {/* 📊 グラフ */}
      <div style={{ maxWidth: 300, margin: "0 auto" }}>
        <Pie data={chartData} />
      </div>

      {/* 一覧 */}
      <ul>
        {[...items].reverse().map((item) => (
          <li key={item.id}>
            <span
              style={{
                color:
                  item.type === "income"
                    ? "#77dd77"
                    : "#ff6961",
              }}
            >
              {item.date} {item.text} ({item.amount}円)
            </span>

            <button onClick={() => handleDelete(item.id)}>
              削除
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={handleClear}
        style={{
          background: "#ff6961",
          color: "white",
          width: "100%",
          padding: 10,
          borderRadius: 8,
        }}
      >
        すべて削除
      </button>
    </div>
  );
}
