import { expect } from "chai";
import { Then, When } from "cucumber";
import { techniciansDataTest } from "~data/dealer-config.data";
import { Technician } from "~models/technician.model";
import { TechniciansErrorMessages } from "~pages/technicians_page";
import { generatePhone } from "~utils/business-utils";
import { waitForElement } from "~utils/driver-utils";
import { splitPhoneCodeAndPhoneNumber } from "~utils/phone-utils";
import { State } from "~utils/state";
import { TimeOutOptions } from "~utils/times.constant";
import { boardPage, driver, settingPage, technicianRequest, techniciansPage } from "~utils/utils";

let technicianCreated: Technician;

// CREATE
When('the user clicks on Technicians List option', { timeout: TimeOutOptions.huge }, async () => {

  await waitForElement(boardPage.tabBoard);
  await settingPage.goToTechnicians();
  await driver.sleep(TimeOutOptions.medium);
});

When('the user is able to add a new Technicians number to the list', { timeout: TimeOutOptions.huge }, async () => {

  technicianCreated = { ...techniciansDataTest, phone: generatePhone() };

  const { number } = splitPhoneCodeAndPhoneNumber(technicianCreated.phone);

  const setTechnicianInfo = await techniciansPage.getTechniciansListForm();
  await setTechnicianInfo.technicianNameField.click();
  await setTechnicianInfo.technicianNameField.clear();
  await setTechnicianInfo.technicianNameField.sendKeys(technicianCreated.name);

  await setTechnicianInfo.phoneNumberField.click();
  await setTechnicianInfo.phoneNumberField.clear();
  await setTechnicianInfo.phoneNumberField.sendKeys(number);

  await setTechnicianInfo.techSaveButton.click();

  await driver.sleep(TimeOutOptions.medium);
  State.addCreateTechnician(technicianCreated.phone);
});

Then('the technician will appear in the list', { timeout: TimeOutOptions.huge }, async () => {

  const { number } = splitPhoneCodeAndPhoneNumber(technicianCreated.phone);
  const technician = await techniciansPage.findTechnicianByPhone(number);
  expect(technician.phone).to.equal(number);
  expect(technician.name).to.equal(technicianCreated.name);
});

// UPDATE

When('the user clicks on the edit button on the technician to update', { timeout: TimeOutOptions.huge }, async () => {
  technicianCreated = { ...techniciansDataTest, phone: generatePhone() };
  await technicianRequest.createTechnician(technicianCreated);

  const { number } = splitPhoneCodeAndPhoneNumber(technicianCreated.phone);

  await driver.navigate().refresh();
  await driver.sleep(TimeOutOptions.medium);

  const editButton = await techniciansPage.getEditButtonByPhone(number);
  await editButton.click();
  await driver.sleep(TimeOutOptions.xSmall);
});

When('the user update the technician info', { timeout: TimeOutOptions.huge }, async () => {
  
  const newPhone = generatePhone();
  technicianCreated.phone = newPhone;
  const { number } = splitPhoneCodeAndPhoneNumber(technicianCreated.phone);
  
  technicianCreated.name = 'Test updated name';
  State.addCreateTechnician(technicianCreated.phone);

  const setTechnicianInfo = await techniciansPage.getTechniciansModalForm();

  await setTechnicianInfo.technicianNameField.click();
  await setTechnicianInfo.technicianNameField.clear();
  await setTechnicianInfo.technicianNameField.sendKeys(technicianCreated.name);

  await setTechnicianInfo.phoneNumberField.click();
  await setTechnicianInfo.phoneNumberField.clear();
  await setTechnicianInfo.phoneNumberField.sendKeys(number);

  await setTechnicianInfo.techSaveButton.click();

  await driver.sleep(TimeOutOptions.small);

});

Then('the technician will updated in the list', { timeout: TimeOutOptions.huge }, async () => {

  const { number } = splitPhoneCodeAndPhoneNumber(technicianCreated.phone);
  const technician = await techniciansPage.findTechnicianByPhone(number);
  expect(technician.phone).to.contain(number);
  expect(technician.name).to.equal(technicianCreated.name);
});

// DELETE

When('the user clicks on the remove button', { timeout: TimeOutOptions.huge }, async () => {

  technicianCreated = { ...techniciansDataTest, phone: generatePhone() };
  await technicianRequest.createTechnician(technicianCreated);
  const { number } = splitPhoneCodeAndPhoneNumber(technicianCreated.phone);
 
  State.addCreateTechnician(technicianCreated.phone);

  await driver.navigate().refresh();
  await driver.sleep(TimeOutOptions.small);

  const deleteButton = await techniciansPage.getDeleteButtonByPhone(number);
  await deleteButton.click();

  await driver.sleep(TimeOutOptions.xSmall);
});

When('the user confirms the modal to remove the technician', { timeout: TimeOutOptions.huge }, async () => {
  
  const deleteButton = await techniciansPage.getDeleteModalConfirmButton();
  await deleteButton.click();
  await driver.sleep(TimeOutOptions.xSmall);
});

Then('the technician will be remove from the list', { timeout: TimeOutOptions.huge }, async () => {

  const { number } = splitPhoneCodeAndPhoneNumber(technicianCreated.phone);
  const index = await techniciansPage.indexByPhone(number);
  expect(index).to.undefined;
});


// EXISTED TECHNICIAN
When('the user set a duplicate technicians cell phone number', { timeout: TimeOutOptions.huge }, async () => {

  technicianCreated = { ...techniciansDataTest, phone: generatePhone(false) };
  await technicianRequest.createTechnician(technicianCreated);
  State.addCreateTechnician(technicianCreated.phone);

  await driver.navigate().refresh();
  await driver.sleep(TimeOutOptions.small);
  const setTechnicianInfo = await techniciansPage.getTechniciansListForm();

  await setTechnicianInfo.phoneNumberField.click();
  await setTechnicianInfo.phoneNumberField.clear();
  await setTechnicianInfo.phoneNumberField.sendKeys(technicianCreated.phone);
});

Then('the Sup app will show to the user a validation message', { timeout: TimeOutOptions.huge }, async () => {

  await driver.sleep(TimeOutOptions.xSmall);
  expect(TechniciansErrorMessages.phoneNumberExisted).to.exist;
});

