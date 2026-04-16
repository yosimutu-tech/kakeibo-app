import { useState, useEffect, useCallback } from "react";
import { nanoid } from "nanoid";

// ============================================================
// 型定義
// ============================================================

export type TransactionType = "income" | "expense";

// カテゴリ定義（収入・支出それぞれ）
export const CATEGORIES: Record<TransactionType, string[]> = {
  income: ["給与", "副収入", "賞与", "投資", "その他収入"],
  expense: [
    "食費",
    "外食",
    "日用品",
    "交通費",
    "住居費",
    "光熱費",
    "通信費",
    "医療費",
    "衣類",
    "娯楽",
    "教育",
    "その他支出",
  ],
};

// カテゴリ別カラー定義
export interface CategoryColor {
  bg: string;
  text: string;
  dot: string;
}

export const CATEGORY_COLORS: Record<string, CategoryColor> = {
  // 収入カテゴリ
  給与:       { bg: "bg-emerald-100", text: "text-emerald-700", dot: "#10b981" },
  副収入:     { bg: "bg-teal-100",    text: "text-teal-700",    dot: "#14b8a6" },
  賞与:       { bg: "bg-green-100",   text: "text-green-700",   dot: "#22c55e" },
  投資:       { bg: "bg-cyan-100",    text: "text-cyan-700",    dot: "#06b6d4" },
  その他収入: { bg: "bg-sky-100",     text: "text-sky-700",     dot: "#0ea5e9" },
  // 支出カテゴリ
  食費:       { bg: "bg-orange-100",  text: "text-orange-700",  dot: "#f97316" },
  外食:       { bg: "bg-amber-100",   text: "text-amber-700",   dot: "#f59e0b" },
  日用品:     { bg: "bg-yellow-100",  text: "text-yellow-700",  dot: "#eab308" },
  交通費:     { bg: "bg-blue-100",    text: "text-blue-700",    dot: "#3b82f6" },
  住居費:     { bg: "bg-indigo-100",  text: "text-indigo-700",  dot: "#6366f1" },
  光熱費:     { bg: "bg-violet-100",  text: "text-violet-700",  dot: "#8b5cf6" },
  通信費:     { bg: "bg-purple-100",  text: "text-purple-700",  dot: "#a855f7" },
  医療費:     { bg: "bg-rose-100",    text: "text-rose-700",    dot: "#f43f5e" },
  衣類:       { bg: "bg-pink-100",    text: "text-pink-700",    dot: "#ec4899" },
  娯楽:       { bg: "bg-fuchsia-100", text: "text-fuchsia-700", dot: "#d946ef" },
  教育:       { bg: "bg-lime-100",    text: "text-lime-700",    dot: "#84cc16" },
  その他支出: { bg: "bg-slate-100",   text: "text-slate-600",   dot: "#94a3b8" },
};

export function getCategoryColor(category: string): CategoryColor {
  return (
    CATEGORY_COLORS[category] ?? {
      bg: "bg-gray-100",
      text: "text-gray-600",
      dot: "#9ca3af",
    }
  );
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  memo: string;
  date: string; // YYYY-MM-DD
  createdAt: number;
}

export interface MonthlySummary {
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryTotal {
  category: string;
  amount: number;
  count: number;
  color: CategoryColor;
}

// ============================================================
// localStorage
// ============================================================
const STORAGE_KEY = "kakeibo_transactions";

/** 壊れたデータや型欠損を安全に正規化して読み込む */
function loadFromStorage(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((t): t is Record<string, unknown> => t !== null && typeof t === "object")
      .map((t) => {
        // type フィールドが欠損・不正な場合は "expense" にフォールバック
        const rawType = t["type"];
        const type: TransactionType =
          rawType === "income" || rawType === "expense" ? rawType : "expense";

        // amount は必ず数値に変換（文字列結合バグ防止）
        const amount = Number(t["amount"]) || 0;

        // 必須フィールドのデフォルト値を保証
        return {
          id:        typeof t["id"] === "string" && t["id"] ? t["id"] : nanoid(),
          type,
          amount,
          category:  typeof t["category"] === "string" ? t["category"] : "",
          memo:      typeof t["memo"] === "string" ? t["memo"] : "",
          date:      typeof t["date"] === "string" ? t["date"] : new Date().toISOString().slice(0, 10),
          createdAt: typeof t["createdAt"] === "number" ? t["createdAt"] : Date.now(),
        } satisfies Transaction;
      });
  } catch {
    return [];
  }
}

function saveToStorage(transactions: Transaction[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch {
    // ストレージ容量超過などは無視
  }
}

// ============================================================
// カスタムフック
// ============================================================
export function useKakeibo() {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadFromStorage()
  );

  // 変更時に自動保存（上書きではなく全件を保存）
  useEffect(() => {
    saveToStorage(transactions);
  }, [transactions]);

  /** 新規追加 — 既存データは一切変更しない */
  const addTransaction = useCallback(
    (data: Omit<Transaction, "id" | "createdAt">) => {
      const newTx: Transaction = {
        type:      data.type === "income" ? "income" : "expense", // 型を明示的に検証
        amount:    Number(data.amount),                            // 必ず数値で保存
        category:  data.category,
        memo:      data.memo ?? "",
        date:      data.date,
        id:        nanoid(),
        createdAt: Date.now(),
      };
      // prev を展開して先頭に追加（上書きではなく追加）
      setTransactions((prev) => [newTx, ...prev]);
    },
    []
  );

  /** 既存データの更新 — id が一致する1件だけを差し替える */
  const updateTransaction = useCallback(
    (id: string, data: Partial<Omit<Transaction, "id" | "createdAt">>) => {
      setTransactions((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          const updated: Transaction = {
            ...t,
            ...data,
            // 型安全に上書き
            type:   data.type === "income" || data.type === "expense" ? data.type : t.type,
            amount: data.amount !== undefined ? Number(data.amount) : t.amount,
            id:     t.id,
            createdAt: t.createdAt,
          };
          return updated;
        })
      );
    },
    []
  );

  /** 削除 */
  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /** 月別フィルタ (YYYY-MM) — 日付降順・createdAt降順 */
  const getMonthlyTransactions = useCallback(
    (yearMonth: string): Transaction[] =>
      transactions
        .filter((t) => t.date.startsWith(yearMonth))
        .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt),
    [transactions]
  );

  /** 月別サマリー */
  const getMonthlySummary = useCallback(
    (yearMonth: string): MonthlySummary => {
      const monthly = getMonthlyTransactions(yearMonth);
      const income  = monthly.filter((t) => t.type === "income") .reduce((s, t) => s + Number(t.amount), 0);
      const expense = monthly.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
      return { income, expense, balance: income - expense };
    },
    [getMonthlyTransactions]
  );

  /** カテゴリ別集計（合計金額・件数・カラー付き） */
  const getCategoryBreakdown = useCallback(
    (yearMonth: string, type: TransactionType): CategoryTotal[] => {
      const monthly = getMonthlyTransactions(yearMonth).filter((t) => t.type === type);
      const map: Record<string, { amount: number; count: number }> = {};
      for (const t of monthly) {
        if (!map[t.category]) map[t.category] = { amount: 0, count: 0 };
        map[t.category].amount += Number(t.amount);
        map[t.category].count  += 1;
      }
      return Object.entries(map)
        .map(([category, { amount, count }]) => ({
          category,
          amount,
          count,
          color: getCategoryColor(category),
        }))
        .sort((a, b) => b.amount - a.amount);
    },
    [getMonthlyTransactions]
  );

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthlyTransactions,
    getMonthlySummary,
    getCategoryBreakdown,
  };
}

// ============================================================
// ユーティリティ
// ============================================================
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return new Intl.DateTimeFormat("ja-JP", {
    month: "short",
    day: "numeric",
    weekday: "short",
  }).format(d);
}

export function getCurrentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function getYearMonthLabel(yearMonth: string): string {
  const [y, m] = yearMonth.split("-");
  return `${y}年${parseInt(m)}月`;
}

export function addMonths(yearMonth: string, delta: number): string {
  const [y, m] = yearMonth.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

