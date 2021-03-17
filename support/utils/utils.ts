import { exec } from "child_process";
import { Builder, ThenableWebDriver, Key } from "selenium-webdriver";
import * as chrome from 'selenium-webdriver/chrome';
import { currentEnvironment, Environment } from "~environments/environments";
import { ApplicationPage } from "~pages/application_page";
import { LoginPage } from "~pages/session_page";
import { State } from "./state";
import { VehicleRequest } from "support/api_request/vehicle.request";
import { DealerConfigRequest } from "support/api_request/dealer-config.request";
import { BoardPage } from "~pages/board_page";
import { BaselineMetricsPage } from "~pages/baseline-metrics_page";
import { SettingPage } from "~pages/settings_page";
import { TechniciansPage } from "~pages/technicians_page";
import { TechnicianRequest } from "support/api_request/technician.request";
import { VehicleDetailsPage } from "~pages/vehicle_details";

export let driver: ThenableWebDriver;
export let env: Environment;

export let applicationPage: ApplicationPage;
export let loginPage: LoginPage;
export let boardPage: BoardPage;
export let settingPage: SettingPage;
export let baseLineMetricsPage: BaselineMetricsPage;
export let techniciansPage: TechniciansPage;

export let vehicleRequest: VehicleRequest;
export let dealerConfigRequest: DealerConfigRequest;
export let technicianRequest: TechnicianRequest;

export let vehicleDetailsPage: VehicleDetailsPage;


export async function initConfig() {


  let chromeOptions = `${process.env.HEADLESS}`.trim() === 'False'
    ? new chrome.Options() : new chrome.Options().headless();
  chromeOptions.addArguments('--disable-dev-shm-usage');
  chromeOptions.addArguments('--start-maximized');

  chromeOptions.setUserPreferences({
    'download.default_directory': process.cwd()
  });

  State.gitBranchName = await getCurrentBranchName();

  driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build();

  applicationPage = new ApplicationPage();
  loginPage = new LoginPage();
  boardPage = new BoardPage();
  baseLineMetricsPage = new BaselineMetricsPage();
  settingPage = new SettingPage();
  techniciansPage = new TechniciansPage();
  vehicleDetailsPage = new VehicleDetailsPage();

  env = currentEnvironment();
  vehicleRequest = new VehicleRequest(env);
  dealerConfigRequest = new DealerConfigRequest(env);
  technicianRequest = new TechnicianRequest(env);
}

export async function getToken() {
  if (State.token) { return State.token }
  let idToken;
  await driver.wait(async () => {
    idToken = await driver.executeScript("return localStorage.getItem('id_token')");
    return idToken;
  });
  State.token = `Bearer ${idToken}`;
  return State.token;
}

function execShellCommand(command: string): Promise<string> {
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

export async function getCurrentBranchName(): Promise<string> {
  return (await execShellCommand('git rev-parse --abbrev-ref HEAD')).split('\n')[0].trim();
}

export function toDaysHoursString(days: number): string {
  if (!days || days < 0) {
    throw new Error('days should be greater than 0');
  }
  const normalizedValue = Math.ceil(days * 24);
  const d = Math.floor(normalizedValue / 24);
  const h = normalizedValue % 24;

  const daysText = d <= 0 ? '' : d > 1 ? `${d} days` : `${d} day`;
  const hoursText = h <= 0 ? '' : h > 1 ? `${h} hours` : `${h} hour`;
  const andText = daysText && hoursText ? 'and' : '';

  return `${daysText} ${andText} ${hoursText}`.trim();
}

export async function setValueByKeys(elementField:any, dataToset:string | number ){
  await elementField.sendKeys(Key.SHIFT + Key.HOME + Key.BACK_SPACE);
  await elementField.sendKeys(dataToset);  
}

