import { expect } from "chai";
import { Then, When } from "cucumber";
import { blackToyotaVehicleTest } from "~data/vehicle.data";
import { VehicleMenuOptions } from "~pages/board_page";
import { CreateCarFormPage } from "~pages/create_car_form_page";
import { waitForElement } from "~utils/driver-utils";
import { State } from "~utils/state";
import { TimeOutOptions } from "~utils/times.constant";
import { boardPage, driver, vehicleDetailsPage, vehicleRequest } from "~utils/utils";


let toyotaCar = blackToyotaVehicleTest;

When('there is a new vehicle on the Acquire column',{timeout: TimeOutOptions.huge}, async()=>{

  await waitForElement(boardPage.tabBoard);
  toyotaCar = await vehicleRequest.createVehicleApi({ ...blackToyotaVehicleTest});
  await driver.navigate().refresh();
  await driver.sleep(TimeOutOptions.medium);
});

When('the user selects the delete option on the vehicle menu',{timeout: TimeOutOptions.huge}, async()=>{

  await waitForElement(boardPage.tabBoard);
  const vehicleInfo = await boardPage.carInfoByVin(toyotaCar.vin,0);
  await vehicleInfo.menuButton.click();

  await boardPage.getVehicleMenuButton(toyotaCar.vin, 0,VehicleMenuOptions.deleteButton);
  const confirmDeletion = await boardPage.getDeletionModal();
  confirmDeletion.confirmButton.click();

});

Then('the vehicle VIN is deleted successfully',{timeout: TimeOutOptions.medium
}, async()=>{

  const confirmMessage = CreateCarFormPage.getSuccessToast();
  expect(confirmMessage, 'Validate confirmation message is displayed successfully').to.be.not.undefined;
});


When('the user decides to cancel the deletion process',{timeout: TimeOutOptions.huge}, async()=>{

  await waitForElement(boardPage.tabBoard);
  const vehicleInfo = await boardPage.carInfoByVin(toyotaCar.vin,0);
  await vehicleInfo.menuButton.click();

  await boardPage.getVehicleMenuButton(toyotaCar.vin, 0,VehicleMenuOptions.deleteButton);
  const confirmDeletion = await boardPage.getDeletionModal();
  confirmDeletion.cancelButton.click();
});

Then('the vehicle VIN is NOT deleted',{timeout: TimeOutOptions.medium}, async()=>{

  State.addCreatedVehiclesByVin(toyotaCar.vin);
  const confirmMessage = CreateCarFormPage.getSuccessToast();
  expect(confirmMessage, 'Validate the confirmation message is not displayed').to.be.empty;
  const vehicleInfo = await boardPage.carInfoByVin(toyotaCar.vin,0);
  expect(vehicleInfo.vin,'Validate the VIN is still there on the vehicles board').to.contain(toyotaCar.vin);
});

When('the user selects the vehicle card from the vehciles board',{timeout: TimeOutOptions.medium}, async()=>{

  await waitForElement(boardPage.tabBoard);
  await boardPage.getVehicleByCostSymbol(toyotaCar.vin,0); 
  await waitForElement(vehicleDetailsPage.vinDescription);

});

When('the user press the Delete button displayed on the Vin details view',{timeout: TimeOutOptions.medium}, async()=>{

  const deleteButton = await vehicleDetailsPage.getDeleteButton();
  await deleteButton.click();
  const confirmDeletion = await boardPage.getDeletionModal();
  confirmDeletion.confirmButton.click();
});