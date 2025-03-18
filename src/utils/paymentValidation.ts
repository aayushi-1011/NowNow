export const validateCardNumber = (cardNumber: string): boolean => {
  const sanitizedNumber = cardNumber.replace(/\s/g, '');
  
  // Check if it contains only numbers and has length of 16
  if (!/^\d{16}$/.test(sanitizedNumber)) {
    return false;
  }

  // Luhn Algorithm
  let sum = 0;
  let isEven = false;

  for (let i = sanitizedNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitizedNumber[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

export const validateExpiryDate = (expiry: string): boolean => {
  // Check format (MM/YY)
  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    return false;
  }

  const [month, year] = expiry.split('/').map(num => parseInt(num));
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  // Validate month (1-12)
  if (month < 1 || month > 12) {
    return false;
  }

  // Validate year and expiration
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }

  return true;
};

export const validateCVC = (cvc: string): boolean => {
  // CVC should be 3 or 4 digits
  return /^\d{3,4}$/.test(cvc);
};

export const formatCardNumber = (value: string): string => {
  const sanitized = value.replace(/\D/g, '');
  const groups = sanitized.match(/.{1,4}/g) || [];
  return groups.join(' ').substr(0, 19); // 16 digits + 3 spaces
};

export const formatExpiryDate = (value: string): string => {
  const sanitized = value.replace(/\D/g, '');
  if (sanitized.length >= 2) {
    return `${sanitized.substr(0, 2)}/${sanitized.substr(2, 2)}`;
  }
  return sanitized;
};