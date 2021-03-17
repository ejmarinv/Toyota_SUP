export interface BaselineMetrics {
  id?: string;
  sk?: string;
  lsi2?: string;
  holdingCost: number;
  usedInventoryTurnRate: number;
  bandwidth?: number;
}

export interface DealerMetrics {

  idealRate: string;

}