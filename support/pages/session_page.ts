import { By, until, WebElement } from "selenium-webdriver";
import { specialClick, waitForElement } from "~utils/driver-utils";
import { TimeOutOptions } from "~utils/times.constant";
import { driver } from "~utils/utils";

const usernameField = { id: 'idToken1' };
export class LoginPage {

  
  ///WebElements on Login page.
  private readonly passwordField = { id: 'idToken2' };
  private readonly dealerTermsCheckBox = { id: 'tandC' };
  private readonly LoginButton = { id: 'loginButton_0' };

  async login(username: string, password: string, url: string) {
    await driver.get(url);
    await driver.wait(until.elementLocated({ id: 'idToken1' }));
    await this.setUsername(username);
    await this.setPassword(password);
    await this.selectCheckbox();
    await this.pressLoginButton();
    await driver.wait(until.elementLocated(By.className('user-name')), 60000, 'Element user-name not found');
  }

  async setUsername(username: string) {
    return driver.findElement(usernameField).sendKeys(username);
  }

  async setPassword(password: string) {
    return driver.findElement(this.passwordField).sendKeys(password);
  }

  async selectCheckbox() {
    return driver.findElement(this.dealerTermsCheckBox).click();
  }

  async pressLoginButton() {
    return driver.findElement(this.LoginButton).click();
  }

}

export class LogoutPage {
  constructor() { }

  async waitForUserNameButton(): Promise<WebElement> {
    return waitForElement(By.css(`div.user-name`), driver,TimeOutOptions.medium);
  }

  async waitForLogoutButton(): Promise<WebElement> {
    return waitForElement(By.xpath(`//button[contains(text(),' Logout ')]`), driver,TimeOutOptions.medium);
  }

  async waitForLoginUserName(): Promise<any> {
    return waitForElement(usernameField, driver, TimeOutOptions.small);
  }

  async logout() {
    const nameButton: WebElement = await this.waitForUserNameButton();
    await specialClick(nameButton);
    await driver.sleep(TimeOutOptions.xSmall);
    const logoutButton: WebElement = await this.waitForLogoutButton();
    await specialClick(logoutButton);
    await this.waitForLoginUserName();    
  }

}


