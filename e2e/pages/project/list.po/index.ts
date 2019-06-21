import { browser } from 'protractor';
import { baseUrl, elements, names } from './constants';
import { BasePage } from '../../base.po';

export class ProjectList extends BasePage {
    constructor() {
        super(elements.uniqueElement, names.pageName);
    }

    navigateTo() {
        return browser.get(baseUrl);
    }

    isProjectInList(projectName: string) {
        return elements.projectsTable.isRowExists(projectName, 'Name');
    }

    async openProject(projectName: string) {
        const rows = await elements.projectsTable.getRows(projectName, 'Name');
        return rows[0].click();
    }

    isCreateProjectExists() {
        return elements.createButton.isPresent();
    }

    async clickCreateProjectButton() {
        await elements.createButton.click();
    }

    async clickRemoveProjectButton(projectName: string) {
        await elements.projectsTable.clickAction(projectName, 'Name');
    }

    async removeProject(projectName: string) {
        await this.navigateTo();
        await this.clickRemoveProjectButton(projectName);
        return this.modal.clickActionBtn('yes');
    }
}
