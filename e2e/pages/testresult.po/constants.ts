import { by, element } from 'protractor';

export const baseUrl = function (projectId, testresultId) {
    return `/project/${projectId}/testresult/${testresultId}`;
};

export const names = {
    pageName: 'Test Result Page',
    buildNameLabel: 'Test:',
    milestoneLabel: 'Test Run:',
    testSuiteLabel: 'Duration:',
    startTimeLabel: 'Debug Result:',
    result: 'Result:',
    resolution: 'Resolution:',
    assingee: 'Assignee:'
};

export const elements = {
    uniqueElement: element(by.id('test-result-view')),
};
