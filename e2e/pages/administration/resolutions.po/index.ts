import { browser } from 'protractor';
import { elements, baseUrl, names, columns } from './constants';
import { User } from '../../../../src/app/shared/models/user';
import { AdministrationBase } from '../base.po';

export class ResolutionAdministration extends AdministrationBase {
  constructor() {
    super(elements.uniqueElement, names.pageName);
  }

  public columns = columns;

  navigateTo() {
    return browser.get(baseUrl);
  }

  selectProject(value: string) {
    return elements.projectSelector.select(value);
  }

  openCreation() {
    return elements.resolutionsTable.openCreation();
  }

  getCreationError() {
    return elements.resolutionsTable.getCreationError();
  }

  fillName(value: string) {
    return elements.resolutionsTable.fillCreation(value, columns.name);
  }

  selectColor(value: string) {
    return elements.resolutionsTable.fillCreation(value, columns.color);
  }

  clickCreate() {
    return elements.resolutionsTable.clickCreateAction();
  }
}
