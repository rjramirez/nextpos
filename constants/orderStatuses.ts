export const OrderStatuses = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  DECLINED: 'declined'
} as const;

export type OrderStatus = typeof OrderStatuses[keyof typeof OrderStatuses];
