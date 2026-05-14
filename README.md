# Cleeng — Transaction dashboard

Next.js (App Router) + TypeScript + Tailwind. View paginated transactions, download mock PDF invoices, and retry failed payments. All “API” behavior is **simulated in the browser** (`lib/transaction.ts`).

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build && npm start   # production
npm run lint                 # ESLint
npm run test:run             # Vitest (single run)
npm test                     # Vitest watch
```

**Requirements:** Node.js 18.17+

## What it does

| Area | Behavior |
|------|----------|
| **List** | Paginated table; loading state while fetching |
| **Invoice** | Per-row download; ~2s simulated PDF, then browser download |
| **Retry** | Select failed rows → retry runs **in parallel**; row spinners; **one toast per row** when each attempt settles (success / failure) |
| **Toasts** | Fixed **top-right** stack; colors match **Completed / Failed / Pending** |

## Where things live

```
app/                    # routes, layout, globals.css
components/
  transaction-dashboard/index.tsx
  toast-viewport/index.tsx
  pagination/index.tsx
  transaction-table/    # TransactionTable + row, toolbar, loading subparts
hooks/                  # usePaginatedTransactions, … — each hook may have `__tests__/`
utils/                  # pure helpers — `__tests__/` for unit specs
lib/transaction.ts      # mock fetch, download, retry
types/index.ts          # Transaction, PaginatedResponse, …
```

**Rough data flow:** `usePaginatedTransactions` loads a page → `TransactionTable` renders rows → user triggers **retry** → `useTransactionPaymentRetries` calls `retryPayment` per id → status overrides update the table → `useTimedToasts` shows a toast per settled retry.

