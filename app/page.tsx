"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [text, setText] = useState("");
  const [category, setCategory] = useState("食費"); // ←追加
  const [items, setItems] = useState<any[]>([]);

  // 読み込み
  useEffect(() => {
    const saved = localStorage.getItem("kakeibo");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  // 追加
  const handleAdd = () => {
    if (!amount || !text) return;

    const newItem = {
      id: Date.now(),
      type,
      amount: Number(amount),
      text,
      category, // ←追加
      date: new Date().toLocaleDateString(),
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    localStorage.setItem("kakeibo", JSON.stringify(updatedItems));

    setAmount("");
    setText("");
  };

  // 削除
  const handleDelete = (id: number) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    localStorage.setItem("kakeibo", JSON.stringify(updatedItems));
  };

  // 全削除
  const handleClearAll = () => {
    setItems([]);
    localStorage.removeItem("kakeibo");
  };

  // 合計
  const total = items.reduce((sum, item) => {
    return item.type === "income"
      ? sum + item.amount
      : sum - item.amount;
  }, 0);

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>家計簿アプリ</h1>

      {/* 入力 */}
      <div style={{ background: "#f5f5f5", padding: 15, borderRadius: 10 }}>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        >
          <option value="income">収入</option>
          <option value="expense">支出</option>
        </select>

        {/* 🔴 カテゴリ選択 */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        >
          <option>食費</option>
          <option>日用品</option>
          <option>交通費</option>
          <option>趣味</option>
          <option>その他</option>
        </select>

        <input
          placeholder="金額"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          placeholder="内容"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <button
          onClick={handleAdd}
          style={{
            width: "100%",
            padding: 12,
            background: "green",
            color: "white",
            borderRadius: 8,
          }}
        >
          追加
        </button>
      </div>

      {/* 合計 */}
      <h2
        style={{
          textAlign: "center",
          color: total >= 0 ? "green" : "red",
        }}
      >
        合計: {total}円
      </h2>

      {/* 全削除 */}
      <button
        onClick={handleClearAll}
        style={{
          width: "100%",
          padding: 12,
          background: "red",
          color: "white",
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        全て削除
      </button>

      {/* リスト */}
      {[...items].reverse().map((item) => (
        <div
          key={item.id}
          style={{
            background: "#fff",
            padding: 10,
            marginBottom: 10,
            borderRadius: 10,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ color: item.type === "income" ? "green" : "red" }}>
            <div>{item.date}</div>
            <div>
              {item.type === "income" ? "収入" : "支出"}：{item.text}
            </div>

            {/* 🔴 カテゴリ表示 */}
            <div>カテゴリ：{item.category}</div>

            <div>{item.amount}円</div>
          </div>

          <button onClick={() => handleDelete(item.id)}>削除</button>
        </div>
      ))}
    </div>
  );
}
