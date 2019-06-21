import { LogIn } from '../../pages/login.po';

import { ProjectList } from '../../pages/project/list.po';
import { ProjectCreate } from '../../pages/project/create.po';
import { ProjectView } from '../../pages/project/view.po';
import { SuiteCreate } from '../../pages/suite/create.po';

import users from '../../data/users.json';
import projects from '../../data/projects.json';
import suites from '../../data/suites.json';
import tests from '../../data/tests.json';
import testruns from '../../data/testruns.json';
import { TestCreate } from '../../pages/test/create.po';
import { TestRunCreate } from '../../pages/testrun/create.po';
import { Project } from '../../../src/app/shared/models/project';

fdescribe('Full Admin Administartion Resolution Flow', () => {

    const logInPage: LogIn = new LogIn();
    const projectList: ProjectList = new ProjectList();
    const projectCreate: ProjectCreate = new ProjectCreate();
    const projectView: ProjectView = new ProjectView();
    const suiteCreate: SuiteCreate = new SuiteCreate();
    const testCreate: TestCreate = new TestCreate();
    const testRunCreate: TestRunCreate = new TestRunCreate();

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
        return (await projectList.menuBar.user()).administration();
    });

    afterAll(async () => {
        await projectList.removeProject(projects.resolutionProject.name);
        await projectList.removeProject(projects.noResolutionProject.name);
        if (await logInPage.menuBar.isLogged()) {
            return logInPage.menuBar.clickLogOut();
        }
    });

    describe('Create', () => {
        it('I can create Resolution', () => {

        });

        it('I can not create Resolution with existing resolution Name', () => {

        });
    });

    describe('Usage', () => {
        it('I can select created resolution on test run view Resolution', () => {

        });

        it('I can select created resolution on test result view Resolution', () => {

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

