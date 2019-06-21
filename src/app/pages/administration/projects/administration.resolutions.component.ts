import { Component } from '@angular/core';
import { Project } from '../../../shared/models/project';
import { SimpleRequester } from '../../../services/simple-requester';
import { ProjectService } from '../../../services/project.service';
import { ResultResolutionService } from '../../../services/result-resolution.service';
import { ResultResolution } from '../../../shared/models/result_resolution';
import { TransformationsService } from '../../../services/transformations.service';

@Component({
  templateUrl: './administration.resolutions.component.html',
  providers: [
    ProjectService,
    SimpleRequester,
    ResultResolutionService,
    TransformationsService
  ]
})
export class AdministrationResolutionsComponent {

  hideModal = true;
  removeModalTitle: string;
  removeModalMessage: string;
  resolutionToRemove: ResultResolution;
  projects: Project[];
  selectedProject: Project;
  resolutions: ResultResolution[];
  colors = [
    {id: 1, name: 'Danger'},
    {id: 2, name: 'Warning'},
    {id: 3, name: 'Primary'},
    {id: 4, name: 'Info'},
    {id: 5, name: 'Success'}];
  public sortBy = 'name';
  public sortOrder = 'asc';
  public newColor= {id: 3, name: 'Primary'};
  public newName= '';

  constructor(
    private projectService: ProjectService,
    private resolutionsService: ResultResolutionService
  ) {
    this.projectService.getProjects(this.selectedProject).subscribe(result => {
      this.projects = result;
      this.selectedProject = this.projects[0];
      this.updateResolutions();
    }, error => console.log(error));
  }

  onProjectChange($event) {
    this.selectedProject = $event;
    this.updateResolutions();
  }

  public createResolution() {
    this.resolutionsService.createOrUpdateResolution({
      name: this.newName,
      color: this.newColor.id,
      project_id: this.selectedProject.id
    }).subscribe(res => {
      this.updateResolutions();
      this.newName = '';
    });
  }

  public updateResolution(resolution: ResultResolution, $event) {
    if ($event.id) {
      resolution.color = $event.id;
    }
    this.resolutionsService.createOrUpdateResolution(resolution).subscribe(() => this.updateResolutions());
  }

  public removeResolution(resolution: ResultResolution) {
    this.resolutionToRemove = resolution;
    this.removeModalTitle = `Remove Resolution: ${resolution.name}`;
    this.removeModalMessage = `Are you sure that you want to delete the '${resolution.name}' resolution? This action cannot be undone.`;
    this.hideModal = false;
  }

  public getColor(id: number) {
    return this.colors.find(x => x.id === id);
  }

  updateResolutions() {
    this.resolutionsService.getResolution(this.selectedProject.id).subscribe(res => {
      this.resolutions = res;
    }, error => console.log(error));
  }

  execute($event) {
    if ($event) {
      this.resolutionsService.removeResolution(this.resolutionToRemove).subscribe(res => this.updateResolutions());
    }
    this.hideModal = true;
  }

  wasClosed($event) {
    this.hideModal = $event;
  }
}
