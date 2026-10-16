export const AUDIT_I18N = {
  sw: { title: 'Kumbukumbu', subtitle: 'Shughuli za mfumo', search: 'Tafuta...', allActions: 'Vitendo Vyote', today: 'Leo', last7: 'Siku 7', last30: 'Siku 30', allTime: 'Zote', empty: 'Hakuna kumbukumbu', emptyDesc: 'Hakuna shughuli bado', total: 'Jumla', todayStat: 'Za Leo', filter: 'Chuja' },
  en: { title: 'Audit Logs', subtitle: 'System activity', search: 'Search...', allActions: 'All Actions', today: 'Today', last7: '7 Days', last30: '30 Days', allTime: 'All', empty: 'No audit logs', emptyDesc: 'No activity yet', total: 'Total', todayStat: 'Today', filter: 'Filter' },
} as const;
export const ACTION_COLORS: Record<string, any> = {
  admin_login: 'success', admin_login_failed: 'error', admin_logout: 'neutral',
  guest_login: 'brand', guest_login_failed: 'error',
  invite_create: 'brand', invite_delete: 'error', invite_confirm: 'success', invite_decline: 'warning',
  order_create: 'brand', order_fulfill: 'success', payment_verify: 'success', payment_reject: 'error',
  uniform_deliver: 'brand', uniform_distribute: 'success',
};
