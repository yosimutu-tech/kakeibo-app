"use client";
import { useState } from "react";

export default function Home() {
  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);
  const handleDelete = (index: number) => {
  setItems(items.filter((_, i) => i !== index));
};

const handleAdd = () => {
  if (!amount || !text) return;

  const newItem = {
    type,
    amount: Number(amount),
    text,
  };

  setItems([...items, newItem]);
  setAmount("");
  setText("");
};

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
    <li key={i}>
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
