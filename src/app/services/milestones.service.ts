import { Injectable } from '@angular/core';
import { Http, Headers , RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { SimpleRequester } from './simple-requester';
import { Milestone } from '../shared/models/milestone';


@Injectable()
export class MilestoneService extends SimpleRequester {

  getMilestone(milestone: Milestone ) {
    return this.doPost('/milestone/get', milestone).map(res => res.json());
  }

  createMilestone(milestone: Milestone) {
    return this.doPost('/milestone/create', milestone).map(res => res.headers.get('id'));
  }

  removeTest(milestone: Milestone) {
    return this.doDelete(`/milestone?id=${milestone.id}&projectId=${milestone.project_id}`, )
    .map(res => this.handleSuccess(`Test '${milestone.name}' was deleted.`));
  }
}
