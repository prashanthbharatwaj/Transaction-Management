export type TransactionStatus = 'Completed' | 'Failed' | 'Pending';

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  status: TransactionStatus;
  description: string;
}

export interface RetryResult {
  id: string;
  status: TransactionStatus;
  success: boolean;
}

export interface TransactionSummary {
  completed: number;
  failed: number;
  pending: number;
}

export interface PaginatedResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  summary: TransactionSummary;
}
