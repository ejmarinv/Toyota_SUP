import { expect } from "chai";
import { Given, Then, When } from "cucumber";
import { baselineMetricsTest } from "~data/dealer-config.data";
import { vehiclesMock } from "~data/vehicle.data";
import { BaselineMetrics } from "~models/metrics.model";
import { VehicleToRequest } from "~models/vehicle.model";
import { VehicleCosts } from "~pages/board_page";
import { generateVin } from "~utils/business-utils";
import { setDate } from "~utils/date-utils";
import { waitForElement } from "~utils/driver-utils";
import { State } from "~utils/state";
import { TimeOutOptions } from "~utils/times.constant";
import { boardPage, dealerConfigRequest, driver, vehicleRequest } from "~utils/utils";


let greenVehicle: VehicleToRequest;
let redVehicle: VehicleToRequest;

let createdBaselineMetrics: BaselineMetrics;
let currentBaselineMetrics: BaselineMetrics;

async function createDefaultBaselineMetrics() {
  if (currentBaselineMetrics && Object.keys(currentBaselineMetrics).length > 0) {
    const { id, sk, lsi2, ...currentBaselineMetricsToCreate } = currentBaselineMetrics;
    await dealerConfigRequest.createBaselineMetrics({ ...currentBaselineMetricsToCreate });
  }
}

async function deleteTestMetrics() {
  if (createdBaselineMetrics && Object.keys(createdBaselineMetrics).length > 0) {
    await dealerConfigRequest.deleteMetricsById(createdBaselineMetrics.id);
  }
}


Given('some vehicles have been added to the sup app', { timeout: TimeOutOptions.huge }, async () => {
  greenVehicle = {
    ...vehiclesMock[0],
    vin: generateVin()

  };
  const result = await vehicleRequest.createVehicleApi(greenVehicle);
  State.addCreatedVehicles(result.id);
});

When('a user set metrics values', { timeout: TimeOutOptions.huge }, async () => {
  currentBaselineMetrics = await dealerConfigRequest.getCurrentBaselineMetrics();
  createdBaselineMetrics = await dealerConfigRequest.createBaselineMetrics({ ...baselineMetricsTest });
  await driver.navigate().refresh();
  await driver.sleep(TimeOutOptions.big);
});

Then('the user is able to see cars that cost LESS than normal', { timeout: TimeOutOptions.huge }, async () => {
  const carInfoByVin = await boardPage.carInfoByVin(greenVehicle.vin);
  expect(carInfoByVin.vehicleCardClass, 'validate class card').to.contains(VehicleCosts.vehicleLessThanNormal);
  await deleteTestMetrics();
  await createDefaultBaselineMetrics();
});

Given('some vehicles have been added with old dates to the sup app', { timeout: TimeOutOptions.huge }, async () => {
  await waitForElement(boardPage.tabBoard);
  redVehicle = {
    ...vehiclesMock[0],
    vin: generateVin(),
    creationDate: setDate(-72).toISOString()
  };
  const result = await vehicleRequest.createVehicleApi(redVehicle);
  State.addCreatedVehicles(result.id);
});

When('new metrics have been set', { timeout: TimeOutOptions.huge }, async () => {
  currentBaselineMetrics = await dealerConfigRequest.getCurrentBaselineMetrics();
  createdBaselineMetrics = await dealerConfigRequest.createBaselineMetrics({ ...baselineMetricsTest, holdingCost: 30, usedInventoryTurnRate: 100 });
  await driver.navigate().refresh();
  await driver.sleep(TimeOutOptions.medium);
});

Then('the user is able to see cars that cost MORE than normal', { timeout: TimeOutOptions.huge }, async () => {
  const carInfoByVin = await boardPage.carInfoByVin(redVehicle.vin);
  expect(carInfoByVin.vehicleCardClass, 'validate class card').to.contains(VehicleCosts.vehicleMoreThanNormal);
  await deleteTestMetrics();
  await createDefaultBaselineMetrics();
});

When('there are no metrics set for a user', { timeout: TimeOutOptions.huge }, async () => {
  currentBaselineMetrics = await dealerConfigRequest.getCurrentBaselineMetrics();
  await dealerConfigRequest.deleteMetricsById(currentBaselineMetrics.id);
  await driver.sleep(TimeOutOptions.medium);
  await driver.navigate().refresh();
  await driver.sleep(TimeOutOptions.medium);
});

Then('the user is able to see cars in gray color flag', { timeout: TimeOutOptions.huge }, async () => {
  const carInfoByVin = await boardPage.carInfoByVin(greenVehicle.vin);
  expect(carInfoByVin.vehicleCardClass, 'validate class card').not.to.contains(VehicleCosts.vehicleLessThanNormal);
  expect(carInfoByVin.vehicleCardClass, 'validate class card').not.to.contains(VehicleCosts.vehicleMoreThanNormal);
  await createDefaultBaselineMetrics();
});

