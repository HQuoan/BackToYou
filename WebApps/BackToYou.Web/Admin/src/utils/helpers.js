import { formatDistance, parseISO } from "date-fns";
import { differenceInDays } from "date-fns/esm";
import parsePhoneNumberFromString from "libphonenumber-js/min";

export function formatDateVN(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatPhoneNumber(phone) {
  const phoneNumber = parsePhoneNumberFromString(phone, "VN");
  if (phoneNumber) {
    return phoneNumber.formatNational(); // → "039 874 6214"
  }
  return phone; // fallback nếu không parse được
}

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace("about ", "")
    .replace("in", "In");

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
export const getToday = function (options = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

export function getVietnamTime() {
  const now = new Date();
  const utcNow = now.getTime();
  const vietnamOffset = 7 * 60 * 60 * 1000; // 7 giờ (milliseconds)
  return new Date(utcNow + vietnamOffset);
}


export const formatCurrency = (value) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(
    value
  );

export const formatUsdCurrency = (value) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(value);

export const formatVndCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

// Định dạng VND đơn giản, chỉ số (không có ký hiệu đ)
export const formatVndNumber = (value) =>
  new Intl.NumberFormat("vi-VN").format(value);
