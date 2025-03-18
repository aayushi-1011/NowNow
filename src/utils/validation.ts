// Phone number validation for Indian numbers
export const validatePhoneNumber = (phone: string): boolean => {
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Indian phone numbers:
  // - Must be 10 digits
  // - Must start with 6, 7, 8, or 9
  const phoneRegex = /^[6-9]\d{9}$/;
  
  return phoneRegex.test(cleanPhone);
};

// Format phone number as user types (XXX-XXX-XXXX)
export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  
  return cleaned;
};