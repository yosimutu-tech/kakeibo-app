"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [text, setText] = useState("");
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("kakeibo");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

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

  const handleDelete = (id: number) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    localStorage.setItem("kakeibo", JSON.stringify(updatedItems));
  };

  const total = items.reduce((sum, item) => {
    return item.type === "income"
      ? sum + item.amount
      : sum - item.amount;
  }, 0);

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "0 auto",
        padding: 20,
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>
        家計簿アプリ
      </h1>

      {/* 入力エリア */}
      <div
        style={{
          background: "#f5f5f5",
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        >
          <option value="income">収入</option>
          <option value="expense">支出</option>
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
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
          }}
        >
          追加
        </button>
      </div>

      {/* 合計 */}
      <div
        style={{
          textAlign: "center",
          fontSize: 24,
          marginBottom: 20,
          color: total >= 0 ? "green" : "red",
        }}
      >
        合計: {total}円
      </div>

      {/* リスト */}
      <div>
        {[...items].reverse().map((item) => (
          <div
            key={item.id}
            style={{
              background: "white",
              padding: 12,
              borderRadius: 10,
              marginBottom: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                color: item.type === "income" ? "green" : "red",
              }}
            >
              <div style={{ fontSize: 12 }}>{item.date}</div>
              <div>
                {item.type === "income" ? "収入" : "支出"}：
                {item.text}
              </div>
              <div>{item.amount}円</div>
            </div>

            <button
              onClick={() => handleDelete(item.id)}
              style={{
                background: "#ddd",
                border: "none",
                padding: "6px 10px",
                borderRadius: 6,
              }}
            >
              削除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
