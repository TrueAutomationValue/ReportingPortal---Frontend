import { by, Locator } from 'protractor';
import { BaseElement } from './base.element';

export class Multiselect extends BaseElement {
    constructor(locator: Locator) {
        super(locator);
    }

    private input = this.element.element(by.tagName('input'));

    public openSelector() {
        this.element.click();
    }

    public enterValue(value: string) {
        return this.input.sendKeys(value);
    }

    public selectOption(value: string) {
        return this.findOption(value).click();
    }

    public async select(value: string) {
        await this.enterValue(value);
        return this.selectOption(value);
    }

    private findOption(value: string) {
        return this.element.element(by.xpath(`//*[contains(@class, "selector-suggestions")]//li[@title="${value}"]`));
    }

    public getValue() {
        return this.input.getAttribute('value');
    }
}
