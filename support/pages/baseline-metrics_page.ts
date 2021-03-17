import { waitForElement } from "~utils/driver-utils";

export class BaselineMetricsPage {

  public readonly bandwidthInput = { id: 'bandwidthInput' };
  public readonly holdingCostMetrics = { css: '#holdingCostInput' };
  public readonly turnRateMetrics = { css: '#usedInventoryTurnRateInput' };
  public readonly settingSaveButton = { id: 'saveConfigurationButton' };
  public readonly settingCancelButton = { id: 'cancelConfigurationButton' };
  public readonly metricsAlertMessage = { css: '.mat-error' };
  public readonly backButton = { id: 'backButton' };
  public readonly configMetricsButton = { id: 'configMetrics' };


  async getMetricsForm(){
    return{
      holdingCostMetrics : await waitForElement(this.holdingCostMetrics),
      usedInventoryTurnRateInput : await waitForElement(this.turnRateMetrics),
      bandwidthInput : await waitForElement(this.bandwidthInput),
      settingSaveButton: await waitForElement(this.settingSaveButton),
      settingCancelButton: await waitForElement(this.settingCancelButton),
      backButton: await waitForElement(this.backButton),
     }

  }
}

export enum MetricsErrorMessages {
  holdingNegativesValue = ' Holding cost value must be positive ',
  holdingDecimals = ' Holding cost value allows 2 decimals max ',
  turnRateNegativeValue = ' Used Inventory Turn Rate value must be positive ',
  turnrateDecimals = ' Used Inventory Turn Rate value allows 1 decimal max '
}