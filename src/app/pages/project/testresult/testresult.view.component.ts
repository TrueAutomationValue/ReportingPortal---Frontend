import { Component , OnInit, Input, OnChanges, SimpleChange} from '@angular/core';
import { SimpleRequester } from '../../../services/simple-requester';
import { TestResultService } from '../../../services/test-result.service';
import { TestResult } from '../../../shared/models/test-result';
import { FinalResult } from '../../../shared/models/final-result';
import { ResultResolution } from '../../../shared/models/result_resolution';
import { ResultResolutionService } from '../../../services/result-resolution.service';
import { FinalResultService } from '../../../services/final_results.service';
import { Observable } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.services';
import { User } from '../../../shared/models/user';
import { LocalPermissions } from '../../../shared/models/LocalPermissions';
import { escape } from 'querystring';
import { TransformationsService } from '../../../services/transformations.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  templateUrl: './testresult.view.component.html',
  providers: [
    TransformationsService,
    SimpleRequester,
    TestResultService,
    ResultResolutionService,
    FinalResultService
  ]
})
export class TestResultViewComponent implements OnInit {
  projectId: number;
  listOfResolutions: ResultResolution[];
  listOfFinalResults: FinalResult[];
  testResult: TestResult;
  editableText: string;
  debugState: number;
  users: LocalPermissions[];

  constructor(
    private route: ActivatedRoute,
    public userService: UserService,
    private notificationsService: NotificationsService,
    private resultResolutionService: ResultResolutionService,
    private finalResultService: FinalResultService,
    private testResultService: TestResultService
  ) {
    this.resultResolutionService.getResolution().subscribe(result => {
      this.listOfResolutions = result;
    }, error => console.log(error));
    this.finalResultService.getFinalResult({}).subscribe(result => {
      this.listOfFinalResults = result;
    }, error => console.log(error));
    this.userService.getProjectUsers(this.route.snapshot.params['projectId'])
    .subscribe(res => {this.users = res.filter(x => x.admin === 1 || x.manager === 1 || x.engineer === 1); });
  }

  ngOnInit() {
      this.projectId = this.route.snapshot.params['projectId'];
      const testResultTemplate: TestResult = {id: this.route.snapshot.params['testresultId']};
      this.testResultService.getTestResult(testResultTemplate).subscribe(result => {
        this.testResult = result[0];
      }, error => console.log(error));
  }

  calculateDuration(): string {
    const start_time = new Date(this.testResult.start_date);
    const finish_time = new Date(this.testResult.finish_date);
    const duration = (finish_time.getTime() - start_time.getTime()) / 1000;
    const hours = (duration - duration % 3600) / 3600;
    const minutes = (duration - hours * 3600 - (duration - hours * 3600) % 60) / 60;
    const seconds = duration - (hours * 3600 + minutes * 60);
    return hours + 'h:' + minutes + 'm:' + seconds + 's';
  }

  testAssigneeUpdate(assigned_user: LocalPermissions) {
    if (assigned_user) {
      this.testResult.assigned_user = assigned_user;
      this.testResult.assignee = assigned_user.user_id;
    }
  }

  setNewResult(finalResult: FinalResult) {
    if (finalResult) {
      this.testResult.final_result = finalResult;
      this.testResult.final_result_id = finalResult.id;
    }
  }

  resolutionUpdate(test_resolution: ResultResolution) {
    if (test_resolution) {
      this.testResult.test_resolution = test_resolution;
      this.testResult.test_resolution_id = test_resolution.id;
    }
  }

  changeDebugState(input: HTMLInputElement, testResult: TestResult) {
     this.testResult.debug = input.checked === true ? 1 : 0;
  }

  Update() {
    const testResultUpdateTemplate: TestResult = {
      id: this.testResult.id,
      test_id: this.testResult.test.id,
      final_result_id: this.testResult.final_result_id,
      test_resolution_id: this.testResult.test_resolution_id,
      comment: this.testResult.comment,
      debug: this.testResult.debug,
      assignee: this.testResult.assignee
    };
    this.testResultService.createTestResult(testResultUpdateTemplate, false).subscribe(() => {
      this.notificationsService.success(
        `Successful`,
        'Result was updated.'
      );
    });
  }
}
