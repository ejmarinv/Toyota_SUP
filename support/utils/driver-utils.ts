import { By, Locator, ThenableWebDriver, until, WebDriver, WebElement } from "selenium-webdriver";
import { TimeOutOptions } from "~utils/times.constant";
import { driver } from "./utils";

export async function getExtShadowRoot(): Promise<WebDriver> {
  let shadowHost;
  await (shadowHost = driver.wait(until.elementLocated({ css: 'app-root' })));
  return driver.executeScript("return arguments[0].shadowRoot", shadowHost);
}

export async function getModalTechniciansShadowDom():Promise<WebDriver>{
  let shadowHost;
  await (shadowHost = driver.wait(until.elementLocated({ tagName: 'app-technicians-form-modal' })));
  return driver.executeScript("return arguments[0].shadowRoot", shadowHost);
}

export async function waitForElement(query: Locator, baseElement: ThenableWebDriver | WebDriver = undefined, timeout = 5000): Promise<WebElement> {
  if (!baseElement) {
    baseElement = await getExtShadowRoot();
  }
  return driver.wait(() =>
    baseElement.findElements(query)
      .then(elements => {
        if (elements.length === 0) {
          return undefined; // element not found
        } else {
          return elements[0].isDisplayed()
            .then(displayed => displayed ? elements[0] : undefined);
        }
      })
    , timeout);
}

export async function waitUntilAttributeChange(query: Locator, attribute: string = 'value', timeout: number = TimeOutOptions.small) {
  const element = await waitForElement(query);
  const initialValue = await element.getAttribute(attribute);
  await driver.wait(() =>
    element.getAttribute(attribute).then((value: string) => {
      return value !== initialValue;
    })
    , timeout)
  return element;
}

export async function waitUntilContentChange(query: Locator, expectedContent: string, timeout: number = TimeOutOptions.small) {
  const element = await waitForElement(query);
  await driver.wait(() =>
    element.getText().then((value: string) => {
      return value != null ? value.includes(expectedContent) : null;
    })
    , timeout)
  return element;
}

export async function getParentElement(element: WebElement, parentLevel = 1): Promise<WebElement> {
  const dots = Array.from({ length: parentLevel }, (_) => '..').join('/');
  const xpath = `./${dots}`;
  return element.findElement({ xpath });
}

export async function getIndexFromId(element: WebElement) {
  return (await element.getAttribute('id')).split('-')[1];
}

export async function getMapTextAndIndexFromElementId(elements: WebElement[]): Promise<Map<string, string>> {
  const cartProductMap = new Map();
  for (const element of elements) {
    cartProductMap.set((await element.getText()).trim(), await getIndexFromId(element));
  }
  return cartProductMap;
}

export async function findElements(query: Locator): Promise<WebElement[]> {

  const shadowDom = await getExtShadowRoot();
  return shadowDom.findElements(query);
}

export async function findElement(query: Locator): Promise<WebElement> {

  const shadowDom = await getExtShadowRoot();
  return shadowDom.findElement(query);
}

export async function indexByClassAndContent(cssClass: string, content: string, idPosition: number = 1) {

  const elements: WebElement[] = await findElements(By.className(cssClass));
  let element: WebElement;
  for (const e of elements) {

    const vinValue = await e.getText();
    if (vinValue.includes(content)) {
      element = e;
      break;
    }
  }

  if (element == null) {
    return undefined;
  }

  const index = await element.getAttribute('id');
  return index.split('-')[idPosition];
}


export async function scrollToTheTop() {
  await driver.executeScript('window.scrollTo(0,0);');
}

export async function scrollToElement(element:any){
  await driver.executeScript("arguments[0].scrollIntoView();", findElement(element));
}

export async function specialClick(element:any) {
  await driver.executeScript("arguments[0].click();", element);
}

