import { expect } from 'chai';
import { Then, When } from 'cucumber'
import { waitForElement } from "~utils/driver-utils";
import { BoardPage } from "~pages/board_page";
import { TimeOutOptions } from '~utils/times.constant';

let boardPage: BoardPage;

When('is able to see the board',{timeout: TimeOutOptions.huge}, async function () {
  boardPage = new BoardPage();
  await waitForElement(boardPage.tabBoard);
});

Then('the default columns should show up',{timeout: TimeOutOptions.huge},  async function () {
  const defaultColumns = [
    'acquired',
    'inspection',
    'recondition',
    'detail',
    'done'
  ]
  const columnElements = await Promise.all(defaultColumns.map(async columnName => await waitForElement({id: `${columnName}${boardPage.columnSuffix}`})));
  const allExist = columnElements.map(columnElement => !!columnElement).reduce((a, b) => {return a && b;})
  expect(allExist).is.true;

});
