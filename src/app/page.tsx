"use client";

import { useState } from "react";
import { useTheme } from "next-themes";

type TransactionType = "income" | "expense";

type Category = {
  name: string;
  emoji: string;
};

type Transaction = {
  id: number;
  emoji: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  type: TransactionType;
};

const initialTransactions: Transaction[] = [
  {
    id: 1,
    emoji: "�",
    title: "Luz y agua",
    category: "Servicios",
    date: "11 feb",
    amount: -75,
    type: "expense",
  },
  {
    id: 2,
    emoji: "🚗",
    title: "Uber semana",
    category: "Transporte",
    date: "10 feb",
    amount: -35,
    type: "expense",
  },
  {
    id: 3,
    emoji: "🎁",
    title: "Regalo cumpleaños",
    category: "Regalos",
    date: "10 feb",
    amount: 200,
    type: "income",
  },
  {
    id: 4,
    emoji: "🍔",
    title: "Almuerzo restaurante",
    category: "Comida",
    date: "9 feb",
    amount: -22,
    type: "expense",
  },
  {
    id: 5,
    emoji: "👗",
    title: "Ropa nueva",
    category: "Compras",
    date: "8 feb",
    amount: -85,
    type: "expense",
  },
  {
    id: 6,
    emoji: "💻",
    title: "Curso de React",
    category: "Educación",
    date: "7 feb",
    amount: -40,
    type: "expense",
  },
];

type Filter = "all" | "income" | "expense";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>(
    initialTransactions,
  );
  const [filter, setFilter] = useState<Filter>("all");
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    amount: "",
    type: "expense" as TransactionType,
  });
  const [categories, setCategories] = useState<Category[]>([
    { name: "Servicios", emoji: "💡" },
    { name: "Transporte", emoji: "🚗" },
    { name: "Regalos", emoji: "🎁" },
    { name: "Comida", emoji: "🍔" },
    { name: "Compras", emoji: "👗" },
    { name: "Educación", emoji: "💻" },
  ]);
  const [newCategory, setNewCategory] = useState<{ name: string; emoji: string }>({ name: "", emoji: "" });
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const commonEmojis = [
    "💰", "💵", "💸", "🏦", "💳", "💴", "💶", "💷", "💎",
    "🍔", "🍕", "🍜", "☕", "🥤", "🍺", "🍷", "🥗", "🍰",
    "🚗", "🚕", "🚇", "🚌", "✈️", "🚲", "⛽", "🅿️", "🛵",
    "🏠", "💡", "💧", "🔥", "📱", "💻", "🖥️", "⌨️", "🖱️",
    "👕", "👖", "👗", "👟", "👜", "💄", "🎁", "🧴", "🧹",
    "🏥", "💊", "🩺", "❤️", "🧘", "🏋️", "⚽", "🎮", "🎬",
    "📚", "✏️", "🎓", "🧮", "🔧", "🛠️", "🧰", "📦", "✉️",
    "🐶", "🐱", "🌱", "🌻", "🌳", "🌍", "⭐", "🌙", "☀️",
  ];

  const handleEmojiSelect = (emoji: string) => {
    setNewCategory((nc) => ({ ...nc, emoji }));
    setIsEmojiPickerOpen(false);
  };

  const visibleTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((tx) => tx.type === filter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = Number(form.amount.replace(",", "."));
    if (!form.title || !form.category || !parsedAmount) return;

    const selectedCategory = categories.find((c) => c.name === form.category);
    const categoryEmoji = selectedCategory?.emoji || (form.type === "income" ? "💸" : "🧾");

    const newTx: Transaction = {
      id: Date.now(),
      emoji: categoryEmoji,
      title: form.title,
      category: form.category,
      date: "hoy",
      amount: form.type === "income" ? Math.abs(parsedAmount) : -Math.abs(parsedAmount),
      type: form.type,
    };

    setTransactions((prev) => [newTx, ...prev]);
    setForm({ title: "", category: "", amount: "", type: "expense" });
    setIsTransactionModalOpen(false);
  };

  const handleDeleteCategory = (categoryName: string) => {
    const inUse = transactions.some((tx) => tx.category === categoryName);
    if (inUse) return;
    setCategories((prev) => prev.filter((c) => c.name !== categoryName));
    if (form.category === categoryName) {
      setForm((f) => ({ ...f, category: "" }));
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-8 pb-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-3xl md:text-4xl">
            <span>💰</span>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Mis Finanzas
            </h1>
          </div>
          <p className="mt-1 text-sm text-zinc-500 md:text-base">
            Controla tus ingresos y gastos con una vista clara y minimalista.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-zinc-50 text-xs shadow-sm transition hover:border-zinc-400 hover:bg-white dark:border-zinc-700 dark:bg-zinc-900"
          >
            <span className="hidden dark:inline">🌙</span>
            <span className="dark:hidden">☀️</span>
          </button>
          <button
            type="button"
            onClick={() => setIsTransactionModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-black/20 transition hover:bg-zinc-900"
          >
            <span className="text-base">＋</span>
            <span>Agregar</span>
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.10)] dark:bg-zinc-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
            💰
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
              Balance
            </span>
            <span className="text-xl font-semibold text-emerald-500 md:text-2xl">
              $3,208.00
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-3xl bg-emerald-50 p-4 shadow-[0_18px_45px_rgba(16,185,129,0.18)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl">
            📈
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-600">
              Ingresos
            </span>
            <span className="text-xl font-semibold text-emerald-600 md:text-2xl">
              $4,650.00
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-3xl bg-rose-50 p-4 shadow-[0_18px_45px_rgba(244,63,94,0.18)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl">
            📉
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-rose-600">
              Gastos
            </span>
            <span className="text-xl font-semibold text-rose-600 md:text-2xl">
              $1,442.00
            </span>
          </div>
        </div>
      </section>

      <section className="mt-2 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold tracking-tight md:text-lg">
            Transacciones
          </h2>
          <div className="inline-flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCategoriesModalOpen(true)}
              className="hidden rounded-full border border-dashed border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 sm:inline-flex"
            >
              <span>🏷️</span>
              <span>Gestionar categorías</span>
            </button>
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 p-1 text-xs font-medium text-zinc-500 dark:bg-zinc-900/60">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium shadow-sm transition ${
                  filter === "all"
                    ? "bg-black text-white"
                    : "bg-transparent text-zinc-600 hover:bg-white"
                }`}
              >
                <span>📋</span>
                <span>Todos</span>
              </button>
              <button
                type="button"
                onClick={() => setFilter("income")}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  filter === "income"
                    ? "bg-black text-white"
                    : "text-zinc-600 hover:bg-white"
                }`}
              >
                <span>⬆️</span>
                <span>Ingresos</span>
              </button>
              <button
                type="button"
                onClick={() => setFilter("expense")}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  filter === "expense"
                    ? "bg-black text-white"
                    : "text-zinc-600 hover:bg-white"
                }`}
              >
                <span>⬇️</span>
                <span>Gastos</span>
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {visibleTransactions.map((tx) => (
            <article
              key={tx.id}
              className="flex items-center justify-between rounded-3xl bg-white px-4 py-3 text-sm shadow-[0_12px_32px_rgba(15,23,42,0.10)] dark:bg-zinc-900"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-zinc-100 text-xl">
                  {tx.emoji}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {tx.title}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {tx.category} · {tx.date}
                  </span>
                </div>
              </div>
              <div
                className={`text-sm font-semibold ${
                  tx.amount >= 0 ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {tx.amount >= 0 ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
              </div>
            </article>
          ))}
        </div>
      </section>

      {isTransactionModalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 text-sm shadow-xl dark:bg-zinc-900">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold tracking-tight">
                Nueva transacción
              </h3>
              <button
                type="button"
                onClick={() => setIsTransactionModalOpen(false)}
                className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-200"
              >
                Cerrar
              </button>
            </div>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-600">
                  Título
                </label>
                <input
                  className="w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-900"
                  placeholder="Ej. Supermercado"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-600">
                  Categoría
                </label>
                <select
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-zinc-900"
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.emoji} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-[1.2fr_0.8fr] gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-600">
                    Monto
                  </label>
                  <input
                    className="w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-900"
                    placeholder="Ej. 120.50"
                    value={form.amount}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, amount: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-600">
                    Tipo
                  </label>
                  <div className="flex h-10 items-center rounded-2xl bg-zinc-100 p-1 text-xs font-medium text-zinc-600">
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, type: "income" }))}
                      className={`flex-1 rounded-2xl px-2 py-1 transition ${
                        form.type === "income"
                          ? "bg-emerald-500 text-white"
                          : "hover:bg-white"
                      }`}
                    >
                      Ingreso
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, type: "expense" }))}
                      className={`flex-1 rounded-2xl px-2 py-1 transition ${
                        form.type === "expense"
                          ? "bg-rose-500 text-white"
                          : "hover:bg-white"
                      }`}
                    >
                      Gasto
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-black px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-black/20 transition hover:bg-zinc-900"
              >
                Guardar
              </button>
            </form>
          </div>
        </div>
      )}

      {isCategoriesModalOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 text-base shadow-xl dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight">
                🏷️ Gestionar categorías
              </h3>
              <button
                type="button"
                onClick={() => setIsCategoriesModalOpen(false)}
                className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm text-zinc-500 hover:bg-zinc-200"
              >
                Cerrar
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-600">
                  Nueva categoría
                </label>
                <div className="flex items-stretch gap-3">
                  <div className="relative flex flex-col items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                      className="flex h-14 w-16 items-center justify-center rounded-2xl border-2 border-zinc-200 bg-white text-2xl transition hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800"
                    >
                      {newCategory.emoji || "📋"}
                    </button>
                    <span className="text-[10px] text-zinc-400">Emoji</span>
                    {isEmojiPickerOpen && (
                      <div className="absolute bottom-full left-0 z-50 mb-2 w-64 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl dark:border-zinc-700 dark:bg-zinc-800">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-zinc-600">Selecciona un emoji</span>
                          <button
                            type="button"
                            onClick={() => setIsEmojiPickerOpen(false)}
                            className="text-xs text-zinc-400 hover:text-zinc-600"
                          >
                            Cerrar
                          </button>
                        </div>
                        <div className="grid grid-cols-9 gap-1">
                          {commonEmojis.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => handleEmojiSelect(emoji)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-lg transition hover:bg-zinc-100 dark:hover:bg-zinc-700"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    className="flex-1 rounded-2xl border-2 border-zinc-200 px-4 py-3 text-base outline-none ring-0 transition placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800"
                    placeholder="Ej. Salud"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory((nc: { name: string; emoji: string }) => ({ ...nc, name: e.target.value }))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const name = newCategory.name.trim();
                      const emoji = newCategory.emoji.trim();
                      if (!name) return;
                      if (!categories.some((c) => c.name === name)) {
                        setCategories((prev) => [...prev, { name, emoji: emoji || "📋" }]);
                      }
                      setNewCategory({ name: "", emoji: "" });
                    }}
                    className="rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white shadow-md transition hover:bg-zinc-900"
                  >
                    Agregar
                  </button>
                </div>
                <p className="text-xs text-zinc-400">
                  Selecciona un emoji y escribe el nombre de la categoría
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-600">
                  Categorías actuales ({categories.length})
                </label>
                <div className="flex flex-wrap gap-2 text-sm">
                  {categories.map((cat) => {
                    const inUse = transactions.some((tx) => tx.category === cat.name);
                    return (
                      <span
                        key={cat.name}
                        className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-4 py-2 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      >
                        <span className="text-lg">{cat.emoji}</span>
                        <span className="font-medium">{cat.name}</span>
                        <button
                          type="button"
                          disabled={inUse}
                          onClick={() => handleDeleteCategory(cat.name)}
                          className={`ml-1 rounded-full border px-2 py-0.5 text-xs leading-none transition ${
                            inUse
                              ? "cursor-not-allowed border-transparent text-zinc-400"
                              : "border-zinc-300 text-zinc-500 hover:border-rose-400 hover:text-rose-500"
                          }`}
                          aria-label={`Eliminar categoría ${cat.name}`}
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
