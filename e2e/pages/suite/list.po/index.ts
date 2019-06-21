import { elements, names } from './constants';
import { BasePage } from '../../base.po';

export class SuiteList extends BasePage {
    constructor() {
        super(elements.uniqueElement, names.pageName);
    }

    isTestSuitePresent(name: string): any {
        return elements.testSuiteTable.isRowExists(name, 'Name');
    }

    async clickTestSuite(name: string) {
        const rows = await elements.testSuiteTable.getRows(name, 'Name');
        await rows[0].click();
    }

    clickRemoveSuiteButton(name: string) {
        return elements.testSuiteTable.clickAction(name, 'Name');
    }
}
