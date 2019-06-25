import { browser } from 'protractor';
import { BasePage } from '../base.po';

export class TestRunView extends BasePage {
  constructor() {
    super(elements.uniqueElement, names.pageName);
  }

  navigateTo(projectId: number, testRunId: number) {
    return browser.get(baseUrl(projectId, testRunId));
  }

  async getBuildName() {
    return await elements.buildNameLink.getText();
  }

  async getMilestone() {
    return await elements.milestoneField.getAttribute('value');
  }

  async getTestSuite() {
    return await elements.testSuiteLink.getText();
  }

  async setResolution(resolution: string, testName: string) {
    return await elements.resultsTable.editRow(resolution, columns.resolution, testName, columns.testName);
  }

  async getResolution(testName: string) {
    return (await elements.resultsTable.getRowValues(testName, columns.testName))[columns.resolution];
  }

  async openResult(testName: string) {
    return await elements.resultsTable.clickRow(testName, columns.testName);
  }

  async getStartTime() {
    const startTimeValue = await elements.startTimeLabel.getText();
    const startDateRegex = new RegExp(regexps.startDateRegexp);
    const year = padYear(startDateRegex.exec(startTimeValue)['groups'].year);
    const month = startDateRegex.exec(startTimeValue)['groups'].month - 1;
    const day = startDateRegex.exec(startTimeValue)['groups'].day;
    const hours = convertHoursTo24HourFormat(startDateRegex.exec(startTimeValue)
    ['groups'].hours, startDateRegex.exec(startTimeValue)['groups'].period);
    const minutes = startDateRegex.exec(startTimeValue)['groups'].minutes;
    return new Date(year, month, day, hours, minutes);
  }
}
