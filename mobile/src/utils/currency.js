export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === undefined || amount === null) return '₹ 0';
  const symbol = currency === 'INR' ? '₹ ' : '$ ';
  return `${symbol}${Number(amount).toLocaleString('en-IN')}`;
};
