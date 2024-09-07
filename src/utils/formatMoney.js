const formatMoney = (value) => {
    if (isNaN(value)) {
        return 'Invalid amount';
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};
export { formatMoney };