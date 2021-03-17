import { expect } from "chai";
import { Then, When } from "cucumber";
import { baselineMetricsTest } from "~data/dealer-config.data";
import { vehiclesMock } from "~data/vehicle.data";
import { Vehicle, VehicleToRequest } from "~models/vehicle.model";
import { MetricsErrorMessages } from "~pages/baseline-metrics_page";
import { BoardPage } from "~pages/board_page";
import { CreateCarFormPage } from "~pages/create_car_form_page";
import { calculateIdealRate, generateVin } from "~utils/business-utils";
import { findElement, waitForElement } from "~utils/driver-utils";
import { State } from "~utils/state";
import { TimeOutOptions } from "~utils/times.constant";
import { baseLineMetricsPage, boardPage, driver, settingPage, toDaysHoursString, vehicleRequest } from "~utils/utils";


const vehiclesToTest: VehicleToRequest[] = [
  { ...vehiclesMock[0], vin: generateVin() },
  { ...vehiclesMock[0], vin: generateVin() },
  { ...vehiclesMock[0], vin: generateVin() },
  { ...vehiclesMock[0], vin: generateVin() },
  { ...vehiclesMock[0], vin: generateVin() }
];

// Scenario: As a Used Car Manager I'd like to set new baseline metrics
When('the user clicks on the settings button', { timeout: TimeOutOptions.medium }, async () => {

  waitForElement(boardPage.tabBoard);
  await settingPage.goToBaselineMetrics();
});

When('the user sets the Holding cost and the turn rate fields', { timeout: TimeOutOptions.huge }, async () => {
  const metricForm = await baseLineMetricsPage.getMetricsForm();

  await metricForm.holdingCostMetrics.click();
  await metricForm.holdingCostMetrics.clear();
  await metricForm.holdingCostMetrics.sendKeys(baselineMetricsTest.holdingCost);

  await metricForm.usedInventoryTurnRateInput.click();
  await metricForm.usedInventoryTurnRateInput.clear();
  await metricForm.usedInventoryTurnRateInput.sendKeys(baselineMetricsTest.usedInventoryTurnRate);

  await metricForm.bandwidthInput.click();
  await metricForm.bandwidthInput.clear();
  await metricForm.bandwidthInput.sendKeys(baselineMetricsTest.bandwidth);

  await metricForm.settingSaveButton.click();
});

When('the user see the metrics begin to calculate', { timeout: TimeOutOptions.medium }, async () => {

  const successToast = await CreateCarFormPage.getSuccessToast();
  expect(successToast).to.be.not.undefined;
});

Then('the user goes back to the board and gets the ideal rate information', { timeout: TimeOutOptions.medium }, async () => {
  const vehiclesCreated = await vehicleRequest.createVehiclesApiBatch(vehiclesToTest);

  State.addCreatedVehicles(vehiclesCreated);
  await driver.sleep(TimeOutOptions.xSmall);
  const allDealerVehicles: Vehicle[] = await vehicleRequest.getAllVehiclesByDealer();

  const metricForm = await baseLineMetricsPage.getMetricsForm();
  await metricForm.backButton.click();
  await waitForElement(boardPage.tabBoard);

  const idealRate: string = await BoardPage.getIdealRateText();
  const expectedIdealRateValue: number = await calculateIdealRate(baselineMetricsTest, allDealerVehicles.length);
  const expectedIdealRateText: string = toDaysHoursString(expectedIdealRateValue);

  expect(idealRate).to.be.equal(`Ideal Rate: ${expectedIdealRateText}`);
});

// Scenario: As a Used Car Manager I'd like to cancel the baseline metrics


When('new values are set and the cancel button is pressed', { timeout: TimeOutOptions.huge }, async () => {
  const metricForm = await baseLineMetricsPage.getMetricsForm();
  await metricForm.holdingCostMetrics.clear();
  await metricForm.holdingCostMetrics.sendKeys('100');
  await metricForm.usedInventoryTurnRateInput.clear();
  await metricForm.usedInventoryTurnRateInput.sendKeys('200');
  await metricForm.settingCancelButton.click();
  await waitForElement(boardPage.tabBoard);
});

Then('the Holding cost and the turn rate values keep old values', { timeout: TimeOutOptions.huge }, async () => {

  await settingPage.goToBaselineMetrics();

  const holdingCostMetrics = baseLineMetricsPage.holdingCostMetrics;
  await waitForElement(holdingCostMetrics);
  const oldHoldingCost = await (await findElement(holdingCostMetrics)).getAttribute('value');
  expect(oldHoldingCost, 'validate the holding cost keeps the same value').to.be.equals(`${baselineMetricsTest.holdingCost}`);

  const turnRateInput = baseLineMetricsPage.turnRateMetrics;
  await waitForElement(turnRateInput);
  const oldTurnRate = await (await findElement(turnRateInput)).getAttribute('value');
  expect(oldTurnRate, 'validate the Turn Rate keeps the same value').to.be.equals(`${baselineMetricsTest.usedInventoryTurnRate}`)
});

// Scenario: As a Used Car Manager I'd like to validate negatives values on metrics
When('negatives values are set and the save button is pressed', { timeout: TimeOutOptions.huge }, async () => {

  const metricForm = await baseLineMetricsPage.getMetricsForm();
  await metricForm.holdingCostMetrics.click();
  await metricForm.holdingCostMetrics.clear();
  await metricForm.holdingCostMetrics.sendKeys('-0.2983');
  await metricForm.usedInventoryTurnRateInput.click();
  await metricForm.usedInventoryTurnRateInput.clear();
  await metricForm.usedInventoryTurnRateInput.sendKeys('-0.27');
  await metricForm.settingSaveButton.click();
});

Then('new alert messages are shown and the save button is left as disabled', { timeout: TimeOutOptions.huge }, async () => {

  await driver.sleep(1000);
  expect(MetricsErrorMessages.holdingDecimals, 'Validate decimals error message').to.exist;
  expect(MetricsErrorMessages.holdingNegativesValue, 'Validate negatives values on holding cost field').to.exist;
  expect(MetricsErrorMessages.turnRateNegativeValue, 'Validate negatives values on turn rate field').to.exist;
  expect(MetricsErrorMessages.turnrateDecimals, 'Validate decimals error message').to.exist;
});

