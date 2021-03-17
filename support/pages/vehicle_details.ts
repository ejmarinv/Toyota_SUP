import { By, WebElement } from "selenium-webdriver";
import { findElement, findElements, scrollToTheTop, waitForElement } from "~utils/driver-utils";
import { techniciansPage, vehicleDetailsPage } from "~utils/utils";

export class VehicleDetailsPage{

  public readonly vinDescription = {id:'detailVin'};
  public readonly milageDescription = {id:'mileageContent'};
  public readonly brandDescription = {id:'brandContent'};
  public readonly modelYearDescription = {id:'modelYearContent'};
  public readonly modelDescription = {id:'modelDescriptionContent'};
  public readonly extColorVehicle = {id:'extColorContent'};
  public readonly intColorDescription = {id:'intColorContent'};
  public readonly retailPriceDescription = {id:'retailPriceContent'};
  public readonly acvDescription = {id:'acvContent'};
  public readonly acqDateDescription = {id:'AcquisitionDateContent'};
  public readonly acqMethodDescription = {id:'acquisitionMethodContent'};
  public readonly transTypeDescription = {id:'transmitionTypeContent'};
  public readonly intTrimDescription = {id:'interiorTrimContent'};

  public readonly editDescriptionButton = {id:'editDescription'};
  public readonly deleteVinDescriptionBUtton = {id:'deleteVinDescription'};

  public readonly backToBoardButton = {id:'backButton'};
  public readonly recordTitle = {id:'recordTitle'};
 
  public readonly vehicleRecordTitle = 'recordItemTitle';
  public readonly vehicleRecordUpdatedBy = 'recordItemUpdatedBy';
  public readonly vehicleRecordItemTime = 'recordItemTime';
  public readonly vehicleRecordItemDate = 'recordItemDate';

  public readonly vehicleTechnicianRO = 'recordItemRo';
  public readonly vehicleAccessDuration = 'recordItemTime';
  public readonly vehicleRecordTittleClass = 'record__content__list__item__time__description';

  public readonly profitHoldingCostGraph = {id:'profitHoldingCostGraph'};
  public readonly totalTimeHoldingCostGraph = {id:'totalTimeHoldingCostGraph'};

  public readonly editVehicleBtn = {id:'editVehicleBtn'};
  public readonly deleteVehicleBtn = {id:'deleteVehicleBtn'};

  async getDescriptionForm(){
    return{
      milageDescription : await (await waitForElement(this.milageDescription)).getText(),
      brandDescription : await (await waitForElement(this.brandDescription)).getText(),
      modelYearDescription : await (await waitForElement(this.modelYearDescription)).getText(),
      modelDescription : await (await waitForElement(this.modelDescription)).getText(),

      extColorVehicle : await (await waitForElement(this.extColorVehicle)).getText(),
      intColorDescription : await (await waitForElement(this.intColorDescription)).getText(),
      retailPriceDescription : await (await waitForElement(this.retailPriceDescription)).getText(),
      acvDescription : await (await waitForElement(this.acvDescription)).getText(),

      acqDateDescription : await (await waitForElement(this.acqDateDescription)).getText(),
      acqMethodDescription : await (await waitForElement(this.acqMethodDescription)).getText(),
      transTypeDescription : await (await waitForElement(this.transTypeDescription)).getText(),
      intTrimDescription : await (await waitForElement(this.intTrimDescription)).getText(),
    
    }
  }

  async getBackToBoard(){
      await scrollToTheTop();
      const backToBoard = await findElement(vehicleDetailsPage.backToBoardButton);
      return backToBoard.click();
  }

  async getStepsRecordsInfo():Promise<any>{

    let vehiclesRecordTitles:string[]=[];
    let updatedByRecord:string[] = [];
    let recordItemTime:string[] = [];
    let recordItemDates:string[] = [];

    await waitForElement(By.className(this.vehicleRecordTittleClass));
    const index = await findElements(By.className(this.vehicleRecordTittleClass));

    if (index == null) {
      return undefined;
    }

    for(let i=0;i<index.length;i++){
      const recordTitlesInfo = await waitForElement(techniciansPage.idByPosition(this.vehicleRecordTitle,i));
      vehiclesRecordTitles.push(await recordTitlesInfo.getText());
      
      const updatedByInfo = await waitForElement(techniciansPage.idByPosition(this.vehicleRecordUpdatedBy,i));
      updatedByRecord.push(await updatedByInfo.getText());
      
      const recordTimeInfo =  await waitForElement(techniciansPage.idByPosition(this.vehicleRecordItemTime,i));
      recordItemTime.push(await recordTimeInfo.getText());

      const dateItemInfo = await waitForElement(techniciansPage.idByPosition(this.vehicleRecordItemDate,i));
      recordItemDates.push(await dateItemInfo.getText());
   }

    return {vehiclesRecordTitles,updatedByRecord, recordItemTime, recordItemDates};  
  }

  async getProfitAndTotalTimeGraph(){
    return{
      profitHoldingCostGraph : await (await findElement(this.profitHoldingCostGraph)).getText(),
      totalTimeHoldingCostGraph : await(await waitForElement(this.totalTimeHoldingCostGraph)).getText()   
    }
  } 

  calculateProfitAndTotalTimeGraph(currentIdealRate:number, currentHoldinCost:number, hoursCreated:number){
        return (currentIdealRate * currentHoldinCost) - ( hoursCreated * currentHoldinCost);
  }

  async getEditButton():Promise<WebElement>{
    return await waitForElement(this.editVehicleBtn);
  }

  async getDeleteButton():Promise<WebElement>{
    return await waitForElement(this.deleteVehicleBtn);
  }

}