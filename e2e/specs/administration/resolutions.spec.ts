import { LogIn } from '../../pages/login.po';

import { ProjectList } from '../../pages/project/list.po';
import { ProjectCreate } from '../../pages/project/create.po';
import { ProjectView } from '../../pages/project/view.po';
import { SuiteCreate } from '../../pages/suite/create.po';
import { TestCreate } from '../../pages/test/create.po';
import { TestRunCreate } from '../../pages/testrun/create.po';
import { Project } from '../../../src/app/shared/models/project';
import { ResolutionAdministration } from '../../pages/administration/resolutions.po';

import users from '../../data/users.json';
import projects from '../../data/projects.json';
import suites from '../../data/suites.json';
import tests from '../../data/tests.json';
import testruns from '../../data/testruns.json';
import resolutions from '../../data/resolutions.json';
import { ResultResolution } from '../../../src/app/shared/models/result_resolution';
import { TestRunList } from '../../pages/testrun/list.po';
import { TestRunView } from '../../pages/testrun/view.po';

describe('Full Admin Administartion Resolution Flow', () => {

    const logInPage: LogIn = new LogIn();
    const projectList: ProjectList = new ProjectList();
    const projectCreate: ProjectCreate = new ProjectCreate();
    const projectView: ProjectView = new ProjectView();
    const suiteCreate: SuiteCreate = new SuiteCreate();
    const testCreate: TestCreate = new TestCreate();
    const testRunCreate: TestRunCreate = new TestRunCreate();
    const testRunList: TestRunList = new TestRunList();
    const testRunView: TestRunView = new TestRunView();
    const resolutionAdministration: ResolutionAdministration = new ResolutionAdministration();
    const resolution: ResultResolution = resolutions.flowTest;

    const createTestProject = async (project: Project) => {
        await projectList.clickCreateProjectButton();
        await projectCreate.createProject(project);
        await projectList.openProject(project.name);
        await (await projectView.menuBar.create()).suite();
        await suiteCreate.createSuite(suites.testCreation);
        await (await projectView.menuBar.create()).test();
        await testCreate.createTest(tests.creationTest, suites.testCreation.name);
        await (await projectView.menuBar.create()).testRun();
        await testRunCreate.creteTestRun(testruns.build1, suites.testCreation.name);
        return projectView.menuBar.clickLogo();
    };

    beforeAll(async () => {
        await logInPage.logIn(users.admin.user_name, users.admin.password);
        await createTestProject(projects.resolutionProject);
        await createTestProject(projects.noResolutionProject);
        await (await projectList.menuBar.user()).administration();
        return resolutionAdministration.sidebar.resolutions();
    });

    afterAll(async () => {
        await projectList.removeProject(projects.resolutionProject.name);
        await projectList.removeProject(projects.noResolutionProject.name);
        if (await logInPage.menuBar.isLogged()) {
            return logInPage.menuBar.clickLogOut();
        }
    });

    describe('Create', () => {
        it('I can create Resolution', async () => {
            await resolutionAdministration.openCreation();
            await resolutionAdministration.selectProject(projects.resolutionProject.name);
            await resolutionAdministration.fillName(resolution.name);
            await resolutionAdministration.selectColor(resolution.color as string);
            return resolutionAdministration.clickCreate();
        });
    });

    describe('Usage', () => {
        it('I can select created resolution on test run view Resolution', async () => {
            await resolutionAdministration.menuBar.clickLogo();
            await projectList.openProject(projects.resolutionProject.name);
            await projectView.menuBar.testRuns();
            await testRunList.openTestRun(testruns.build1.build_name);
            await testRunView.setResolution(resolution.name, tests.creationTest.name);
            return expect(testRunView.getResolution(tests.creationTest.name)).toBe(resolution.name, 'Resolution was not selected');
        });

        it('I can select created resolution on test result view Resolution', async () => {
            await testRunView.openResult(tests.creationTest.name);
            
        });

        it('I can not select created resolution on test run view Resolution for other projects', () => {

        });
    });

    describe('Update', () => {
        it('I can update created resolution', () => {

        });

        it('I can not update global resolutions', () => {

        });
    });

    describe('Remove', () => {
        it('I can delete used resolution', () => {

        });

        it('Results with deleted resolutions become Not Assigned', () => {

        });
    });
});

