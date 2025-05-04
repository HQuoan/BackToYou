import { parsePhoneNumberFromString } from 'libphonenumber-js'

export function formatPhoneNumber(phone) {
  const phoneNumber = parsePhoneNumberFromString(phone, 'VN') 
  if (phoneNumber) {
    return phoneNumber.formatNational() // → "039 874 6214"
  }
  return phone // fallback nếu không parse được
}

export function formatDateVN(dateString ) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

