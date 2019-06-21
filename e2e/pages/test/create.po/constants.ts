import { by, element } from 'protractor';
import { Autocomplete } from '../../elements/autocomplete.element';
import { Input } from '../../elements/input.element';

export const baseUrl = '/create/test';

export const elements = {
    uniqueElement: element(by.id('create-test-page')),
    createButton: element(by.id('create-test-button')),
    nameField: new Input(by.id('test-name')),
    suiteField: new Autocomplete(by.id('test-suite')),
    descriptionField: new Input(by.id('test-description')),
};

export const names = {
    pageName: 'Create Test Page'
};
