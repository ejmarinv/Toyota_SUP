import { waitForElement } from "~utils/driver-utils";
import { TimeOutOptions } from "~utils/times.constant";
import { driver } from "~utils/utils";

export class CreateCarFormPage {
  public static readonly saveVehicleInputButton = { id: 'saveVehicleInputButton' };
  public static readonly cancelVehicleInputButton = { id: 'cancelVehicleInputButton' };

  public static readonly vinInput = { id: 'vehicleInputVin' };
  public static readonly mileageInput = { id: 'vehicleInputMileage' };
  public static readonly brandInput = { id: 'vehicleInputBrand' };
  public static readonly modelYearInput = { id: 'vehicleInputModelYear' };
  public static readonly modelDescriptionInput = { id: 'vehicleInputModelDescription' };
  public static readonly extColorInput = { id: 'vehicleInputExtColor' };
  public static readonly intColorInput = { id: 'vehicleInputIntColor' };
  public static readonly retailPriceInput = { id: 'vehicleInputRetailPrice' };
  public static readonly acvInput = { id: 'vehicleInputAcv' };
  public static readonly acquisitionDateInput = { id: 'vehicleInputAcquisitionDate' };
  public static readonly acquisitionMethodInput = { id: 'vehicleInputAcquisitionMethod' };
  public static readonly transmissionTypeInput = { id: 'vehicleInputTransmissionType' };
  public static readonly interiorTrimInput = { id: 'vehicleInputInteriorTrim' };
  public static readonly successToast = { css: '.snackbar--success' };
  public static readonly failToast = { css: '.snackbar--fail' };
  public static readonly vehicleInputAddAnother = { id: 'vehicleInputAddAnother' };

  static async getCarForm(creation: boolean): Promise<any> {
    let fields = {
      mileageInput: await waitForElement(this.mileageInput),
      brandInput: await waitForElement(this.brandInput),
      modelYearInput: await waitForElement(this.modelYearInput),
      modelDescriptionInput: await waitForElement(this.modelDescriptionInput),
      extColorInput: await waitForElement(this.extColorInput),
      intColorInput: await waitForElement(this.intColorInput),
      retailPriceInput: await waitForElement(this.retailPriceInput),
      acvInput: await waitForElement(this.acvInput),
      acquisitionDateInput: await waitForElement(this.acquisitionDateInput),
      acquisitionMethodInput: await waitForElement(this.acquisitionMethodInput),
      transmissionTypeInput: await waitForElement(this.transmissionTypeInput),
      interiorTrimInput: await waitForElement(this.interiorTrimInput)
    }

    if (!creation) {
      return fields;
    } else {
      return { vinInput: await waitForElement(this.vinInput), fields }
    }
  }

  static async getSaveVehicleInputButton() {
    return await waitForElement(this.saveVehicleInputButton);
  }

  static async getCancelVehicleInputButton() {
    return await waitForElement(this.cancelVehicleInputButton);
  }

  static async getSuccessToast() {
    try {
      return await waitForElement(this.successToast, driver, TimeOutOptions.small);
    } catch (e) {
      return undefined;
    }
  }

  static async setVehicleData(vehicleForm: any, dataToset: string | number): Promise<any> {
    await waitForElement(this.mileageInput);
    await vehicleForm.click();
    await vehicleForm.clear();
    return await vehicleForm.sendKeys(dataToset);
  }

  static async clickVehicleInputAddAnother(): Promise<void> {
    const vehicleInputAddAnother = await waitForElement(this.vehicleInputAddAnother);
    return vehicleInputAddAnother.click();
  }
}
