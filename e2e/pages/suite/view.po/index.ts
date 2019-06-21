import { browser } from 'protractor';
import { BasePage } from '../../base.po';
import { elements, baseUrl, names } from './constants';

export class SuiteView extends BasePage {
  constructor() {
    super(elements.uniqueElement, names.pageName);
  }

  navigateTo(id: number, item: number) {
    return browser.get(baseUrl(id, item));
  }

  isAutomationDurationLabel() {
    return elements.automationDurationLabel.isPresent();
  }

  getNameOfLabelTestSuite() {
    return elements.selectedSuiteLookup.getValue();
  }

  getNameOfTestSuite() {
    return elements.nameOfTestSuite.getText();
  }

  getManualDurationeTestSuite() {
    return elements.totalManualDurationLabel.getText();
  }

  getTotalTestsSuite() {
    return elements.totalTestsLabel.getText();
  }
}
