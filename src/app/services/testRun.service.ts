import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { SimpleRequester } from './simple-requester';
import { TestRun } from '../shared/models/testRun';
import { User } from '../shared/models/user';
import { TestRunStat } from '../shared/models/testrunStats';


@Injectable()
export class TestRunService extends SimpleRequester {

  getTestRun(testRun: TestRun, limit: number = 0) {
    testRun.project_id = this.route.snapshot.params['projectId'];
    const limitQP = limit === 0 ? '' : `?limit=${limit}`;
    return this.doPost(`/testrun/get${limitQP}`, testRun).map(res => res.json());
  }

  getTestRunWithChilds(testRun: TestRun, limit: number = 0) {
    testRun.project_id = this.route.snapshot.params['projectId'];
    const limitQP = limit === 0 ? '' : `&limit=${limit}`;
    return this.doPost(`/testrun/get?${this.withChildsQP}${limitQP}`, testRun).map(res => res.json());
  }

  createTestRun(testRun: TestRun) {
    if (testRun.testResults) {
      testRun.testResults = undefined;
    }
    return this.doPost('/testrun/create', testRun).map(res => {
      return res.headers.get('id');
    });
  }

  removeTestRun(testRun: TestRun) {
    return this.doDelete(`/testrun?id=${testRun.id}&projectId=${testRun.project_id}`, )
    .map(() => this.handleSuccess(`Test run '${testRun.build_name}/${testRun.start_time}' was deleted.`));
  }

  getTestsRunStats(testRun: TestRun, overlay: boolean = true): Promise<TestRunStat[]> {
    testRun.project_id = this.route.snapshot.params['projectId'];
    return this.doPost('/stats/testrun', testRun, overlay).map(res => res.json()).toPromise<TestRunStat[]>();
  }

  getTestsRunLabels(id: number) {
    const limitid = id === 0 ? '' : `?id=${id}`;
    return this.doGet(`/testrun/labels${limitid}`).map(res => res.json());
  }

  sendReport(testRun: TestRun, users: User[]) {
    return this.doPost(`/testrun/report?test_run_id=${testRun.id}`, users).map(res => res);
  }

  calculateDuration(testRun: TestRun|TestRunStat): string {
    const start_time = new Date(testRun.start_time);
    const finish_time = new Date(testRun.finish_time);
    const duration = (finish_time.getTime() - start_time.getTime()) / 1000;
    const hours = (duration - duration % 3600) / 3600;
    const minutes = (duration - hours * 3600 - (duration - hours * 3600) % 60) / 60;
    const seconds = duration - (hours * 3600 + minutes * 60);
    return hours + 'h:' + minutes + 'm:' + seconds + 's';
  }
}
