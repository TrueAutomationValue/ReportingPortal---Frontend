import { browser } from 'protractor';
import { baseUrl, elements, names, regexps } from './constants';
import { BasePage } from '../../base.po';

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

    async getStartTime() {
        const startTimeValue = await elements.startTimeLabel.getText();
        const startDateRegex = new RegExp(regexps.startDateRegexp);
      // @ts-ignore
        const year = padYear(startDateRegex.exec(startTimeValue).groups.year);
      // @ts-ignore
        const month = startDateRegex.exec(startTimeValue).groups.month - 1;
      // @ts-ignore
        const day = startDateRegex.exec(startTimeValue).groups.day;
        const hours = convertHoursTo24HourFormat(startDateRegex.exec(startTimeValue)
      // @ts-ignore
        .groups.hours, startDateRegex.exec(startTimeValue).groups.period);
      // @ts-ignore
        const minutes = startDateRegex.exec(startTimeValue).groups.minutes;
      return new Date(year, month, day, hours, minutes);
    }
}

function padYear(endPart) {
    return parseInt(new Date().getFullYear().toString().substring(0, 2) + endPart, 10);
}

function convertHoursTo24HourFormat(hours, dayPeriod) {
    const amDayPeriod = 'AM';
    const hoursInDay = 12;
    if (dayPeriod === amDayPeriod) {
          return hours;
      }
    return parseInt(hours, 10) + hoursInDay;
}
