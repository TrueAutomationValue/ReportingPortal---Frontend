import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { SimpleRequester } from './simple-requester';
import { Project, ImportBodyPattern } from '../shared/models/project';


@Injectable()
export class ProjectService extends SimpleRequester {

  getProjects(project: Project) {
    return this.doPost('/project/get', project).map(res => res.json());
  }

  async getProject(id: number): Promise<Project> {
    const projects = await this.doPost('/project/get', {id}).map(res => res.json()).toPromise();
    return projects[0];
  }

  createProjects(project: Project) {
    if (!project.customer_id && project.customer) {
      project.customer_id = project.customer.id;
    }
    return this.doPost('/project/create', project).map(res => res.headers.get('id'), err => { this.handleError(err); });
  }

  removeProject(project: Project) {
    return this.doDelete(`/project?projectId=${project.id}`, )
    .map(() => this.handleSuccess(`Project '${project.name}' was deleted.`));
  }

  getImportBodyPatterns(bodyPattern: ImportBodyPattern) {
    return this.doGet(`/body_pattern?projectId=${bodyPattern.project_id}`).map(res => res.json());
  }

  createImportBodyPattern(bodyPattern: ImportBodyPattern) {
    return this.doPost('/body_pattern', bodyPattern).map(() => {});
  }

  removeImportBodyPattern(bodyPattern: ImportBodyPattern) {
    return this.doDelete(`/body_pattern?id=${bodyPattern.id}&projectId=${bodyPattern.project_id}`)
    .map(() => this.handleSuccess(`Unique Body Pattern '${bodyPattern.name}' successfully removed.`));
  }

  createImportToken(project: Project) {
    return this.doPost(`/project/importToken`, project).map(res => res.json());
  }
}
