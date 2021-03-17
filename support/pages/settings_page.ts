import { Locator, WebElement } from "selenium-webdriver";
import { waitForElement } from "~utils/driver-utils";
import { TimeOutOptions } from "~utils/times.constant";
import { driver } from "~utils/utils";

export class SettingPage {
  public readonly settingButton = { id: 'buttonConfig' };
  public readonly baseLineMetricsButton = { id: 'configMetrics' };
  public readonly techniciansListButton = { id: 'techniciansList' };

  async waitForSettingsOption(optionName: Locator): Promise<WebElement> {
    return await waitForElement(optionName, driver);
  }

  async pressSettingsOptions(optionToClick: Locator) {
    
    const settingsButton: WebElement = await waitForElement(this.settingButton);
    settingsButton.click();

    await driver.sleep(TimeOutOptions.xSmall);
    
    const buttonToClick: WebElement = await driver.findElement(optionToClick);
    buttonToClick.click();    
  }

  async goToBaselineMetrics(){
    return this.pressSettingsOptions(this.baseLineMetricsButton);
  }

  async goToTechnicians(){
    return this.pressSettingsOptions(this.techniciansListButton);
  }

}
