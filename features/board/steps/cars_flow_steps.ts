import { expect } from "chai";
import { Given, When, Then  } from "cucumber";
import { BoardPage } from "~pages/board_page";
import { waitForElement } from "~utils/driver-utils";
import { driver, vehicleRequest } from "~utils/utils";
import {blackToyotaVehicleTest} from "~data/vehicle.data";
import { TimeOutOptions } from "~utils/times.constant";
import { generateVin } from "~utils/business-utils";
import { boardDefault } from "~data/board.data";
import { State } from "~utils/state";

const boardPage = new BoardPage();
const toyotaVin = generateVin();

Given('a Toyota vehicle has been added to the sup app',{timeout: TimeOutOptions.huge}, async () => { 
  
  await waitForElement(boardPage.tabBoard);
  const result = await vehicleRequest.createVehicleApi({ ...blackToyotaVehicleTest, vin: toyotaVin });
  State.addCreatedVehicles(result.id);
  
  await driver.navigate().refresh();
  await driver.sleep(TimeOutOptions.medium);
});

When('a user move forward the Toyota car through each column',{timeout: TimeOutOptions.huge}, async ()=>{
  
  const lastIndex=boardDefault.steps.length-1;
  for(let i=1;i<lastIndex;i++){
    
    const step = boardDefault.steps[i];
    await boardPage.dragAndDropCards(toyotaVin,i-1,step);
    const card = await boardPage.carInfoByVin(toyotaVin,i);
    await driver.sleep(TimeOutOptions.small);
    expect(card, 'id must contain a value').to.be.not.undefined;  
  }
});

Then('finally the Toyota car must exist in the last column',{timeout: TimeOutOptions.huge}, async () => {
    const lastIndex= boardDefault.steps.length-1;
    const step = boardDefault.steps[lastIndex];
    await boardPage.dragAndDropCards(toyotaVin,lastIndex-1,step);
    await driver.navigate().refresh();
    await driver.sleep(TimeOutOptions.medium);
    const card = await boardPage.carInfoByVin(toyotaVin,lastIndex);
    expect(card, 'id must contain a value').to.be.not.undefined;  
});


