import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { SimpleRequester } from './simple-requester';
import { TestResult } from '../shared/models/test-result';


@Injectable()
export class TestResultService extends SimpleRequester {

  getTestResult(testresult: TestResult) {
    testresult.project_id = this.route.snapshot.params['projectId'];
    return this.doPost('/testresult/get', testresult).map(res => res.json());
  }

  createTestResult(testresult: TestResult, overlay: boolean = true) {
    testresult.project_id = this.route.snapshot.params['projectId'];
    return this.doPost('/testresult', testresult, overlay);
  }

  bulkUpdate(testresults: TestResult[], overlay: boolean = true) {
    testresults.forEach(testresult => {
      testresult.project_id = this.route.snapshot.params['projectId'];
      if (testresult.test_resolution) {
        testresult.test_resolution_id = testresult.test_resolution.id;
      }
      if (testresult.assigned_user) {
        testresult.assignee = testresult.assigned_user.user_id;
      }
    });
    return this.doPut('/testresult', testresults, overlay);
  }

  removeTestResult(testresult: TestResult) {
    return this.doDelete(`/testrun?id=${testresult.id}&projectId=${testresult.project_id}`)
      .map(() => this.handleSuccess(`Test result '${testresult.id}' was deleted.`));
  }

  getTestResultsStat(projectId, testRunStartedFrom, testRunStartedTo) {
    const params = { projectId, testRunStartedFrom, testRunStartedTo };
    return this.doGet(`/testresult/stat`, params).map(res =>
      res.json());
  }
}
