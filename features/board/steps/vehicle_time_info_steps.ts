import { expect } from "chai";
import { Given, Then, When } from "cucumber";
import { vehiclesMock } from "~data/vehicle.data";
import { Vehicle, VehicleToRequest } from "~models/vehicle.model";
import { BoardPage } from "~pages/board_page";
import { waitForElement } from "~utils/driver-utils";
import { TimeOutOptions } from "~utils/times.constant";
import { driver, vehicleRequest } from "~utils/utils";
import { boardDefault } from "~data/board.data";
import { generateVin } from "~utils/business-utils";
import { setDate } from "~utils/date-utils";
import { State } from "~utils/state";


const boardPage = new BoardPage();

async function getVehicleInfoFromCard(vehicles: Vehicle[]): Promise<any[]> {
  const vehicleInfoFromCard = [];
  for (const [index, vehicle] of vehicles.entries()) {
    const carInfo = await boardPage.carInfoByVin(vehicle.vin, index);
    vehicleInfoFromCard.push(carInfo);
  }
  return vehicleInfoFromCard;
}

const vehicleTime: Partial<VehicleToRequest>[] = [
  { creationDate: setDate(-5).toISOString(), lastTimeMoved: setDate(-5).toISOString() },
  { creationDate: setDate(undefined, -1).toISOString(), lastTimeMoved: setDate(-10).toISOString() },
  { creationDate: setDate(undefined, -5).toISOString(), lastTimeMoved:  setDate(undefined, -2).toISOString()},
  { creationDate: setDate(undefined, -15).toISOString(), lastTimeMoved:  setDate(undefined, -5).toISOString()},
  { creationDate: setDate(undefined, -35).toISOString(), lastTimeMoved:  setDate(undefined, -20).toISOString()},
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
  },
  {
    ...vehiclesMock[0],
    vin: generateVin(),
    creationDate: vehicleTime[4].creationDate
  }
];

let multipleVehiclesCreated: Vehicle[];
let singleVehicleCreated: Vehicle;

// Scenario: As a Used, I'd like to see how many hours/days and total hours/days per column into the step vehicle process

Given('some vehicles have been added to the sup app with an specific time and in diferent columns', { timeout: TimeOutOptions.huge }, async () => {

  multipleVehiclesCreated = await vehicleRequest.createVehiclesApiBatch(vehiclesToTest);

  const nextStepsAndIds: [idVehicle: string, step: string, lastTimeMoved: string][] = [
    [multipleVehiclesCreated[0].id, boardDefault.steps[0], vehicleTime[0].lastTimeMoved],
    [multipleVehiclesCreated[1].id, boardDefault.steps[1], vehicleTime[1].lastTimeMoved],
    [multipleVehiclesCreated[2].id, boardDefault.steps[2], vehicleTime[2].lastTimeMoved],
    [multipleVehiclesCreated[3].id, boardDefault.steps[3], vehicleTime[3].lastTimeMoved],
    [multipleVehiclesCreated[4].id, boardDefault.steps[4], vehicleTime[4].lastTimeMoved]
  ];

  State.addCreatedVehicles(multipleVehiclesCreated);
  
  await vehicleRequest.moveVehiclesApiBatch(nextStepsAndIds);
  await driver.sleep(TimeOutOptions.medium);
});

When('a user goes to the board', { timeout: TimeOutOptions.huge }, async function () {
  await driver.navigate().refresh();
  await waitForElement(boardPage.tabBoard);
  await driver.sleep(TimeOutOptions.medium);
});

Then('the user validates how long a car has been in the whole process', { timeout: TimeOutOptions.huge }, async () => {
  const vehicleInfoFromCard = await getVehicleInfoFromCard(multipleVehiclesCreated);

  expect(vehicleInfoFromCard[0].timeInWholeProcess).equal('5 Total hours');
  expect(vehicleInfoFromCard[1].timeInWholeProcess).equal('1 Total day');
  expect(vehicleInfoFromCard[2].timeInWholeProcess).equal('5 Total days');
  expect(vehicleInfoFromCard[3].timeInWholeProcess).equal('15 Total days');
  expect(vehicleInfoFromCard[4].timeInWholeProcess).equal('35 Total days');
});

Then('the user validates how long a car has been in a specific step', { timeout: TimeOutOptions.huge }, async () => {
  const vehicleInfoFromCard = await getVehicleInfoFromCard(multipleVehiclesCreated);

  expect(vehicleInfoFromCard[0].timeInStep).to.equal('5 Hours in step');
  expect(vehicleInfoFromCard[1].timeInStep).to.equal('10 Hours in step');
  expect(vehicleInfoFromCard[2].timeInStep).to.equal('2 Days in step');
  expect(vehicleInfoFromCard[3].timeInStep).to.equal('5 Days in step');
  expect(vehicleInfoFromCard[4].timeInStep).to.equal('20 Days in step');
});


// Scenario: As a Used, I'd like to see how many time the vehicle keeps and change after drag and drop
Given('a vehicle has been added to the sup app with an specific time', { timeout: TimeOutOptions.huge }, async () => {
  const vehicle: VehicleToRequest = { 
    ...vehiclesMock[0],
    creationDate: setDate(-5).toISOString()
  };
  singleVehicleCreated = await vehicleRequest.createVehicleApi(vehicle);
  State.addCreatedVehicles(singleVehicleCreated.id);  
});

Given('a vehicle is moved to the next column', { timeout: TimeOutOptions.huge }, async () => {
  const targetStep = boardDefault.steps[1];
  await boardPage.dragAndDropCards(singleVehicleCreated.vin, 0, targetStep);
});

Then('the user validates the vehicle keeps the total time', { timeout: TimeOutOptions.medium }, async () => {
  const carInfo = await boardPage.carInfoByVin(singleVehicleCreated.vin, 1);
  expect(carInfo.timeInWholeProcess).equal('5 Total hours');
});

Then('the user validates the time in step is zero', { timeout: TimeOutOptions.medium }, async () => {
  const carInfo = await boardPage.carInfoByVin(singleVehicleCreated.vin, 1);
  expect(carInfo.timeInStep).equal('0 Hours in step');
});