import { WebElement } from "selenium-webdriver"
import { getModalTechniciansShadowDom, indexByClassAndContent, waitForElement } from "~utils/driver-utils"
import { driver } from "~utils/utils"

export class TechniciansPage {

  public readonly technicianNameField = { id: 'technicianName' };
  public readonly phoneNumberField = { id: 'phoneNumber' };
  public readonly techSaveButton = { id: 'saveBtn' };
  public readonly modalSaveButton = { id: 'updateModalBtn' };

  public readonly techEditButton = 'editBtn'
  public readonly techDeleteButton = 'deleteBtn';

  private readonly techItemName = 'technicianListName';
  private readonly techItemPhone = 'technicianListPhone';

  private readonly phoneItemSection = 'technicians-list__section__content__text';

  public readonly modalDeleteConfirmButton = { id: 'confirmModalOption' };



  async getTechniciansModalForm() {

    const modal = await getModalTechniciansShadowDom();

    return {
      technicianNameField: await waitForElement(this.technicianNameField, modal),
      phoneNumberField: await waitForElement(this.phoneNumberField, modal),
      techSaveButton: await waitForElement(this.modalSaveButton, modal)
    }
  }

  async getTechniciansListForm() {
    return {
      technicianNameField: await waitForElement(this.technicianNameField),
      phoneNumberField: await waitForElement(this.phoneNumberField),
      techSaveButton: await waitForElement(this.techSaveButton)
    }
  }

  async indexByPhone(phone: string) {
    return indexByClassAndContent(this.phoneItemSection, phone);
  }


  async findTechnicianByPhone(phone: string) {
    const index = await this.indexByPhone(phone);

    if (index == null) {
      return undefined;
    }

    const nameElement = await waitForElement(this.idByPosition(this.techItemName, index));
    const phoneElement = await waitForElement(this.idByPosition(this.techItemPhone, index));

    return {
      name: await nameElement.getText(),
      phone: await phoneElement.getText(),
    };
  }

  async getEditButtonByPhone(phone: string): Promise<WebElement> {
    const index = await this.indexByPhone(phone);
    return waitForElement(this.idByPosition(this.techEditButton, index));
  }

  async getDeleteButtonByPhone(phone: string): Promise<WebElement> {
    const index = await indexByClassAndContent(this.phoneItemSection, phone);
    return waitForElement(this.idByPosition(this.techDeleteButton, index));
  }

  async getDeleteModalConfirmButton() {
    return driver.findElement(this.modalDeleteConfirmButton);
  }

  idByPosition(id: string , position: string | number) {
    return { id: `${id}-${position}` };
  }

}

export enum TechniciansErrorMessages {
  codePhoneAsNumber = 'The code phone should be a number',
  phoneNumberExisted = 'The phone number already exists',
}
