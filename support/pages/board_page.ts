import { By, until, WebElement } from "selenium-webdriver";
import { findElement, getExtShadowRoot, indexByClassAndContent, waitForElement } from "~utils/driver-utils";
import { driver } from "~utils/utils";


export class BoardPage {

  public static readonly addVehicleButton = { id: 'addVehicleButton' };
  public static readonly createVehicleForm = { css: 'app-vehicle-form' };
  public static readonly idealRateContainer = { id: 'idealRateContainer' };

  public readonly tabBoard = { id: 'tabBoard' };
  public readonly columnSuffix = 'Column';
  public readonly carVin = 'cardBoardVin';
  public readonly carBrand = 'cardBoardBrand';
  public readonly carModelDescription = 'cardBoardModel';
  public readonly carModelYear = 'cardBoardModelYear';
  public readonly cardBoardTime = 'cardBoardTime';
  public readonly cardBoardTotalTime = 'cardBoardTotalTime';

  public readonly inspectionColumn = { id: 'inspectionStep' };
  public readonly reconditionColumn = { id: 'reconditionStep' };
  public readonly detailStepColumn = { id: 'detailStep' };
  public readonly doneStepColumn = { id: 'doneStep' };

  public readonly carCard = 'cardBoard'; 
  public static readonly cardBoard = { css: '.card-board'};
  public static readonly lessThanNormalCost = {css:'.card-board--less-than-normal'};
  public static readonly moreThanNormalCost = {css:'.card-board--more-than-normal'};

  public static readonly VinNumberFieldError = {id: 'createVehicleError'}
  public readonly vehicleMenuBtn = 'vehicleMenuBtn';

  public readonly cancelModalOption = 'cancelModalOption';
  public readonly confirmModalOption = 'confirmModalOption';
     

  static async getAddVehicleButton() {
    return await waitForElement(this.addVehicleButton);
  }

  static async getCreateVehicleForm(): Promise<WebElement | any> {
    try {
      return await waitForElement(this.createVehicleForm, await getExtShadowRoot(), 500);
    } catch (e) {
      return undefined;
    }
  }

  async carInfoByVin(vin: string, column: number = 0) {
    const index = await indexByClassAndContent('card-board__header__description__vin', vin, 2);
    if (index == null) {
      return undefined;
    }
    const vinElement = await waitForElement(this.idByPosition(this.carVin, column, index));
    const brandElement = await waitForElement(this.idByPosition(this.carBrand, column, index));
    const modelDescription = await waitForElement(this.idByPosition(this.carModelDescription, column, index));
    const modelYearElement = await waitForElement(this.idByPosition(this.carModelYear, column, index));
    const timeInStep = await waitForElement(this.idByPosition(this.cardBoardTime, column, index));
    const timeInWholeProcess = await waitForElement(this.idByPosition(this.cardBoardTotalTime, column, index));
    const vehicleCardInfo: WebElement = await waitForElement(this.idByPosition(this.carCard, column, index));
    const vehicleMenuBtn: WebElement = await waitForElement(this.idByPosition(this.vehicleMenuBtn, column, index));
  
    return {
      vin: await vinElement.getText(), brand: await brandElement.getText(),
      description: await modelDescription.getText(), modelYear: await modelYearElement.getText(),
      timeInStep: await timeInStep.getText(), timeInWholeProcess: await timeInWholeProcess.getText(),vehicleCardClass: await vehicleCardInfo.getAttribute('class'), menuButton: vehicleMenuBtn
    };
  }

  async dragAndDropCards(vin: string, currentColumn: number, destiny: string) {
    const index = await indexByClassAndContent('card-board__header__description__vin', vin, 2);
    const card = await findElement(this.idByPosition(this.carCard, currentColumn, index));
    const destinyColumn = await findElement({ id: destiny + 'Step' });

    await driver.actions()
      .move({ origin: card })
      .press()
      .move({ origin: destinyColumn, duration: 500 })
      .move({ origin: destinyColumn, duration: 500 })
      .release()
      .perform();

    await driver.sleep(3000);
  }

  static async getIdealRateContainer() {
    return await waitForElement(this.idealRateContainer);
  }

  async getVehicleByCostSymbol(vin:string, currentColumn: number){
    const index = await indexByClassAndContent('card-board__header__description__vin', vin, 2);
    const cardElement = await findElement(this.idByPosition(this.carCard, currentColumn, index));
    return await cardElement.click();
  }

  static async getIdealRateText(): Promise<string> {
    const idealRateCont = await this.getIdealRateContainer();
    const idealRateText = await idealRateCont.getText();
    return idealRateText;
  }

  idByPosition(id: string, column: number | string, position: string | number) {
    return { id: `${id}-${column}-${position}` };
  }

  static async getVinNumberFieldError(){
    const errroMessage = waitForElement(this.VinNumberFieldError);
    return (await errroMessage).getText();
  }

  async getVehicleMenuButton(vin:string, currentColumn: number, vehicleMenuOptions:VehicleMenuOptions){
    const index = await indexByClassAndContent('card-board__header__description__vin', vin, 2);
    const vehicleMenuOption = await driver.findElement(this.idByPosition(vehicleMenuOptions, currentColumn, index));
    return vehicleMenuOption.click();
  }

  async getDeletionModal(){
    return{
      confirmButton : await driver.wait(until.elementLocated(By.id(this.confirmModalOption))),
      cancelButton : await driver.wait(until.elementLocated(By.id(this.cancelModalOption)))
      
    }
  }

  static async getVinError(){
    const errroMessage = waitForElement(this.VinNumberFieldError);
    return (await errroMessage).getText();
  }

  async getVehicleIndex(vin:string){
    const index = await indexByClassAndContent('card-board__header__description__vin', vin, 2);
    return index;
  }
}

export enum VehicleCosts {
  vehicleLessThanNormal = 'card-board--less-than-normal',
  vehicleMoreThanNormal = 'card-board--more-than-normal'
  
}

export enum VehicleErrorMessages{
  vinDuplicated = 'This Vin already exists',
  brandIncluded = 'This brand is not included in the list',
  invalidYear = 'Invalid year',
  numericField = 'Must be a numeric field'
}

export enum VehicleMenuOptions{
  editButton = 'editVehicleBtn',
  deleteButton = 'deleteVehicleBtn'
}