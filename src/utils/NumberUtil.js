export const formatCurrency = (amount) => {
    return amount.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};