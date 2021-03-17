export function dayPickerAriaLabel(date: Date): string {
  return `${WEEK[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export const WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function dateToString(date: Date | string): string {
  if (!date) { return undefined; }
  return (typeof date === 'string') ? date : date.toISOString().split('T')[0];
}

export function setDate(hours?: number, days?: number): Date {
  const currentDate = new Date();
  if (hours) {
    currentDate.setHours(currentDate.getHours() + hours);    
  } 
  if (days) {
    currentDate.setDate(currentDate.getDate() + days);
  }
  currentDate.setMilliseconds(0);
  currentDate.setSeconds(currentDate.getSeconds() - 2);
  return currentDate;
}

export function getDate(vehicleDate:string){

  const dateBuild = new Date(vehicleDate);
  const day = ("0" + dateBuild.getDate()).slice(-2);
  const month = ("0" + (dateBuild.getMonth()+1)).slice(-2);
  const year = dateBuild.getFullYear();
  
  return `${year}-${month}-${day}`;
}

export function hoursToDays(hours: number): number {
  return Math.ceil(hours / 24 * 100) / 100;
}
export function idealRateToDays(idealRate: string) {
  const idealRateSplit: string[][] = idealRate.split(' ').map(item => item.split('-'));
  let days = 0;
  let hours = 0;
  const firstValue = idealRateSplit[0][0];
  const firstType = idealRateSplit[0][1];
  if (firstType === 'd') {
    days = Number(firstValue);
    if (idealRateSplit.length > 1) {
      hours = Number(idealRateSplit[1][0] || 0);
    }
  } else {
    hours = Number(firstValue);
  }
  const hoursTodays = hoursToDays(hours);
  return days + hoursTodays;
}

export function durationToNow(isoDate: string){
  const date = new Date(isoDate);
  const currentDate = new Date();
  currentDate.setSeconds(currentDate.getSeconds());
  const milis = currentDate.getTime() - date.getTime();
  const days = milis/86400000;
  
  return Math.ceil(days*100)/100;
}

export function daysToHours(isoDate: string){
  let days=0;
  let firstDate;
  let secondDate;

  const creationDate = new Date(isoDate);
  const currentDate = new Date();

  firstDate = Math.abs(creationDate.getTime() / 1000);
  secondDate = Math.abs(currentDate.getTime() / 1000);

  const diffDates = Math.abs(firstDate - secondDate);
  days = Math.floor(diffDates / 86400);
  return days +' Days';
}