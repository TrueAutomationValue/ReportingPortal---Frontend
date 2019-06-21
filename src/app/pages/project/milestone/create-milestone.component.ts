import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Milestone } from '../../../shared/models/milestone';
import { SimpleRequester } from '../../../services/simple-requester';
import { MilestoneService } from '../../../services/milestones.service';

@Component({
  templateUrl: './create-milestone.component.html',
  providers: [
    MilestoneService,
    SimpleRequester
   ]
})
export class CreateMilestoneComponent {

  newMilestoneName= '';

  constructor(
    private postService: MilestoneService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  processMilestoneCreation() {
    const milestone: Milestone = { name: this.newMilestoneName, project_id: this.route.snapshot.params['projectId'] };
    this.postService.createMilestone(milestone).subscribe(result => {
      this.router.navigate(['/project/' + milestone.project_id + '/testrun'], { queryParams: { milestone: result} });
    }, error => console.log(error));
  }
}
