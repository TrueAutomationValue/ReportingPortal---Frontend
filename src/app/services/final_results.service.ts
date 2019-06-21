import { Injectable } from '@angular/core';
import { Http, Headers , RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { SimpleRequester } from './simple-requester';
import { FinalResult } from '../shared/models/final-result';


@Injectable()
export class FinalResultService extends SimpleRequester {

  getFinalResult(finalResult: FinalResult) {
    return this.doPost('/final_result/get', finalResult).map(res => res.json());
  }
}
