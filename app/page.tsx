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

  // 読み込み
  useEffect(() => {
    const saved = localStorage.getItem("kakeibo");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  // 追加
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

  // 削除
  const handleDelete = (id: number) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    localStorage.setItem("kakeibo", JSON.stringify(updated));
  };

  // 全削除
  const handleClear = () => {
    setItems([]);
    localStorage.removeItem("kakeibo");
  };

  // 🔥 バックアップ保存
  const handleExport = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "kakeibo_backup.json";
    a.click();
  };

  // 🔥 復元
  const handleImport = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const data = JSON.parse(reader.result as string);
      setItems(data);
      localStorage.setItem("kakeibo", JSON.stringify(data));
    };
    reader.readAsText(file);
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

  const max = Math.max(...Object.values(categoryTotals), 1);

  return (
    <div style={{ padding: 20, background: "#f7f7fb", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center" }}>家計簿アプリ</h1>

      {/* 入力 */}
      <div style={{
        background: "#fff",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)}
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

        {type === "expense" && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
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
            padding: 15,
            width: "100%",
            borderRadius: 10,
            fontSize: 18,
            border: "none",
          }}
        >
          追加する
        </button>
      </div>

      {/* 合計 */}
      <h2 style={{
        textAlign: "center",
        color: total >= 0 ? "#77dd77" : "#ff8fa3",
        marginTop: 20,
      }}>
        合計: {total}円
      </h2>

      {/* グラフ */}
      <h3>カテゴリ別支出</h3>
      {Object.entries(categoryTotals).map(([cat, amount]) => (
        <div key={cat} style={{ marginBottom: 10 }}>
          <div>{cat}: {amount}円</div>
          <div style={{
            height: 20,
            width: `${(amount / max) * 100}%`,
            background: "#bae1ff",
            borderRadius: 10,
          }} />
        </div>
      ))}

      {/* 一覧 */}
      <ul style={{ marginTop: 20 }}>
        {[...items].reverse().map((item) => (
          <li key={item.id} style={{
            background: "#fff",
            padding: 10,
            borderRadius: 10,
            marginBottom: 10,
          }}>
            <div style={{
              color: item.type === "income" ? "#77dd77" : "#ff8fa3",
            }}>
              {item.date} {item.text} ({item.amount}円)
              {item.type === "expense" && `【${item.category}】`}
            </div>

            <button onClick={() => handleDelete(item.id)}>
              削除
            </button>
          </li>
        ))}
      </ul>

      {/* 🔥 バックアップ */}
      <button
        onClick={handleExport}
        style={{
          background: "#bae1ff",
          padding: 15,
          width: "100%",
          borderRadius: 10,
          border: "none",
          marginTop: 10,
        }}
      >
        データ保存（バックアップ）
      </button>

      <input
        type="file"
        accept="application/json"
        onChange={handleImport}
        style={{ marginTop: 10 }}
      />

      {/* 全削除 */}
      <button
        onClick={handleClear}
        style={{
          background: "#ff8fa3",
          color: "white",
          padding: 15,
          width: "100%",
          borderRadius: 10,
          border: "none",
          marginTop: 20,
        }}
      >
        すべて削除
      </button>
    </div>
  );
}
