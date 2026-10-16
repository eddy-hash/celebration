export const ORDERS_I18N = {
  sw: {
    title: 'Oda', subtitle: 'Oda zote za waalikwa', empty: 'Hakuna oda bado', emptyDesc: 'Oda zitaonekana hapa',
    all: 'Zote', awaiting: 'Zinasubiri', paid: 'Zimelipwa', fulfilled: 'Zimekamilika',
    items: 'bidhaa', fulfill: 'Kamilisha', details: 'Maelezo', hide: 'Funga',
    status: { awaiting_payment: 'Inasubiri Malipo', paid: 'Imelipwa', fulfilled: 'Imekamilika', cancelled: 'Imefutwa', pending: 'Inasubiri' },
  },
  en: {
    title: 'Orders', subtitle: 'All guest orders', empty: 'No orders yet', emptyDesc: 'Orders will appear here',
    all: 'All', awaiting: 'Awaiting', paid: 'Paid', fulfilled: 'Fulfilled',
    items: 'items', fulfill: 'Fulfill', details: 'Details', hide: 'Hide',
    status: { awaiting_payment: 'Awaiting Payment', paid: 'Paid', fulfilled: 'Fulfilled', cancelled: 'Cancelled', pending: 'Pending' },
  },
} as const;
