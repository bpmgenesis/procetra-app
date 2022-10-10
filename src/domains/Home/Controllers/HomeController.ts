import { IProjectModel, MiningBrokerClient, Services } from '@procetra/common';
import { Event, foreach, int } from '@tuval/core';
import {
    cLeading,
    Context,
    cTopLeading,
    HStack,
    Icon,
    If,
    PositionTypes,
    Spacer,
    State,
    TApplication,
    Text,
    TextField,
    UIButton,
    UIController,
    UIImage,
    UIMotion,
    UIScene,
    UIView,
    VStack,
} from '@tuval/forms';

import { ProcessMining } from '../../../Application';
import { Resources } from '../../../Resources';
import { ProjectUIService } from '../../../UI/UIServices/ProjectUIService';
import { MenuButton } from '../../Application/Views/MenuButton';
import { PortalFilterBarView } from '../../Application/Views/PortalFilterBarView';
import { RecentProjects } from '../../Application/Views/RecentProjects';
//import { Toi, FormMetadata, FormShell, ComponentMapManager, MockExpressionManager, HttpManager, NavigationManager } from '@tuval/fusion';

/* import { DataManager, Query, WebApiAdaptor } from '@tuval/components/data';
import { MYTestButton } from '@tuval/components/buttons' */

/* debugger;
const result = new DataManager({
    url: 'https://dummyjson.com/products',
    adaptor: new WebApiAdaptor,
}).executeQuery(new Query().select(['OrderID', 'CustomerID', 'EmployeeID']).sortBy('CustomerID', 'descending').where('EmployeeID', 'equal', 3).take(8)).then((e: any) => {
    //e.result will contain the records
    console.log(e.result)
}); */

const form = {
    "key": "userDetailForm",
    "title": "",
    "screenMode": "half",
    "postUrl": "http://localhost:3002/db/save/users",
    controls: [
       /*  {
            "type": "datasource",
            "key": "products",
            "url": "https://dummyjson.com/products"
        }, */
        {
            "type": "uuid",
            "key": "UserID",
            "value$": "'34' + 'asdasd'",
            "order": 0
        },
    ]
}

/* const formMetadata = new FormMetadata(form);
console.log(formMetadata);
const mm = new MockExpressionManager();
const cc = new ComponentMapManager();
cc.propertyChangedEventEmitter.subscribe((changedProperty: any) => {
    alert(JSON.stringify(changedProperty))
})
const formShell = new FormShell(formMetadata, {}, cc, mm, new HttpManager(), new NavigationManager());
formShell.onChanges();
formShell.onInit();
mm.fireExpressionsMustInitializeEvent();
formShell.onDoCheck();
formShell.onAfterContentInit();
formShell.onAfterContentChecked();
formShell.onAfterViewInit();
formShell.onAfterViewChecked();

console.log(formShell); */

export class HomeController extends UIController {

    @State()
    public RequestDesktop: Event<any>;

    @State()
    private currentProject: any;

    @State()
    private currentController: UIController;

    @State()
    private recentFiles: any;

    protected InitController(): void {
        this.showAnim = false;
        this.RequestDesktop = new Event();

        this.test = 'Press'
    }

    private MainPage(): UIView {
        return (
            UIScene(
                VStack(
                    HStack(
                        UIImage(Resources.Icons.ApplicationIcon).width(25).opacity(0.8).position(PositionTypes.Absolute).left('10px').top('10px'),
                        Text('Procetra').fontSize(16).fontWeight('700')
                    ).height(50),
                    HStack(
                        VStack({ spacing: 10 })(
                            MenuButton('', '\\d28c', () => this.OnNewProject()),
                            MenuButton('', '\\d295', () => this.OnOpenProject()),
                            MenuButton('', '\\d279', () => this.OnNewProject()),
                            MenuButton('', '\\d21d', () => this.OnNewProject()),
                            MenuButton('', '\\d272', () => this.OnNewProject()),
                        ).width('120px'),
                        RecentProjects()
                    )
                        // UIScene içerisine yayılması için
                        .width('100%')
                )

            )
        )
    }

    private LoadPortalView(): UIView {
        return UIScene(
            VStack({ alignment: cTopLeading })(
                VStack(
                    HStack({ alignment: cLeading })(
                        UIImage(Resources.Icons.ApplicationIcon).width(24).height(24),
                        Text('Procetra').fontSize('16px').fontWeight('bold').foregroundColor('white'),
                        Spacer(),
                        Icon('\\d2a8').size(20).marginRight('10px').cursor('pointer').foregroundColor('white').onClick(() => this.RequestDesktop())
                    )
                        .fontFamily('verdana, arial, tahoma, helvetica, sans-serif')
                        .minHeight('50px')
                        .maxHeight('50px')
                        .background('rgb(208, 63, 64)'),
                    PortalFilterBarView({ projectName: this.currentProject?.project_name, selectProjectAction: () => this.OnOpenProject() })
                ).height(),
                this.currentController as any
            )
        )
            .backgroundColor('white')
            .alignment(cTopLeading)
    }

    @State()
    private showAnim: boolean;


    @State()
    private test: any;

    @Context()
    public onTextChanged() {
    }

    @Context()
    public onCloseProject() {
        this.currentProject = null;
    }

    private getSubView() {
        return ({ onTextChanged }) => {
            return (
                HStack(
                    UIButton(
                        TextField()
                    ).cursor('pointer').action(() => { onTextChanged(); this.test = { fontSize: '50px' } }),
                    Text('Hello')
                )
            )
        }
    }
    private getContextView() {
        return ({ onTextChanged }) => {
            return (
                UIScene(
                    UIMotion(
                        this.getSubView() as any
                    ).animate(this.test)
                )
            )
        }
    }

    @State()
    private data: any[];

    @State()
    private testCounter: int;
    public override LoadView(): UIView {

        if (TApplication.IsDesktop) {
            return (
                If(this.currentProject == null)
                    (this.MainPage())
                    .else
                    (this.currentController as any)
            )
        } else if (TApplication.IsPortal) {
            return this.LoadPortalView();
        }
    }

    private OnNewProject() {
        ProjectUIService.NewProject().then((name: string) => {
            const session_id = Services.StateService.GetSessionId();

            Services.ProjectService.CreateProject(name, 'api@procetra.com', true, false).then((project: IProjectModel) => {
                this.navigotor('/app(procetra)/project/' + project.project_id + '/empty', { state: { project: project } });
            });
        });
    }

    private OnOpenProject() {
        ProjectUIService.OpenProjectDialog().then((project: IProjectModel) => {
            this.currentController = null;
            const session_id = Services.StateService.GetSessionId();
            this.currentProject = project;
            debugger;
            if (project.is_data_loaded) {
                MiningBrokerClient.LoadEventData(project.project_id).then(() => {
                    this.navigotor('/app(procetra)/project/' + project.project_id, { state: { project: project } })
                });
            } else {
                this.navigotor('/app(procetra)/project/' + project.project_id + '/empty', { state: { project: project } })
            }
        });
    }

    public CLoseProject() {
        this.currentProject = null;
    }

    public LoadRecentFiles() {
        const result = [];
        ProcessMining.RecentlyUploadedFilesStorage.Keys().then((keys) => {
            foreach(keys, key => {
                ProcessMining.RecentlyUploadedFilesStorage.GetString(key).then((str) => {
                    const obj = JSON.parse(str);
                    result.push(obj);
                    /*  const bi: BoxTileItem = new BoxTileItem(key, obj.rowsCount + ' rows');
                     const dateStr = moment(obj.uploadeddate).format('DD.MM.YYYY');
                     bi.FooterTitle = TString.Format('Uploaded at {0}', dateStr);
                     bi.OnClick = () => {
                         EventBus.Default.fire('P2M.C.ADD_CSV', {
                             name: key,
                             csv: Encoding.UTF8.GetString(Convert.FromBase64String(obj.csv)),
                             caseName: obj.caseName,
                             activityName: obj.activityName,
                             timestampName: obj.timestampName,
                             startDateName: obj.startDateName
                         });
                     };
                     bt.Items.Add(bi); */
                });

            });
            this.recentFiles = result;
            console.log(this.recentFiles);
        });
    }
}