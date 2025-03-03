export const validateNullOrEmpty = (value) => {
    if (!value) {
        return false;
    }
    return String(value).trim() !== '';
};
export const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    return phoneRegex.test(phoneNumber);
};
