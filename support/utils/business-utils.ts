import { BaselineMetrics } from "~models/metrics.model";
import { State } from "./state";

export function generateVin() {
  return '' + Math.floor(10000000000000000 + Math.random() * 90000000000000000);
}


const phoneList: string[] = [
  '3017790935',
  '3507498387',
  '3105805892',
  '3124934692',
  '3133406196',
  '3015987576',
  '3008658799',
  '3192364175',
  '3058120155'
];

export function generatePhone(withCode: boolean = true) {
  let code = '';

  if (withCode) {
    code = '1-';
  }

  const phones = phoneList.filter(phone => State.selectedPhones.findIndex(selectedPhone=> selectedPhone === phone) === -1);
  const phoneIndex = Math.floor(Math.random() * (phones.length));
  const selected = phoneList[phoneIndex];
  State.addSelectedPhone(selected);
  
  return `${code}${selected}`;
}

export async function calculateIdealRate(baselineMetrics: BaselineMetrics, totalVehicles: number): Promise<number> {
  const idealRateValue: number = (30 * baselineMetrics.bandwidth) / (baselineMetrics.usedInventoryTurnRate * totalVehicles);
  return idealRateValue;
}
