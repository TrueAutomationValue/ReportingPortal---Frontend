import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { SimpleRequester } from '../../services/simple-requester';
import { Project } from '../../shared/models/project';
import { User } from '../../shared/models/user';
import { CustomerService } from '../../services/customer.service';

@Component({
  templateUrl: './create-project.component.html',
  providers: [
    CustomerService,
    ProjectService,
    SimpleRequester
   ]
})
export class CreateProjectComponent implements OnInit {
  customers: User[];
  newProject: Project = { name: '' };

  constructor(
    public customerService: CustomerService,
    private projectService: ProjectService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.customerService.getCustomer().subscribe(result => {
      this.customers = result;
    });
  }

  processProjectCreation() {
    this.projectService.createProjects(this.newProject).subscribe(() => {
      this.router.navigate(['/project/']);
      this.projectService.handleSuccess(`${this.newProject.name} project is created!`);
    }, error => console.log(error));
  }
}
