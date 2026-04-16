/**
 * かんたん家計簿 - メインページ
 * デザイン: スカンジナビアン・ミニマリズム × 機能美
 * - オフホワイト背景 × チャコール文字
 * - 収入: エメラルドグリーン (+) / 支出: コーラルレッド (-)
 * - カテゴリ別色分けバッジ（12色）
 * - 編集ダイアログ: 金額・カテゴリ・メモ・type を変更可能
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Pencil,
  BarChart3,
  List,
  PieChart,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  useKakeibo,
  CATEGORIES,
  getCategoryColor,
  TransactionType,
  Transaction,
  CategoryTotal,
  formatCurrency,
  formatDate,
  getCurrentYearMonth,
  getYearMonthLabel,
  addMonths,
} from "@/hooks/useKakeibo";

// ============================================================
// カテゴリバッジ
// ============================================================
function CategoryBadge({ category }: { category: string }) {
  const color = getCategoryColor(category);
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${color.bg} ${color.text}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color.dot }}
      />
      {category}
    </span>
  );
}

// ============================================================
// サマリーカード
// ============================================================
function SummaryCard({
  title,
  amount,
  icon: Icon,
  colorClass,
  bgClass,
  delay = 0,
}: {
  title: string;
  amount: number;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-1 truncate">
                {title}
              </p>
              <p className={`text-lg sm:text-2xl font-bold font-mono-num ${colorClass}`}>
                {formatCurrency(amount)}
              </p>
            </div>
            <div className={`p-2 sm:p-2.5 rounded-xl ${bgClass} flex-shrink-0 ml-2`}>
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${colorClass}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================================
// 共通フォームフィールド（追加・編集で共用）
// ============================================================
function TransactionFormFields({
  type,
  amount,
  category,
  memo,
  date,
  onTypeChange,
  onAmountChange,
  onCategoryChange,
  onMemoChange,
  onDateChange,
}: {
  type: TransactionType;
  amount: string;
  category: string;
  memo: string;
  date: string;
  onTypeChange: (v: TransactionType) => void;
  onAmountChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onMemoChange: (v: string) => void;
  onDateChange: (v: string) => void;
}) {
  return (
    <>
      {/* 収入/支出 切り替え */}
      <div className="flex rounded-xl overflow-hidden border border-border">
        <button
          type="button"
          onClick={() => onTypeChange("expense")}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors duration-150 ${
            type === "expense"
              ? "bg-[var(--expense)] text-white"
              : "bg-transparent text-muted-foreground hover:bg-muted"
          }`}
        >
          支出
        </button>
        <button
          type="button"
          onClick={() => onTypeChange("income")}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors duration-150 ${
            type === "income"
              ? "bg-[var(--income)] text-white"
              : "bg-transparent text-muted-foreground hover:bg-muted"
          }`}
        >
          収入
        </button>
      </div>

      {/* 金額 */}
      <div className="space-y-1.5">
        <Label htmlFor="tx-amount" className="text-sm font-medium">金額（円）</Label>
        <Input
          id="tx-amount"
          type="number"
          min="1"
          placeholder="例: 1500"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="font-mono-num text-lg h-11"
          required
        />
      </div>

      {/* カテゴリ */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">カテゴリ</Label>
        <Select value={category} onValueChange={onCategoryChange} required>
          <SelectTrigger className="h-11">
            {category ? (
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getCategoryColor(category).dot }}
                />
                <span>{category}</span>
              </div>
            ) : (
              <SelectValue placeholder="カテゴリを選択" />
            )}
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES[type].map((cat) => {
              const color = getCategoryColor(cat);
              return (
                <SelectItem key={cat} value={cat}>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color.dot }}
                    />
                    <span>{cat}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* 日付 */}
      <div className="space-y-1.5">
        <Label htmlFor="tx-date" className="text-sm font-medium">日付</Label>
        <Input
          id="tx-date"
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="h-11"
          required
        />
      </div>

      {/* メモ */}
      <div className="space-y-1.5">
        <Label htmlFor="tx-memo" className="text-sm font-medium">メモ（任意）</Label>
        <Input
          id="tx-memo"
          placeholder="例: ランチ代"
          value={memo}
          onChange={(e) => onMemoChange(e.target.value)}
          className="h-11"
        />
      </div>
    </>
  );
}

// ============================================================
// 新規追加フォーム
// ============================================================
function AddTransactionForm({ onClose }: { onClose: () => void }) {
  const { addTransaction } = useKakeibo();
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [memo, setMemo] = useState("");
  const [date] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  });
  const [currentDate, setCurrentDate] = useState(date);

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(""); // タイプ変更時にカテゴリリセット
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(amount.replace(/,/g, ""), 10);
    if (!num || num <= 0) {
      toast.error("金額を正しく入力してください");
      return;
    }
    if (!category) {
      toast.error("カテゴリを選択してください");
      return;
    }
    // type を明示的に渡して収入/支出を確実に区別する
    addTransaction({ type, amount: num, category, memo, date: currentDate });
    toast.success(type === "income" ? "収入を追加しました" : "支出を追加しました");
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <TransactionFormFields
        type={type}
        amount={amount}
        category={category}
        memo={memo}
        date={currentDate}
        onTypeChange={handleTypeChange}
        onAmountChange={setAmount}
        onCategoryChange={setCategory}
        onMemoChange={setMemo}
        onDateChange={setCurrentDate}
      />
      <Button
        type="submit"
        className="w-full h-11 font-semibold text-base"
        style={
          type === "income"
            ? { backgroundColor: "var(--income)", color: "white" }
            : { backgroundColor: "var(--expense)", color: "white" }
        }
      >
        追加する
      </Button>
    </form>
  );
}

// ============================================================
// 編集フォーム
// ============================================================
function EditTransactionForm({
  transaction,
  onClose,
}: {
  transaction: Transaction;
  onClose: () => void;
}) {
  const { updateTransaction } = useKakeibo();
  const [type, setType] = useState<TransactionType>(transaction.type);
  const [amount, setAmount] = useState(String(transaction.amount));
  const [category, setCategory] = useState(transaction.category);
  const [memo, setMemo] = useState(transaction.memo);
  const [date, setDate] = useState(transaction.date);

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    // 現在のカテゴリが新しいタイプに存在しない場合はリセット
    if (!CATEGORIES[newType].includes(category)) {
      setCategory("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(amount.replace(/,/g, ""), 10);
    if (!num || num <= 0) {
      toast.error("金額を正しく入力してください");
      return;
    }
    if (!category) {
      toast.error("カテゴリを選択してください");
      return;
    }
    updateTransaction(transaction.id, { type, amount: num, category, memo, date });
    toast.success("更新しました");
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <TransactionFormFields
        type={type}
        amount={amount}
        category={category}
        memo={memo}
        date={date}
        onTypeChange={handleTypeChange}
        onAmountChange={setAmount}
        onCategoryChange={setCategory}
        onMemoChange={setMemo}
        onDateChange={setDate}
      />
      <Button
        type="submit"
        className="w-full h-11 font-semibold text-base"
        style={
          type === "income"
            ? { backgroundColor: "var(--income)", color: "white" }
            : { backgroundColor: "var(--expense)", color: "white" }
        }
      >
        保存する
      </Button>
    </form>
  );
}

// ============================================================
// 取引一覧（編集・削除ボタン付き）
// ============================================================
function TransactionList({ yearMonth }: { yearMonth: string }) {
  const { getMonthlyTransactions, deleteTransaction } = useKakeibo();
  const transactions = getMonthlyTransactions(yearMonth);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  // 削除確認ダイアログ用: 対象 id を保持（null = 非表示）
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (!deleteTargetId) return;
    deleteTransaction(deleteTargetId);
    toast.success("削除しました");
    setDeleteTargetId(null);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Wallet className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm">この月の記録はありません</p>
        <p className="text-xs mt-1 opacity-70">右下の＋ボタンから追加できます</p>
      </div>
    );
  }

  // 日付でグループ化
  const grouped = transactions.reduce<Record<string, typeof transactions>>(
    (acc, t) => {
      if (!acc[t.date]) acc[t.date] = [];
      acc[t.date].push(t);
      return acc;
    },
    {}
  );
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <>
      <div className="space-y-5">
        <AnimatePresence>
          {sortedDates.map((date) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {/* 日付ヘッダー + 日次収支 */}
              <div className="flex items-center gap-2 mb-2 px-1">
                <p className="text-xs font-semibold text-muted-foreground">
                  {formatDate(date)}
                </p>
                <div className="flex-1 h-px bg-border/60" />
                <span className="text-xs font-mono-num">
                  {(() => {
                    const dayIncome  = grouped[date].filter((t) => t.type === "income") .reduce((s, t) => s + Number(t.amount), 0);
                    const dayExpense = grouped[date].filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
                    const net = dayIncome - dayExpense;
                    return (
                      <span className={net >= 0 ? "text-[var(--income)]" : "text-[var(--expense)]"}>
                        {net >= 0 ? "+" : ""}{formatCurrency(net)}
                      </span>
                    );
                  })()}
                </span>
              </div>

              {/* 取引行 */}
              <div className="space-y-2">
                {grouped[date].map((t) => (
                  <motion.div
                    key={t.id}
                    layout
                    className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 shadow-sm border border-border/50 group"
                  >
                    {/* カテゴリバッジ */}
                    <CategoryBadge category={t.category} />

                    {/* メモ */}
                    <span className="flex-1 text-sm text-foreground truncate min-w-0">
                      {t.memo || "—"}
                    </span>

                    {/* 金額（type に応じて + / - を表示） */}
                    <span
                      className={`font-mono-num font-semibold text-sm flex-shrink-0 ${
                        t.type === "income"
                          ? "text-[var(--income)]"
                          : "text-[var(--expense)]"
                      }`}
                    >
                      {t.type === "income" ? "+" : "−"}
                      {formatCurrency(t.amount)}
                    </span>

                    {/* 編集ボタン */}
                    <button
                      onClick={() => setEditTarget(t)}
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-muted-foreground hover:text-primary p-1 rounded flex-shrink-0"
                      aria-label="編集"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    {/* 削除ボタン（確認ダイアログを開く） */}
                    <button
                      onClick={() => setDeleteTargetId(t.id)}
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1 rounded flex-shrink-0"
                      aria-label="削除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 削除確認ダイアログ */}
      <AlertDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => { if (!open) setDeleteTargetId(null); }}
      >
        <AlertDialogContent className="max-w-sm mx-auto rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold">本当に削除しますか？</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              この記録を削除すると元に戻せません。<br />
              収入・支出・残高の合計も即時更新されます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="flex-1">キャンセル</AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteConfirm}
            >
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 編集ダイアログ */}
      <Dialog open={editTarget !== null} onOpenChange={(open) => { if (!open) setEditTarget(null); }}>
        <DialogContent className="max-w-sm mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">記録を編集</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <EditTransactionForm
              transaction={editTarget}
              onClose={() => setEditTarget(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// ============================================================
// カテゴリ別合計パネル
// ============================================================
function CategorySummaryPanel({
  data,
  total,
  label,
}: {
  data: CategoryTotal[];
  total: number;
  label: string;
}) {
  if (data.length === 0) {
    return <div className="text-center py-8 text-muted-foreground text-sm">データがありません</div>;
  }
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p className="text-sm font-bold font-mono-num text-foreground">合計 {formatCurrency(total)}</p>
      </div>
      {data.map((item) => {
        const pct = total > 0 ? (item.amount / total) * 100 : 0;
        return (
          <div key={item.category} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CategoryBadge category={item.category} />
                <span className="text-xs text-muted-foreground">{item.count}件</span>
              </div>
              <div className="text-right">
                <span className="font-mono-num font-semibold text-sm text-foreground">
                  {formatCurrency(item.amount)}
                </span>
                <span className="text-xs text-muted-foreground ml-1.5">{pct.toFixed(1)}%</span>
              </div>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: item.color.dot }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// 円グラフ
// ============================================================
function CategoryChart({ yearMonth }: { yearMonth: string }) {
  const { getCategoryBreakdown } = useKakeibo();
  const expenseData = getCategoryBreakdown(yearMonth, "expense");
  const incomeData  = getCategoryBreakdown(yearMonth, "income");

  const renderPie = (data: CategoryTotal[], label: string) => {
    if (data.length === 0) {
      return <div className="text-center py-8 text-muted-foreground text-sm">データがありません</div>;
    }
    return (
      <div>
        <p className="text-sm font-semibold text-muted-foreground mb-3">{label}</p>
        <ResponsiveContainer width="100%" height={200}>
          <RechartsPie>
            <Pie data={data} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={75} innerRadius={35} paddingAngle={2}>
              {data.map((entry, i) => <Cell key={i} fill={entry.color.dot} />)}
            </Pie>
            <Tooltip
              formatter={(v: number) => formatCurrency(v)}
              contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
            />
            <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: "12px" }}>{v}</span>} />
          </RechartsPie>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderPie(expenseData, "支出の内訳")}
      {renderPie(incomeData,  "収入の内訳")}
    </div>
  );
}

// ============================================================
// カテゴリタブ内コンテンツ
// ============================================================
function AnalyticsContent({ yearMonth }: { yearMonth: string }) {
  const { getCategoryBreakdown, getMonthlySummary } = useKakeibo();
  const [view, setView] = useState<"chart" | "summary">("summary");
  const expenseData = getCategoryBreakdown(yearMonth, "expense");
  const incomeData  = getCategoryBreakdown(yearMonth, "income");
  const summary     = getMonthlySummary(yearMonth);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setView("summary")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            view === "summary" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          カテゴリ別合計
        </button>
        <button
          onClick={() => setView("chart")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            view === "chart" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          円グラフ
        </button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="px-5 py-5">
          <AnimatePresence mode="wait">
            {view === "summary" ? (
              <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
                <CategorySummaryPanel data={expenseData} total={summary.expense} label="支出カテゴリ別合計" />
                {incomeData.length > 0 && (
                  <>
                    <div className="h-px bg-border" />
                    <CategorySummaryPanel data={incomeData} total={summary.income} label="収入カテゴリ別合計" />
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div key="chart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <CategoryChart yearMonth={yearMonth} />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
// メインページ
// ============================================================
export default function Home() {
  const [yearMonth, setYearMonth] = useState(getCurrentYearMonth);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { getMonthlySummary } = useKakeibo();

  const summary = useMemo(
    () => getMonthlySummary(yearMonth),
    [getMonthlySummary, yearMonth]
  );

  const prevMonth = () => setYearMonth((ym) => addMonths(ym, -1));
  const nextMonth = () => setYearMonth((ym) => addMonths(ym, 1));
  const isCurrentMonth = yearMonth === getCurrentYearMonth();

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/60">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-base font-bold text-foreground tracking-tight">
              かんたん家計簿
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-semibold min-w-[80px] text-center">
              {getYearMonthLabel(yearMonth)}
            </span>
            <Button variant="ghost" size="icon" onClick={nextMonth} disabled={isCurrentMonth} className="h-8 w-8">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-2xl mx-auto px-4 py-5 space-y-5 pb-24">
        {/* サマリーカード */}
        <div className="grid grid-cols-3 gap-3">
          <SummaryCard title="収入" amount={summary.income}  icon={TrendingUp}   colorClass="text-[var(--income)]"  bgClass="bg-[var(--income-bg)]"  delay={0}    />
          <SummaryCard title="支出" amount={summary.expense} icon={TrendingDown} colorClass="text-[var(--expense)]" bgClass="bg-[var(--expense-bg)]" delay={0.05} />
          <SummaryCard
            title="残高"
            amount={summary.balance}
            icon={Wallet}
            colorClass={summary.balance >= 0 ? "text-[var(--balance)]" : "text-[var(--expense)]"}
            bgClass={summary.balance >= 0 ? "bg-amber-50" : "bg-[var(--expense-bg)]"}
            delay={0.1}
          />
        </div>

        {/* タブ */}
        <Tabs defaultValue="list">
          <TabsList className="w-full h-10 bg-muted/60">
            <TabsTrigger value="list" className="flex-1 gap-1.5 text-sm">
              <List className="w-3.5 h-3.5" />
              明細
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 gap-1.5 text-sm">
              <BarChart3 className="w-3.5 h-3.5" />
              カテゴリ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-4">
            <TransactionList yearMonth={yearMonth} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <AnalyticsContent yearMonth={yearMonth} />
          </TabsContent>
        </Tabs>
      </main>

      {/* 追加ボタン（FAB） */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center z-20"
            aria-label="記録を追加"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        </DialogTrigger>
        <DialogContent className="max-w-sm mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">記録を追加</DialogTitle>
          </DialogHeader>
          {/* key でダイアログを開くたびにフォームを初期化 */}
          {addDialogOpen && (
            <AddTransactionForm onClose={() => setAddDialogOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
