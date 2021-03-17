import { Environment } from "~environments/environments";
import { BaselineMetrics, DealerMetrics } from "~models/metrics.model";
import { makeHttpDelete, makeHttpGet, makeHttpPost } from "./api-base.request";
export class DealerConfigRequest {

  public readonly baselineMetricsPath = 'dealer/config';
  public readonly dealerMetricsPath = 'dealer/metrics';


  constructor(private env: Environment) {
  }


  prepareMetrics(metrics: BaselineMetrics): any {
    return {
      ...metrics
    }
  }

  async getCurrentBaselineMetrics(): Promise<BaselineMetrics> {
    return makeHttpGet(this.env, this.baselineMetricsPath);
  }

  async createBaselineMetrics(metrics: BaselineMetrics): Promise<BaselineMetrics> {
    const metricsBody = this.prepareMetrics(metrics);
    return makeHttpPost(this.env, this.baselineMetricsPath, metricsBody);
  }

  async deleteMetricsById(id: string): Promise<any> {
    return makeHttpDelete(this.env, this.baselineMetricsPath, id);
  }

  async deleteMetricsByIdBatch(ids: string[]): Promise<any> {
    for (const id of ids) {
      await this.deleteMetricsById(id); 
    }
  }

  async getIdealRate():Promise<DealerMetrics>{
    return makeHttpGet(this.env, this.dealerMetricsPath);

  }

}
