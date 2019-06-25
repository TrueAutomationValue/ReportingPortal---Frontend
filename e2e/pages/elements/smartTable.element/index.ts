import { by, Locator, ElementFinder, browser, protractor } from 'protractor';
import { BaseElement } from '../base.element';
import { logger } from '../../../utils/log.util';
import { Checkbox } from '../checkbox.element';
import { InlineEditor } from '../inlineEditor.element';
import { Lookup } from '../lookup.element';
import { Input } from '../input.element';

const EC = protractor.ExpectedConditions;

export class SmartTable extends BaseElement {
    constructor(locator: Locator) {
        super(locator);
    }

    private creationRow = this.element.element(by.css('.ft-creation-row'));
    private creationToggler = this.element.element(by.css('.ft-create-toggler'));
    private creationError = this.element.element(by.css('.ft-create-error'));

    private createRowElements = {
        confirmPassword: (columnIndex: number) =>
            new Input(this.creationRow.element(by.xpath(`./td[${columnIndex + 1}]/input[contains(@class,'ft-confirm-password')]`))),
        password: (columnIndex: number): Input =>
            new Input(this.creationRow.element(by.xpath(`./td[${columnIndex + 1}]/input[contains(@class,'ft-password')]`))),
        input: (columnIndex: number): Input =>
            new Input(this.creationRow.element(by.xpath(`./td[${columnIndex + 1}]/input[@type="text"]`))),
        checkbox: (columnIndex: number): Checkbox =>
            new Checkbox(this.creationRow.element(by.xpath(`./td[${columnIndex + 1}]/input[@type="checkbox"]`))),
        coloredLookup: (columnIndex: number): Lookup =>
            new Lookup(this.creationRow.element(by.xpath(`./td[${columnIndex + 1}]/lookup-colored`))),
    };


    public async openCreation() {
        if (!(await this.isCreationOpened())) {
            await this.creationToggler.click();
            return browser.wait(EC.visibilityOf(this.creationRow), 2000, 'Table Creation row was not opened');
        }
    }

    public async closeCreation() {
        if (await this.isCreationOpened()) {
            await this.creationToggler.click();
            return browser.wait(EC.invisibilityOf(this.creationRow), 2000, 'Table Creation row was not closed');
        }
    }

    public async getCreationError() {
        if (await this.creationError.isPresent()) {
            return this.creationError.getText();
        }
        return '';
    }

    public async fillCreation(value: string | boolean | number, columnName: string) {
        const columnIndex = await this.getColumnIndex(columnName);
        if (await this.isCreationOpened()) {
            if (await this.createRowElements.input(columnIndex).element.isPresent()) {
                return this.createRowElements.input(columnIndex).typeText(value as string);
            } if (await this.createRowElements.checkbox(columnIndex).element.isPresent()) {
                return this.createRowElements.checkbox(columnIndex).setState(value as boolean);
            } if (await this.createRowElements.coloredLookup(columnIndex).element.isPresent()) {
                return this.createRowElements.coloredLookup(columnIndex).select(value as string);
            }
        }
        throw Error('Creation Row is not opened');
    }

    public async fillCreationPassword(value: string | boolean | number, columnName: string) {
        const columnIndex = await this.getColumnIndex(columnName);
        if (await this.isCreationOpened()) {
            return this.createRowElements.password(columnIndex).typeText(value as string);
        }
        throw Error('Creation Row is not opened');
    }

    public async fillCreationConfirmPassword(value: string | boolean | number, columnName: string) {
        const columnIndex = await this.getColumnIndex(columnName);
        if (await this.isCreationOpened()) {
            return this.createRowElements.confirmPassword(columnIndex).typeText(value as string);
        }
        throw Error('Creation Row is not opened');
    }

    public async clickCreateAction() {
        return this.creationRow.element(by.css('.row-action-button')).click();
    }

    public async getCreationTextFieldValue(columnName: string) {
        const columnIndex = await this.getColumnIndex(columnName);
        if (await this.isCreationOpened()) {
            return this.creationRow.element(by.xpath(`./td[${columnIndex + 1}]/input`)).getAttribute('value');
        }

        throw Error('Creation Row is not opened');
    }

    public async getRowValues(value: string, columnName: string) {
        const result: any = {};
        const rows = await this.getRows(value, columnName);
        const columns = await this.getColumns();
        if (rows[0]) {
            for (let i = 0; i < columns.length; i++) {
                const cell = await this.getCell(rows[0], i);
                const checkbox = cell.element(by.xpath('.//input[@type="checkbox"]'));
                if (await checkbox.isPresent()) {
                    result[await columns[i].getText()] = await checkbox.isSelected();
                } else {
                    result[await columns[i].getText()] = await cell.getText();
                }
            }
            return result;
        }
        throw new Error(`No rows were found by ${value} value in ${columnName} column`);
    }

    public async clickAction(value: string, columnName: string) {
        const rows = await this.getRows(value, columnName);
        if (rows[0]) {
            return rows[0].element(by.css('.row-action-button')).click();
        }
        throw new Error(`No rows were found by ${value} value in ${columnName} column`);
    }

    public async isRowExists(value: string, columnName: string) {
        const rows = await this.getRows(value, columnName);
        if (rows.length > 1) {
            logger.warn(`Multiple rows were found by ${value} value in ${columnName} column`);
        }

        if (rows.length === 0) {
            logger.warn(`No rows were found by ${value} value in ${columnName} column`);
            return false;
        }

        return true;
    }

    public async getRows(value: string, columnName: string) {
        const columnIndex = await this.getColumnIndex(columnName);
        const locator = `.//tbody/tr[td[${columnIndex + 1}]//*[contains(text(),'${value}')]]`;
        logger.info(`Looking for rows using ${locator} xpath`);
        return this.element.all(by.xpath(locator));
    }

    public async clickRow(value: string, columnName: string) {
        const rows = await this.getRows(value, columnName);
        if (rows.length < 1) {
            throw new Error(`No rows were found by ${value} value in ${columnName} column`);
        }

        if (rows.length > 1) {
            logger.warn(`Multiple rows were found by ${value} value in ${columnName} column, the first will be clicked`);
        }
        return rows[0].click();
    }


    public async editRow(value: string | boolean, column: string, searchValue: string, searchColumn: string) {
        const rows = await this.getRows(searchValue, searchColumn);
        const columnIndex = await this.getColumnIndex(column);
        if (rows[0]) {
            const cell = await this.getCell(rows[0], columnIndex);
            const inlineEditor: InlineEditor = new InlineEditor(cell.element(by.tagName('inline-editor')));
            const checkbox: Checkbox = new Checkbox(cell.element(by.xpath('.//input[@type="checkbox"]')));
            const coloredLookup: Lookup = new Lookup(cell.element(by.xpath('.//lookup-colored')));
            if (await inlineEditor.element.isPresent()) {
                return inlineEditor.changeAndSetValue(value as string);
            }
            if (await checkbox.element.isPresent()) {
                return checkbox.setState(value as boolean);
            }
            if (await coloredLookup.element.isPresent()) {
                return coloredLookup.select(value as string);
            }

            throw new Error('You are trying to edit not editable column!');
        }

        throw new Error(`No rows were found by ${searchValue} value in ${searchColumn} column`);
    }

    public async clickCellLink(columnWithLink: string, searchValue: string, searchColumn: string) {
        const rows = await this.getRows(searchValue, searchColumn);
        const columnIndex = await this.getColumnIndex(columnWithLink);
        if (rows[0]) {
            const cell = await this.getCell(rows[0], columnIndex);
            const link: ElementFinder = cell.element(by.css('.ft-cell > a'));
            if (await link.isPresent()) {
                return link.click();
            }

            throw new Error('You are trying to click link in column without link!');
        }
    }

    private isCreationOpened() {
        return this.creationRow.isPresent();
    }

    private getColumns() {
        return this.element.all(by.css('.names-header th'));
    }

    private getAllRows() {
        return this.element.all(by.xpath(`*//tbody/tr`));

    }

    private async getColumnIndex(name: string): Promise<number> {
        const columns = await this.getColumns();
        for (let i = 0; i < columns.length; i++) {
            const currentName = await columns[i].getText();
            if (currentName === name) {
                return i;
            }
        }

        logger.warn(`Column ${name} was not found.`);
        return -1;
    }

    private async getCell(row: ElementFinder, index: number): Promise<ElementFinder> {
        const cells = await row.all(by.tagName('td'));
        return cells[index] as ElementFinder;
    }
}
