import { expect } from 'chai';
import { Then, When } from 'cucumber'
import { blackToyotaVehicleTest, blueLexusVehicleTest } from "~data/vehicle.data";
import { CreateCarFormPage } from "~pages/create_car_form_page";
import { BoardPage, VehicleErrorMessages } from "~pages/board_page";
import { boardPage, driver, vehicleRequest } from "~utils/utils";
import { TimeOutOptions } from '~utils/times.constant';
import { State } from '~utils/state';
import { Vehicle } from '~models/vehicle.model';
import { waitForElement } from '~utils/driver-utils';

let testCar: Vehicle;

When('clicks on the Add Vehicle button', { timeout: TimeOutOptions.big }, async () => {
  const addVehicleButton = await BoardPage.getAddVehicleButton();
  await addVehicleButton.click();
});
When('fills the required fields on the vehicle form', { timeout: TimeOutOptions.huge }, async () => {
  testCar = blackToyotaVehicleTest;
  const vehicleForm = await CreateCarFormPage.getCarForm(true);
  await vehicleForm.vinInput.sendKeys(testCar.vin);
  await vehicleForm.fields.mileageInput.sendKeys(testCar.mileage);
  await vehicleForm.fields.brandInput.sendKeys(testCar.brand);
  await vehicleForm.fields.modelYearInput.sendKeys(testCar.modelYear);
  await vehicleForm.fields.modelDescriptionInput.sendKeys(testCar.modelDescription);
  await vehicleForm.fields.extColorInput.sendKeys(testCar.extColor);
  await vehicleForm.fields.intColorInput.sendKeys(testCar.intColor);
  await vehicleForm.fields.retailPriceInput.sendKeys(testCar.retailPrice);
  await vehicleForm.fields.acvInput.sendKeys(testCar.acv);
  await vehicleForm.fields.acquisitionDateInput.sendKeys(testCar.acquisitionDate);
  await vehicleForm.fields.acquisitionMethodInput.sendKeys(testCar.acquisitionMethod);
});
When('uncheck add another check button', async () => {
  await CreateCarFormPage.clickVehicleInputAddAnother();
});

When('press the save button', async () => {
  const saveVehicleInputButton = await CreateCarFormPage.getSaveVehicleInputButton();
  await driver.sleep(500);
  await saveVehicleInputButton.click();
  State.addCreatedVehiclesByVin(testCar.vin);
});

Then('the vehicle should be saved', { timeout: TimeOutOptions.huge }, async () => {
  const successToast = await CreateCarFormPage.getSuccessToast();
  expect(successToast).to.not.be.undefined;
});

Then('the created vehicle should exist in board', { timeout: TimeOutOptions.huge }, async () => {
  await driver.sleep(500);
  const card = await boardPage.carInfoByVin(testCar.vin, 0);

  expect(card.timeInStep).to.contain('0 Hours in step');
  expect(card.timeInWholeProcess).to.contain('0 Total hours');
  expect(card.vin).to.contain(testCar.vin);
  expect(card.brand).to.contain(testCar.brand);
  expect(card.description).to.contain(testCar.modelDescription);
  expect(card.modelYear).to.contain(testCar.modelYear);
});


When('fills some of the required fields on the vehicle form', async () => {
  testCar = blackToyotaVehicleTest;
  const vehicleForm = await CreateCarFormPage.getCarForm(true);
  await vehicleForm.vinInput.sendKeys(testCar.vin);
  await vehicleForm.fields.mileageInput.sendKeys(testCar.mileage);
  await vehicleForm.fields.brandInput.sendKeys(testCar.brand);
  await vehicleForm.fields.modelDescriptionInput.sendKeys(testCar.modelDescription);
  await vehicleForm.fields.extColorInput.sendKeys(testCar.extColor);
  await vehicleForm.fields.intColorInput.sendKeys(testCar.intColor);
  await vehicleForm.fields.acvInput.sendKeys(testCar.acv);
  await vehicleForm.fields.acquisitionDateInput.sendKeys(testCar.acquisitionDate);
  await vehicleForm.fields.acquisitionMethodInput.sendKeys(testCar.acquisitionMethod);
});
Then('the vehicle should not be saved', { timeout: TimeOutOptions.huge }, async () => {
  const successToast = await CreateCarFormPage.getSuccessToast();
  expect(successToast).to.be.undefined;
});
When('selects Lexus as Brand', async () => {
  const vehicleForm = await CreateCarFormPage.getCarForm(true);
  await vehicleForm.fields.brandInput.sendKeys('Lexus');
});
When('fills the required fields on the vehicle form for Lexus', { timeout: TimeOutOptions.huge }, async () => {
  testCar = blueLexusVehicleTest;
  const vehicleForm = await CreateCarFormPage.getCarForm(true);
  await vehicleForm.vinInput.sendKeys(testCar.vin);
  await vehicleForm.fields.mileageInput.sendKeys(testCar.mileage);
  await vehicleForm.fields.modelYearInput.sendKeys(testCar.modelYear);
  await vehicleForm.fields.modelDescriptionInput.sendKeys(testCar.modelDescription);
  await vehicleForm.fields.extColorInput.sendKeys(testCar.extColor);
  await vehicleForm.fields.intColorInput.sendKeys(testCar.intColor);
  await vehicleForm.fields.retailPriceInput.sendKeys(testCar.retailPrice);
  await vehicleForm.fields.acvInput.sendKeys(testCar.acv);
  await vehicleForm.fields.acquisitionDateInput.sendKeys(testCar.acquisitionDate);
  await vehicleForm.fields.acquisitionMethodInput.sendKeys(testCar.acquisitionMethod);
  await vehicleForm.fields.transmissionTypeInput.sendKeys(testCar.transmissionType);
  await vehicleForm.fields.interiorTrimInput.sendKeys(testCar.interiorTrim);
});
When('fills some of the required fields on the vehicle form for Lexus', async () => {
  testCar = blueLexusVehicleTest;
  const vehicleForm = await CreateCarFormPage.getCarForm(true);
  await vehicleForm.vinInput.sendKeys(testCar.vin);
  await vehicleForm.fields.mileageInput.sendKeys(testCar.mileage);
  await vehicleForm.fields.modelYearInput.sendKeys(testCar.modelYear);
  await vehicleForm.fields.modelDescriptionInput.sendKeys(testCar.modelDescription);
  await vehicleForm.fields.extColorInput.sendKeys(testCar.extColor);
  await vehicleForm.fields.intColorInput.sendKeys(testCar.intColor);
  await vehicleForm.fields.retailPriceInput.sendKeys(testCar.retailPrice);
  await vehicleForm.fields.acvInput.sendKeys(testCar.acv);
  await vehicleForm.fields.acquisitionDateInput.sendKeys(testCar.acquisitionDate);
  await vehicleForm.fields.acquisitionMethodInput.sendKeys(testCar.acquisitionMethod);
  await vehicleForm.fields.transmissionTypeInput.sendKeys(testCar.transmissionType);
});
When('press the cancel button', async () => {
  const cancelVehicleInputButton = await CreateCarFormPage.getCancelVehicleInputButton();
  await cancelVehicleInputButton.click();
});
Then('The form should be hidden', async () => {
  const createVehicleForm = await BoardPage.getCreateVehicleForm()
  expect(createVehicleForm).to.be.undefined;
});
Then('the created vehicle should not exist in board', async () => {
  await driver.sleep(500);
  const card = await boardPage.carInfoByVin(testCar.vin, 0);
  expect(card).to.be.undefined;
});


//////duplicate VIN
When('create a new toyota vehicle', { timeout: TimeOutOptions.huge }, async () => {

  await waitForElement(boardPage.tabBoard);
  testCar = await vehicleRequest.createVehicleApi({ ...blackToyotaVehicleTest });
  State.addCreatedVehiclesByVin(testCar.vin);

  await driver.navigate().refresh();
  await driver.sleep(TimeOutOptions.medium);

});

When('fills the required fields with a duplicated VIN', { timeout: TimeOutOptions.big }, async () => {

  const vehicleForm = await CreateCarFormPage.getCarForm(true);
  await vehicleForm.vinInput.sendKeys(testCar.vin);///already existed VIN
  await vehicleForm.fields.mileageInput.sendKeys(testCar.mileage);
  await vehicleForm.fields.brandInput.sendKeys(testCar.brand);
  await vehicleForm.fields.modelYearInput.sendKeys(testCar.modelYear);
  await vehicleForm.fields.modelDescriptionInput.sendKeys(testCar.modelDescription);
  await vehicleForm.fields.extColorInput.sendKeys(testCar.extColor);
  await vehicleForm.fields.intColorInput.sendKeys(testCar.intColor);
  await vehicleForm.fields.retailPriceInput.sendKeys(testCar.retailPrice);
  await vehicleForm.fields.acvInput.sendKeys(testCar.acv);
  await vehicleForm.fields.acquisitionDateInput.sendKeys(testCar.acquisitionDate);
  await vehicleForm.fields.acquisitionMethodInput.sendKeys(testCar.acquisitionMethod);
});

Then('a new alert message would let the user know about the duplicated VIN', { timeout: TimeOutOptions.medium }, async () => {

  const errorMessage = await BoardPage.getVinNumberFieldError();
  expect(errorMessage, 'Validate existing VIN number').to.contain(VehicleErrorMessages.vinDuplicated);
});


When('fills the required fields setting negatives values',{ timeout: TimeOutOptions.medium }, async()=>{
  testCar = blackToyotaVehicleTest;
  const vehicleForm = await CreateCarFormPage.getCarForm(true);
  await vehicleForm.vinInput.sendKeys(-Math.abs(parseInt(testCar.vin)));///already existed VIN
  await vehicleForm.fields.mileageInput.sendKeys(-Math.abs(testCar.mileage));
  await vehicleForm.fields.brandInput.sendKeys('Mitsubishi');
  await vehicleForm.fields.modelYearInput.sendKeys(-Math.abs(testCar.modelYear));
  await vehicleForm.fields.modelDescriptionInput.sendKeys(testCar.modelDescription);
  await vehicleForm.fields.extColorInput.sendKeys(testCar.extColor);
  await vehicleForm.fields.intColorInput.sendKeys(testCar.intColor);
  await vehicleForm.fields.retailPriceInput.sendKeys(-Math.abs(testCar.retailPrice));
  await vehicleForm.fields.acvInput.sendKeys(-Math.abs(testCar.acv));
  await vehicleForm.fields.acquisitionDateInput.sendKeys(testCar.acquisitionDate);
  await vehicleForm.fields.acquisitionMethodInput.sendKeys(testCar.acquisitionMethod);

});

Then('the vehicle should be not be created',{ timeout: TimeOutOptions.small }, async()=>{

  //await driver.sleep(TimeOutOptions.xSmall);
  expect(VehicleErrorMessages.brandIncluded, 'Validate brand error message').to.exist;
  expect(VehicleErrorMessages.invalidYear, 'Validate Model Year error message').to.exist;
  expect(VehicleErrorMessages.numericField, 'Validate negatives numbers error message').to.exist;
});




