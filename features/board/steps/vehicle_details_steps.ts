import { expect } from "chai";
import { Then, When } from "cucumber";
import { boardDefault } from "~data/board.data";
import { baselineMetricsTest } from "~data/dealer-config.data";
import { blackToyotaVehicleTest, vehiclesMock } from "~data/vehicle.data";
import { BaselineMetrics } from "~models/metrics.model";
import { Vehicle, VehicleToRequest } from "~models/vehicle.model";
import { generateVin } from "~utils/business-utils";
import { getDate, setDate, idealRateToDays, durationToNow, daysToHours } from "~utils/date-utils";
import { scrollToElement, waitForElement } from "~utils/driver-utils";
import { State } from "~utils/state";
import { TimeOutOptions } from "~utils/times.constant";
import { boardPage, dealerConfigRequest, driver, vehicleDetailsPage, vehicleRequest } from "~utils/utils";



const vehicleTime: Partial<VehicleToRequest>[] = [
  { creationDate: setDate(undefined, -5).toISOString()},
  { lastTimeMoved:  setDate(-5).toISOString()},
  { lastTimeMoved:  setDate(-10).toISOString()},
  { lastTimeMoved:  setDate(-60).toISOString()},
  { lastTimeMoved:  setDate(-90).toISOString()},
];

const vehiclesToTest: VehicleToRequest[] = [
  {
    ...vehiclesMock[0],
    vin: generateVin(),
    creationDate: vehicleTime[0].creationDate
  },
  {
    ...vehiclesMock[0],
    vin: generateVin(),
    creationDate: vehicleTime[1].creationDate
  },
  {
    ...vehiclesMock[0],
    vin: generateVin(),
    creationDate: vehicleTime[2].creationDate
  },
  {
    ...vehiclesMock[0],
    vin: generateVin(),
    creationDate: vehicleTime[3].creationDate
  }
];

let createdBaselineMetrics: BaselineMetrics;
let toyotaCar = blackToyotaVehicleTest;
let vehicleStepsRecordForm;
let currentBaselineMetrics:BaselineMetrics;
let multipleVehiclesCreated: Vehicle[];
let nextStepsAndIds: [idVehicle: string, step: string, lastTimeMoved: string][];


When('a new vehicle has been created', {timeout: TimeOutOptions.huge}, async()=>{
  
  await waitForElement(boardPage.tabBoard);
  toyotaCar = await vehicleRequest.createVehicleApi({ ...blackToyotaVehicleTest});
  State.addCreatedVehiclesByVin(toyotaCar.vin);
  
  await driver.navigate().refresh();
  await driver.sleep(TimeOutOptions.medium);
});

When('the user has selected the vehicle card',{timeout: TimeOutOptions.medium}, async()=>{
  
  await waitForElement(boardPage.tabBoard);
  await boardPage.getVehicleByCostSymbol(toyotaCar.vin,0);
});

Then('a new view with the vin details is displayed',{timeout: TimeOutOptions.huge}, async()=>{

  const vehicleVin = await (await waitForElement(vehicleDetailsPage.vinDescription)).getText();
  expect(vehicleVin).to.contain(toyotaCar.vin);

  await scrollToElement(vehicleDetailsPage.recordTitle);

  const descriptionForm = await vehicleDetailsPage.getDescriptionForm();
  expect(descriptionForm.milageDescription.replace(/,/,'')).to.contain(toyotaCar.mileage);
  expect(descriptionForm.brandDescription).to.contain(toyotaCar.brand);
  expect(descriptionForm.modelYearDescription).to.contain(toyotaCar.modelYear);
  expect(descriptionForm.modelDescription).to.contain(toyotaCar.modelDescription);
  
  expect(descriptionForm.extColorVehicle.toLowerCase()).to.contain(toyotaCar.extColor);
  expect(descriptionForm.retailPriceDescription.replace(/,/,'')).to.contain(toyotaCar.retailPrice);
  expect(descriptionForm.acvDescription.replace(/,/,'')).to.contain(toyotaCar.acv);

  const vehicleDate = getDate(descriptionForm.acqDateDescription);
  expect(vehicleDate).to.contain(toyotaCar.acquisitionDate);
  expect(descriptionForm.acqMethodDescription.toLowerCase()).to.contain(toyotaCar.acquisitionMethod);

});

//second scenario
When('new vehicles with old dates time have been created',{timeout:TimeOutOptions.huge}, async()=>{

  createdBaselineMetrics = await dealerConfigRequest.createBaselineMetrics({ ...baselineMetricsTest });
  State.addSelectedMetricsById(createdBaselineMetrics.id);

  await waitForElement(boardPage.tabBoard);
  multipleVehiclesCreated = await vehicleRequest.createVehiclesApiBatch(vehiclesToTest);
  State.addCreatedVehicles(multipleVehiclesCreated);

});

When('it exists in the Acquired column it must contain steps record info',{timeout:TimeOutOptions.huge}, async()=>{
  //move to Acquired
  await driver.navigate().refresh();
  await driver.sleep(TimeOutOptions.medium); 
  await boardPage.getVehicleByCostSymbol(vehiclesToTest[0].vin,0);
  await waitForElement(vehicleDetailsPage.vinDescription);

  //Input data to calculate profit and total time on graph
  const dealerMetrics = await dealerConfigRequest.getIdealRate();
  const currentIdealRate = idealRateToDays(dealerMetrics.idealRate);

  vehicleStepsRecordForm = await vehicleDetailsPage.getStepsRecordsInfo();
  const isoDaysToHours = daysToHours(vehicleTime[0].creationDate);
  const hoursCreated = durationToNow(vehicleTime[0].creationDate);

  currentBaselineMetrics = await dealerConfigRequest.getCurrentBaselineMetrics();
  const profitCalculated = vehicleDetailsPage.calculateProfitAndTotalTimeGraph(currentIdealRate, currentBaselineMetrics.holdingCost, hoursCreated);

  await waitForElement(vehicleDetailsPage.profitHoldingCostGraph,null,TimeOutOptions.medium);
  await scrollToElement(vehicleDetailsPage.profitHoldingCostGraph);

  //validate Profit and Time spend on the Acquired step
  const graphinfoCatched = await vehicleDetailsPage.getProfitAndTotalTimeGraph();
  const profitValue = Number(graphinfoCatched.profitHoldingCostGraph.replace('$', '').replace(',', ''));
  expect(profitValue, 'validate graphinfoCatched').within(profitCalculated-1,profitCalculated+1);
  expect(graphinfoCatched.totalTimeHoldingCostGraph, 'validate graphinfoCatched').to.contain(isoDaysToHours);

  await scrollToElement(vehicleDetailsPage.recordTitle);
  vehicleStepsRecordForm = await vehicleDetailsPage.getStepsRecordsInfo();
  expect(vehicleStepsRecordForm.vehiclesRecordTitles).to.contain('Moved to Acquired');
  expect(vehicleStepsRecordForm.updatedByRecord).to.contain('Updated by ANTONIO CANTOR');
   await vehicleDetailsPage.getBackToBoard();
});

Then('it must contain steps record in the Inspection column', {timeout:TimeOutOptions.huge}, async()=>{
  
  nextStepsAndIds = [
    [multipleVehiclesCreated[0].id, boardDefault.steps[1], vehicleTime[1].lastTimeMoved]
  ];

  await vehicleRequest.moveVehiclesApiBatch(nextStepsAndIds);
  await driver.navigate().refresh();
  await waitForElement(boardPage.tabBoard);  

  //validate time spent on Inspection
  await driver.sleep(TimeOutOptions.xSmall);
  await boardPage.getVehicleByCostSymbol(vehiclesToTest[0].vin,1);
  await waitForElement(vehicleDetailsPage.vinDescription);
  await scrollToElement(vehicleDetailsPage.recordTitle);

  //Input data to calculate profit and total time on graph
  const dealerMetrics = await dealerConfigRequest.getIdealRate();
  const currentIdealRate = idealRateToDays(dealerMetrics.idealRate);

  vehicleStepsRecordForm = await vehicleDetailsPage.getStepsRecordsInfo();
  const isoDaysToHours = daysToHours(vehicleTime[0].creationDate);
  const hoursCreated = durationToNow(vehicleTime[0].creationDate);

  currentBaselineMetrics = await dealerConfigRequest.getCurrentBaselineMetrics();
  const profitCalculated = vehicleDetailsPage.calculateProfitAndTotalTimeGraph(currentIdealRate, currentBaselineMetrics.holdingCost, hoursCreated);

  await waitForElement(vehicleDetailsPage.profitHoldingCostGraph,null,TimeOutOptions.medium);
  await scrollToElement(vehicleDetailsPage.profitHoldingCostGraph);

  //validate Profit and Time spend on the Acquired step
  const graphinfoCatched = await vehicleDetailsPage.getProfitAndTotalTimeGraph();
  const profitValue = Number(parseInt(graphinfoCatched.profitHoldingCostGraph.replace('$', '')));
  expect(profitValue, 'validate graphinfoCatched').within(profitCalculated-2,profitCalculated+2);
  expect(graphinfoCatched.totalTimeHoldingCostGraph, 'validate graphinfoCatched').contain(isoDaysToHours);
    
  vehicleStepsRecordForm = await vehicleDetailsPage.getStepsRecordsInfo();
  expect(vehicleStepsRecordForm.vehiclesRecordTitles).to.contain('Moved to Inspection');
  expect(vehicleStepsRecordForm.vehiclesRecordTitles).to.contain('Moved to Acquired');
  await vehicleDetailsPage.getBackToBoard();
});


Then('it must contain steps record in the Recondition column', {timeout:TimeOutOptions.huge}, async()=>{
  
  nextStepsAndIds = [
    [multipleVehiclesCreated[0].id, boardDefault.steps[2], vehicleTime[2].lastTimeMoved]
  ];

  await vehicleRequest.moveVehiclesApiBatch(nextStepsAndIds);
  await driver.navigate().refresh();
  await waitForElement(boardPage.tabBoard);

  //select the vehicle 
  await driver.sleep(TimeOutOptions.xSmall);
  await boardPage.getVehicleByCostSymbol(vehiclesToTest[0].vin,2);
  await waitForElement(vehicleDetailsPage.vinDescription);
  await scrollToElement(vehicleDetailsPage.recordTitle);

  //Input data to calculate profit and total time on graph
  const dealerMetrics = await dealerConfigRequest.getIdealRate();
  const currentIdealRate = idealRateToDays(dealerMetrics.idealRate);

  vehicleStepsRecordForm = await vehicleDetailsPage.getStepsRecordsInfo();
  const isoDaysToHours = daysToHours(vehicleTime[0].creationDate);
  const hoursCreated = durationToNow(vehicleTime[0].creationDate);

  currentBaselineMetrics = await dealerConfigRequest.getCurrentBaselineMetrics();
  const profitCalculated = vehicleDetailsPage.calculateProfitAndTotalTimeGraph(currentIdealRate, currentBaselineMetrics.holdingCost, hoursCreated);

  await waitForElement(vehicleDetailsPage.profitHoldingCostGraph,null,TimeOutOptions.medium);
  await scrollToElement(vehicleDetailsPage.profitHoldingCostGraph);

  //validate Profit and Time spend on the Acquired step
  const graphinfoCatched = await vehicleDetailsPage.getProfitAndTotalTimeGraph();
  const profitValue = Number(parseInt(graphinfoCatched.profitHoldingCostGraph.replace('$', '')));
  expect(profitValue, 'validate graphinfoCatched').within(profitCalculated-3,profitCalculated+3);
  expect(graphinfoCatched.totalTimeHoldingCostGraph, 'validate graphinfoCatched').to.contain(isoDaysToHours);
 
  vehicleStepsRecordForm = await vehicleDetailsPage.getStepsRecordsInfo();
  expect(vehicleStepsRecordForm.vehiclesRecordTitles).to.contain('Moved to Recondition');
  expect(vehicleStepsRecordForm.vehiclesRecordTitles).to.contain('Moved to Inspection');
  expect(vehicleStepsRecordForm.vehiclesRecordTitles).to.contain('Moved to Acquired');
  await vehicleDetailsPage.getBackToBoard();
});

Then('it must contain steps record in the Detail column', {timeout:TimeOutOptions.huge}, async()=>{
  await waitForElement(boardPage.tabBoard);
  nextStepsAndIds = [
    [multipleVehiclesCreated[0].id, boardDefault.steps[3], vehicleTime[3].lastTimeMoved]
  ];

  await vehicleRequest.moveVehiclesApiBatch(nextStepsAndIds);
  await driver.navigate().refresh();
  await waitForElement(boardPage.tabBoard);
  
  //select the vehicle 
  await driver.sleep(TimeOutOptions.xSmall);
  await boardPage.getVehicleByCostSymbol(vehiclesToTest[0].vin,3);
  await waitForElement(vehicleDetailsPage.vinDescription);
  await scrollToElement(vehicleDetailsPage.recordTitle);

  //Input data to calculate profit and total time on graph
  const dealerMetrics = await dealerConfigRequest.getIdealRate();
  const currentIdealRate = idealRateToDays(dealerMetrics.idealRate);

  vehicleStepsRecordForm = await vehicleDetailsPage.getStepsRecordsInfo();
  const isoDaysToHours = daysToHours(vehicleTime[0].creationDate);
  const hoursCreated = durationToNow(vehicleTime[0].creationDate);

  currentBaselineMetrics = await dealerConfigRequest.getCurrentBaselineMetrics();
  const profitCalculated = vehicleDetailsPage.calculateProfitAndTotalTimeGraph(currentIdealRate, currentBaselineMetrics.holdingCost, hoursCreated);

  await waitForElement(vehicleDetailsPage.profitHoldingCostGraph,null,TimeOutOptions.medium);
  await scrollToElement(vehicleDetailsPage.profitHoldingCostGraph);

  //validate Profit and Time spend on the Acquired step
  const graphinfoCatched = await vehicleDetailsPage.getProfitAndTotalTimeGraph();
  const profitValue = Number(parseInt(graphinfoCatched.profitHoldingCostGraph.replace('$', '')));
  expect(profitValue, 'validate graphinfoCatched').within(profitCalculated-3,profitCalculated+3);
  expect(graphinfoCatched.totalTimeHoldingCostGraph, 'validate graphinfoCatched').to.contain(isoDaysToHours);

  vehicleStepsRecordForm = await vehicleDetailsPage.getStepsRecordsInfo();
  expect(vehicleStepsRecordForm.vehiclesRecordTitles).to.contain('Moved to Detail');
  expect(vehicleStepsRecordForm.vehiclesRecordTitles).to.contain('Moved to Recondition');
  expect(vehicleStepsRecordForm.vehiclesRecordTitles).to.contain('Moved to Inspection');
  expect(vehicleStepsRecordForm.vehiclesRecordTitles).to.contain('Moved to Acquired');
  await vehicleDetailsPage.getBackToBoard();
});

Then('it finally must contain steps record in the Done column', {timeout:TimeOutOptions.huge}, async()=>{

  nextStepsAndIds = [
    [multipleVehiclesCreated[0].id, boardDefault.steps[4], vehicleTime[4].lastTimeMoved]
  ];
  await vehicleRequest.moveVehiclesApiBatch(nextStepsAndIds);
  await driver.navigate().refresh();
  await waitForElement(boardPage.tabBoard);

  //select the vehicle 
  await driver.sleep(TimeOutOptions.xSmall);
  await boardPage.getVehicleByCostSymbol(vehiclesToTest[0].vin,4);
  await waitForElement(vehicleDetailsPage.vinDescription);
  await scrollToElement(vehicleDetailsPage.recordTitle);

  //Input data to calculate profit and total time on graph
  const dealerMetrics = await dealerConfigRequest.getIdealRate();
  const currentIdealRate = idealRateToDays(dealerMetrics.idealRate);

  vehicleStepsRecordForm = await vehicleDetailsPage.getStepsRecordsInfo();
  const isoDaysToHours = daysToHours(vehicleTime[0].creationDate);
  const hoursCreated = durationToNow(vehicleTime[0].creationDate);

  currentBaselineMetrics = await dealerConfigRequest.getCurrentBaselineMetrics();
  const profitCalculated = vehicleDetailsPage.calculateProfitAndTotalTimeGraph(currentIdealRate, currentBaselineMetrics.holdingCost, hoursCreated);

  await waitForElement(vehicleDetailsPage.profitHoldingCostGraph,null,TimeOutOptions.medium);
  await scrollToElement(vehicleDetailsPage.profitHoldingCostGraph);

  //validate Profit and Time spend on the Acquired step
  const graphinfoCatched = await vehicleDetailsPage.getProfitAndTotalTimeGraph();
  const profitValue = Number(parseInt(graphinfoCatched.profitHoldingCostGraph.replace('$', '')));
  expect(profitValue, 'validate graphinfoCatched').within(profitCalculated-3,profitCalculated+3);
  expect(graphinfoCatched.totalTimeHoldingCostGraph, 'validate graphinfoCatched').to.contain(isoDaysToHours);
 
  vehicleStepsRecordForm = await vehicleDetailsPage.getStepsRecordsInfo();
  expect(vehicleStepsRecordForm.vehiclesRecordTitles).to.contain('Moved to Done');
  expect(vehicleStepsRecordForm.vehiclesRecordTitles).to.contain('Moved to Detail');
  expect(vehicleStepsRecordForm.vehiclesRecordTitles).to.contain('Moved to Recondition');
  expect(vehicleStepsRecordForm.vehiclesRecordTitles).to.contain('Moved to Inspection');
  expect(vehicleStepsRecordForm.vehiclesRecordTitles).to.contain('Moved to Acquired');
  await vehicleDetailsPage.getBackToBoard();
});