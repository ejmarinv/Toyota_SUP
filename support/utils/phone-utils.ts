import { Phone } from "~models/technician.model";

export function splitPhoneCodeAndPhoneNumber(phoneNumber: string): Phone {
  const phone: string[] = phoneNumber.split('-');
  return { code: phone[0], number: phone[1] };
}
export function joinPhoneCodeAndPhoneNumber(code: string, phoneNumber: string): string {
  return `${code}-${phoneNumber}`;
}