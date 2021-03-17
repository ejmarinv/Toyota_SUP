import { expect } from "chai";
import { Then, When } from "cucumber";
import { blackToyotaVehicleTest, blueLexusVehicleTest, greyTeslaVehicleTest } from "~data/vehicle.data";
import { VehicleErrorMessages, VehicleMenuOptions } from "~pages/board_page";
import { CreateCarFormPage } from "~pages/create_car_form_page";
import { waitForElement } from "~utils/driver-utils";
import { State } from "~utils/state";
import { TimeOutOptions } from "~utils/times.constant";
import { boardPage, driver, vehicleDetailsPage, vehicleRequest, setValueByKeys } from "~utils/utils";


let toyotaCar = blackToyotaVehicleTest;
let lexusCar = blueLexusVehicleTest;
let teslaCar = greyTeslaVehicleTest;

When('a new Toyota vehicle exists on the Acquired column',{timeout: TimeOutOptions.huge}, async()=>{

  await waitForElement(boardPage.tabBoard);
  toyotaCar = await vehicleRequest.createVehicleApi({ ...blackToyotaVehicleTest});
  State.addCreatedVehiclesByVin(toyotaCar.vin);
  await driver.navigate().refresh();
  await driver.sleep(TimeOutOptions.medium);
});

When('the user selects the Edit option from the vehicle menu',{timeout: TimeOutOptions.medium}, async()=>{

  await waitForElement(boardPage.tabBoard);
  const vehicleInfo = await boardPage.carInfoByVin(toyotaCar.vin,0);
  await vehicleInfo.menuButton.click();
  await boardPage.getVehicleMenuButton(toyotaCar.vin, 0,VehicleMenuOptions.editButton);
});

Then('a new screen allows the user to edit the VIN data on mandatory fields',{timeout: TimeOutOptions.big}, async()=>{

  const editionVin = await CreateCarFormPage.getCarForm(false);
  await CreateCarFormPage.setVehicleData(editionVin.mileageInput,lexusCar.mileage);
  await CreateCarFormPage.setVehicleData(editionVin.brandInput,lexusCar.brand);
  await CreateCarFormPage.setVehicleData(editionVin.modelYearInput,lexusCar.modelYear);
  await CreateCarFormPage.setVehicleData(editionVin.modelDescriptionInput,lexusCar.modelDescription);
  await CreateCarFormPage.setVehicleData(editionVin.extColorInput,lexusCar.extColor);
  await CreateCarFormPage.setVehicleData(editionVin.intColorInput,lexusCar.intColor);
  await CreateCarFormPage.setVehicleData(editionVin.retailPriceInput,lexusCar.retailPrice);
  await CreateCarFormPage.setVehicleData(editionVin.acvInput,lexusCar.acv);
  await setValueByKeys(editionVin.acquisitionDateInput,lexusCar.acquisitionDate);
  
  await editionVin.acquisitionMethodInput.sendKeys(lexusCar.acquisitionMethod);
  await editionVin.transmissionTypeInput.sendKeys(lexusCar.transmissionType);
  await editionVin.interiorTrimInput.sendKeys(lexusCar.interiorTrim);
  
  const getSaveVehicleInputButton = await CreateCarFormPage.getSaveVehicleInputButton();
  await driver.sleep(500);
  await getSaveVehicleInputButton.click();

  const confirmMessage = CreateCarFormPage.getSuccessToast();
  expect(confirmMessage, 'Validate confirmation message is displayed successfully').to.be.not.undefined;
  
});

Then('the user validates the data changed from the vehicles board',{timeout: TimeOutOptions.medium}, async()=>{

  await vehicleDetailsPage.getBackToBoard();
  await waitForElement(boardPage.tabBoard);
  await driver.sleep(TimeOutOptions.small);
  const vehicleInfo = await boardPage.carInfoByVin(toyotaCar.vin,0);
  expect(vehicleInfo.brand, 'Validate the vehicle brand has changed to lexus').to.contain(lexusCar.brand);
  expect(vehicleInfo.modelYear, 'Validate the vehicle year has changed').to.contain(lexusCar.modelYear);
  expect(vehicleInfo.description, 'Validate the vehicle description has changed').to.contain(lexusCar.modelDescription);
  
});

//second scenario
Then('the user Cancel the edition process',{timeout: TimeOutOptions.big}, async()=>{

  const editionVin = await CreateCarFormPage.getCarForm(false);
  await CreateCarFormPage.setVehicleData(editionVin.mileageInput,lexusCar.mileage);
  await CreateCarFormPage.setVehicleData(editionVin.brandInput,lexusCar.brand);
  await CreateCarFormPage.setVehicleData(editionVin.modelYearInput,lexusCar.modelYear);
  await CreateCarFormPage.setVehicleData(editionVin.modelDescriptionInput,lexusCar.modelDescription);
  await CreateCarFormPage.setVehicleData(editionVin.extColorInput,lexusCar.extColor);
  await CreateCarFormPage.setVehicleData(editionVin.intColorInput,lexusCar.intColor);
  await CreateCarFormPage.setVehicleData(editionVin.retailPriceInput,lexusCar.retailPrice);
  await CreateCarFormPage.setVehicleData(editionVin.acvInput,lexusCar.acv);
  await CreateCarFormPage.setVehicleData(editionVin.acquisitionDateInput,lexusCar.acquisitionDate);
  await setValueByKeys(editionVin.acquisitionDateInput,lexusCar.acquisitionDate);
  await editionVin.acquisitionMethodInput.sendKeys(lexusCar.acquisitionMethod);
  await editionVin.transmissionTypeInput.sendKeys(lexusCar.transmissionType);
  await editionVin.interiorTrimInput.sendKeys(lexusCar.interiorTrim);
  
  const getSaveVehicleInputButton = await CreateCarFormPage.getCancelVehicleInputButton();
  await driver.sleep(500);
  await getSaveVehicleInputButton.click();

  const confirmMessage = CreateCarFormPage.getSuccessToast();
  expect(confirmMessage, 'Validate there is no Confirmation message').to.be.empty;
  
  await waitForElement(boardPage.tabBoard);
  await driver.sleep(2000);
  const vehicleInfo = await boardPage.carInfoByVin(toyotaCar.vin,0);
  expect(vehicleInfo.brand,'Validate the vehicle brand has not changed' ).to.contain(toyotaCar.brand);
  expect(vehicleInfo.modelYear,'Validate the vehicle year has not changed').to.contain(toyotaCar.modelYear);
  expect(vehicleInfo.description,'Validate the vehicle description has not changed').to.contain(toyotaCar.modelDescription);    
});


//Thrid sceanrio
When('the user decides to set negative values on editing form',{timeout: TimeOutOptions.big}, async()=>{

  const editionVin = await CreateCarFormPage.getCarForm(false);
  await CreateCarFormPage.setVehicleData(editionVin.mileageInput,-Math.abs(lexusCar.mileage));
  await CreateCarFormPage.setVehicleData(editionVin.brandInput,'Mitsubishi');
  await CreateCarFormPage.setVehicleData(editionVin.modelYearInput,-Math.abs(lexusCar.modelYear));
  //await CreateCarFormPage.setVehicleData(editionVin.modelDescriptionInput,lexusCar.modelDescription);
  //await CreateCarFormPage.setVehicleData(editionVin.extColorInput,lexusCar.extColor);
  //await CreateCarFormPage.setVehicleData(editionVin.intColorInput,lexusCar.intColor);
  await CreateCarFormPage.setVehicleData(editionVin.retailPriceInput,-Math.abs(lexusCar.retailPrice));
  await CreateCarFormPage.setVehicleData(editionVin.acvInput,-Math.abs(lexusCar.acv));
  //await CreateCarFormPage.setVehicleData(editionVin.acquisitionDateInput,lexusCar.acquisitionDate);
  await setValueByKeys(editionVin.acquisitionDateInput,lexusCar.acquisitionDate);
  await editionVin.acquisitionMethodInput.sendKeys('nothing');
  await editionVin.transmissionTypeInput.sendKeys('nothing');
  await editionVin.interiorTrimInput.sendKeys('nothing');

});

Then('the edition form throws error messages about negatives values not allowed',{timeout: TimeOutOptions.medium}, async()=>{

  await driver.sleep(TimeOutOptions.xSmall);
  expect(VehicleErrorMessages.brandIncluded, 'Validate brand error message').to.exist;
  expect(VehicleErrorMessages.invalidYear, 'Validate Model Year error message').to.exist;
  expect(VehicleErrorMessages.numericField, 'Validate negatives numbers error message').to.exist;
});

//forth
When('a new Lexus vehicle exists on the Acquired column',{timeout: TimeOutOptions.huge}, async()=>{

  await waitForElement(boardPage.tabBoard);
  lexusCar = await vehicleRequest.createVehicleApi({ ...blueLexusVehicleTest});
  State.addCreatedVehiclesByVin(lexusCar.vin);
  await driver.navigate().refresh();
  await driver.sleep(TimeOutOptions.medium);
});

When('the user selects the Edit option from the Lexus menu',{timeout: TimeOutOptions.medium}, async()=>{

  await waitForElement(boardPage.tabBoard);
  const vehicleInfo = await boardPage.carInfoByVin(lexusCar.vin,0);
  await vehicleInfo.menuButton.click();
  await boardPage.getVehicleMenuButton(lexusCar.vin, 0,VehicleMenuOptions.editButton);
});

Then('the editing screen allows the user to set new Tesla vehicle data',{timeout: TimeOutOptions.big}, async()=>{

  const editionVin = await CreateCarFormPage.getCarForm(false);
  await CreateCarFormPage.setVehicleData(editionVin.mileageInput,teslaCar.mileage);
  await CreateCarFormPage.setVehicleData(editionVin.brandInput,teslaCar.brand);
  await CreateCarFormPage.setVehicleData(editionVin.modelYearInput,teslaCar.modelYear);
  await CreateCarFormPage.setVehicleData(editionVin.modelDescriptionInput,teslaCar.modelDescription);
  await CreateCarFormPage.setVehicleData(editionVin.extColorInput,teslaCar.extColor);
  await CreateCarFormPage.setVehicleData(editionVin.intColorInput,teslaCar.intColor);
  await CreateCarFormPage.setVehicleData(editionVin.retailPriceInput,teslaCar.retailPrice);
  await CreateCarFormPage.setVehicleData(editionVin.acvInput,teslaCar.acv);
  await setValueByKeys(editionVin.acquisitionDateInput,teslaCar.acquisitionDate);
  
  await editionVin.acquisitionMethodInput.sendKeys(teslaCar.acquisitionMethod);
  await editionVin.transmissionTypeInput.sendKeys(teslaCar.transmissionType);
  await editionVin.interiorTrimInput.sendKeys(teslaCar.interiorTrim);
  
  const getSaveVehicleInputButton = await CreateCarFormPage.getSaveVehicleInputButton();
  await driver.sleep(500);
  await getSaveVehicleInputButton.click();

  const confirmMessage = CreateCarFormPage.getSuccessToast();
  expect(confirmMessage, 'Validate confirmation message is displayed successfully').to.be.not.undefined;

});

Then('the user validates the Tesla data from the vehicles board',{timeout: TimeOutOptions.medium}, async()=>{

  await vehicleDetailsPage.getBackToBoard();
  await waitForElement(boardPage.tabBoard);
  await driver.sleep(TimeOutOptions.small);
  const vehicleInfo = await boardPage.carInfoByVin(lexusCar.vin,0);
  expect(vehicleInfo.brand, 'Validate the vehicle brand has changed to Tesla').to.contain(teslaCar.brand);
  expect(vehicleInfo.modelYear, 'Validate the vehicle year has changed').to.contain(teslaCar.modelYear);
  expect(vehicleInfo.description, 'Validate the vehicle description has changed').to.contain(teslaCar.modelDescription);
});

Then('the user selects the Lexus vehicle card from the vehicles board',{timeout: TimeOutOptions.medium}, async()=>{
  await waitForElement(boardPage.tabBoard);
  await boardPage.getVehicleByCostSymbol(lexusCar.vin,0); 
});

Then('the user validates the Tesla data on VIN details screen',{timeout: TimeOutOptions.medium}, async()=>{

  await driver.sleep(TimeOutOptions.xSmall);
  const descriptionForm = await vehicleDetailsPage.getDescriptionForm();
  expect(descriptionForm.milageDescription.replace(/,/,'')).to.contain(teslaCar.mileage);
  expect(descriptionForm.brandDescription).to.contain(teslaCar.brand);
  expect(descriptionForm.modelYearDescription).to.contain(teslaCar.modelYear);
  expect(descriptionForm.modelDescription).to.contain(teslaCar.modelDescription);
  
  expect(descriptionForm.extColorVehicle.toLowerCase()).to.contain(teslaCar.extColor);
  expect(descriptionForm.intColorDescription.toLowerCase()).to.contain(teslaCar.intColor);//validate
  
  expect(descriptionForm.retailPriceDescription.replace(/,/,'')).to.contain(teslaCar.retailPrice);
  expect(descriptionForm.acvDescription.replace(/,/,'')).to.contain(teslaCar.acv);

  //const vehicleDate = getDate(descriptionForm.acqDateDescription);
  //expect(vehicleDate).to.contain(teslaCar.acquisitionDate);

  expect(descriptionForm.acqMethodDescription.toLowerCase()).to.contain(teslaCar.acquisitionMethod);
  expect(descriptionForm.transTypeDescription.toLowerCase()).to.contain(teslaCar.transmissionType);
  expect(descriptionForm.intTrimDescription.toLowerCase()).to.contain(teslaCar.interiorTrim);
});


//fourth scenarios
When('the user selects the Edit button to set new Tesla vehicle data from VIN details screen',{timeout: TimeOutOptions.medium}, async()=>{
  const editButton = await vehicleDetailsPage.getEditButton();
  await editButton.click();
});

When('the user goes back to the VIN details screen',{timeout: TimeOutOptions.medium}, async()=>{
  await vehicleDetailsPage.getBackToBoard();
});
