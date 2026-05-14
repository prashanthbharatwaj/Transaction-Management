import { Transaction, PaginatedResponse } from '@/types';

// Mock transaction data
export const mockTransactions: Transaction[] = [
  {
    id: 'TXN-001',
    amount: 12.99,
    date: '2026-05-01 14:30',
    status: 'Completed',
    description: 'Monthly Subscription - May 2026',
  },
  {
    id: 'TXN-002',
    amount: 12.99,
    date: '2026-04-01 10:15',
    status: 'Completed',
    description: 'Monthly Subscription - April 2026',
  },
  {
    id: 'TXN-003',
    amount: 12.99,
    date: '2026-03-15 09:45',
    status: 'Failed',
    description: 'Monthly Subscription - March 2026',
  },
  {
    id: 'TXN-004',
    amount: 19.99,
    date: '2026-03-01 16:20',
    status: 'Completed',
    description: 'Premium Plan Upgrade',
  },
  {
    id: 'TXN-005',
    amount: 12.99,
    date: '2026-02-28 11:30',
    status: 'Failed',
    description: 'Monthly Subscription - February 2026',
  },
  {
    id: 'TXN-006',
    amount: 12.99,
    date: '2026-02-01 13:00',
    status: 'Completed',
    description: 'Monthly Subscription - January 2026',
  },
  {
    id: 'TXN-007',
    amount: 12.99,
    date: '2026-01-15 08:30',
    status: 'Failed',
    description: 'Monthly Subscription - January 2026 (Retry)',
  },
  {
    id: 'TXN-008',
    amount: 9.99,
    date: '2025-12-20 17:45',
    status: 'Completed',
    description: 'Monthly Subscription - December 2025',
  },
  {
    id: 'TXN-009',
    amount: 12.99,
    date: '2025-12-01 12:00',
    status: 'Completed',
    description: 'Monthly Subscription - December 2025',
  },
  {
    id: 'TXN-010',
    amount: 12.99,
    date: '2025-11-15 15:30',
    status: 'Failed',
    description: 'Monthly Subscription - November 2025',
  },
  {
    id: 'TXN-011',
    amount: 12.99,
    date: '2025-11-01 10:45',
    status: 'Completed',
    description: 'Monthly Subscription - November 2025',
  },
  {
    id: 'TXN-012',
    amount: 29.99,
    date: '2025-10-20 14:15',
    status: 'Completed',
    description: 'Annual Premium Subscription',
  },
  {
    id: 'TXN-013',
    amount: 12.99,
    date: '2025-10-01 09:30',
    status: 'Completed',
    description: 'Monthly Subscription - October 2025',
  },
  {
    id: 'TXN-014',
    amount: 12.99,
    date: '2025-09-15 16:00',
    status: 'Failed',
    description: 'Monthly Subscription - September 2025',
  },
  {
    id: 'TXN-015',
    amount: 12.99,
    date: '2025-09-01 11:15',
    status: 'Completed',
    description: 'Monthly Subscription - September 2025',
  },
  {
    id: 'TXN-016',
    amount: 12.99,
    date: '2025-08-20 13:45',
    status: 'Completed',
    description: 'Monthly Subscription - August 2025',
  },
  {
    id: 'TXN-017',
    amount: 12.99,
    date: '2025-08-01 10:20',
    status: 'Failed',
    description: 'Monthly Subscription - August 2025 Request',
  },
  {
    id: 'TXN-018',
    amount: 12.99,
    date: '2025-07-15 14:50',
    status: 'Completed',
    description: 'Monthly Subscription - July 2025',
  },
  {
    id: 'TXN-019',
    amount: 12.99,
    date: '2025-07-01 09:10',
    status: 'Completed',
    description: 'Monthly Subscription - July 2025',
  },
  {
    id: 'TXN-020',
    amount: 12.99,
    date: '2025-06-15 15:35',
    status: 'Failed',
    description: 'Monthly Subscription - June 2025',
  },
  {
    id: 'TXN-021',
    amount: 12.99,
    date: '2025-06-01 12:00',
    status: 'Completed',
    description: 'Monthly Subscription - June 2025',
  },
  {
    id: 'TXN-022',
    amount: 12.99,
    date: '2025-05-20 16:25',
    status: 'Completed',
    description: 'Monthly Subscription - May 2025',
  },
  {
    id: 'TXN-023',
    amount: 12.99,
    date: '2025-05-01 10:40',
    status: 'Failed',
    description: 'Monthly Subscription - May 2025 Request',
  },
  {
    id: 'TXN-024',
    amount: 12.99,
    date: '2025-04-15 13:15',
    status: 'Completed',
    description: 'Monthly Subscription - April 2025',
  },
  {
    id: 'TXN-025',
    amount: 12.99,
    date: '2025-04-01 11:30',
    status: 'Completed',
    description: 'Monthly Subscription - April 2025',
  },
];


export async function fetchTransactions(page: number = 1, limit: number = 10): Promise<PaginatedResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = mockTransactions.slice(startIndex, endIndex);
  const totalPages = Math.ceil(mockTransactions.length / limit);
  const summary = mockTransactions.reduce(
    (acc, transaction) => {
      if (transaction.status === 'Completed') acc.completed += 1;
      if (transaction.status === 'Failed') acc.failed += 1;
      if (transaction.status === 'Pending') acc.pending += 1;
      return acc;
    },
    { completed: 0, failed: 0, pending: 0 }
  );

  return {
    transactions: paginatedData,
    total: mockTransactions.length,
    page,
    limit,
    totalPages,
    summary,
  };
}

// Simulate PDF download
export async function downloadInvoice(transactionId: string, amount: number): Promise<void> {
  // Simulate 2-second PDF generation
  await new Promise((resolve) => setTimeout(resolve, 2000));


  const pdfContent = generatePDF(transactionId, amount);
  const blob = new Blob([pdfContent], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoice-${transactionId}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
}

function generatePDF(transactionId: string, amount: number): Uint8Array {
  const date = new Date().toLocaleDateString();
  const content = `Invoice
Transaction ID: ${transactionId}
Amount: $${amount.toFixed(2)}
Date: ${date}`;

  // Basic PDF structure
  const pageContent = `BT
/F1 12 Tf
50 750 Td
(Invoice) Tj
0 -30 Td
(Transaction ID: ${transactionId}) Tj
0 -20 Td
(Amount: $${amount.toFixed(2)}) Tj
0 -20 Td
(Date: ${date}) Tj
ET`;

  const pageContentEncoded = pageContent;
  const pageLength = pageContentEncoded.length;

  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${pageLength} >>
stream
${pageContentEncoded}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000273 00000 n 
${(273 + 76 + pageLength + 20).toString().padStart(10, '0')} 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${273 + 76 + pageLength + 76}
%%EOF`;

  return new TextEncoder().encode(pdf);
}

// Simulate payment retry with random delay (1-4 seconds) and 20% failure rate
export async function retryPayment(transactionId: string): Promise<boolean> {
  const delay = Math.random() * 3000 + 1000; // 1-4 seconds
  await new Promise((resolve) => setTimeout(resolve, delay));

  // 20% failure rate
  const success = Math.random() > 0.2;
  return success;
}
