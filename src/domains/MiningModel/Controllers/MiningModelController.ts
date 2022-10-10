import { IMiningModelModel, IProjectModel, MiningBrokerClient, Services } from '@procetra/common';
import { Event, int } from '@tuval/core';
import {
    cCenter,
    Fonts,
    HStack,
    IconLibrary,
    RoundedRectangle,
    Spacer,
    Spinner,
    State,
    Text,
    TwoColumnWithHeaderLayout,
    UIButton,
    UIController,
    UIScene,
    UIView,
    VStack,
    ZStack,
} from '@tuval/forms';

import { FilterUIService } from '../../../UI/UIServices/FiltersUIService';
import { ProjectUIService } from '../../../UI/UIServices/ProjectUIService';
import { ListView } from '../../../UI/Views/ListView';
import { ProjectModelPageHeader } from '../../../Views/ProjectModelPageHeader';
import { AppControllerClass } from '../../Application/Controllers/AppController';
import { DatasetController } from '../../Dataset/Controllers/DatasetController';
import { MVIProjectItem } from '../Models/MIProjectItem';
import { DesktopView } from '../Views/DesktopView';

/* class StackController extends UIController {
    @State()
    public title: string;

    @State()
    private array: int[];



    protected InitController() {

        this.array = [1, 2, 3];
        this.title = 'Hello Controller';
    }

    public override LoadView(): UIView {
        return VStack(
            Text(this.title).foregroundColor('blue').font(Fonts.title),
        )
    }
} */





const queryMenu = [
    {
        icon: '',
        iconColor: 'black',
        title: 'All cases',
        onClick: (item) => console.log(item)
    },
    {
        icon: '',
        iconColor: 'black',
        title: 'Open',
        onClick: (item) => console.log(item)
    },
    {
        icon: '',
        iconColor: 'black',
        title: 'Save',
        onClick: (item) => console.log(item)
    },
    {
        icon: '',
        iconColor: 'black',
        title: 'Save as',
        onClick: (item) => console.log(item)
    },
    {
        icon: '',
        iconColor: 'black',
        title: 'Export',
        onClick: (item) => console.log(item)
    }
]

export class MiningModelControllerClass extends UIController {
    @State()
    private parentAppController: AppControllerClass;

    @State()
    public MiningModelClosed: Event<any>;

    @State()
    private title: string;

    @State()
    private array: int[];

    @State()
    private projects: any[];

    private miningModels: IMiningModelModel[];

    private project: IProjectModel;

    @State()
    private miningModel: IMiningModelModel;

    @State()
    private selectedProjectItem: MVIProjectItem;

    @State()
    private selectedProjectItems: MVIProjectItem[];

    @State()
    private selectedProjectItemController: UIController;

    @State()
    private selectedTab: string;

    @State()
    private menu: { seperator?: boolean, icon?: string; iconColor?: string; title?: string; action?: (item: any) => void; }[];

    @State()
    private modelMenu: { icon?: any; iconColor?: string; title: string; onClick?: (item: any) => void; }[];

    @State()
    private caseCount: int;

    @State()
    private eventCount: int;

    @State()
    private DataBinded: boolean;

    /*     @State()
        private stackController: StackController; */

    public SetParentAppController(value: AppControllerClass): this {
        this.parentAppController = value;
        return this;
    }


    protected InitController() {

        this.caseCount = 0;
        this.eventCount = 0;

        this.array = [1, 2, 3, 4, 5, 6];
        //this.stackController = new StackController();
        this.selectedTab = 'Process Explorer';
        this.MiningModelClosed = new Event();

        this.menu = [
            {
                title: 'New'
            },
            {
                title: 'Open'
            },
            {
                title: 'Details'
            },
            { seperator: true },
            {
                title: 'Upload data',
                icon: '\\d2c8',
                iconColor: 'black',
                action: (item) => ProjectUIService.UploadDataDialog(this.project)
            }
        ];

        this.modelMenu = [
            {
                icon: IconLibrary.Settings,
                iconColor: 'black',
                title: 'Rename',
                onClick: (item) => console.log(item)
            },
            {
                icon: '\\d2a4',
                iconColor: 'black',
                title: 'Permissions',
                onClick: (item) => console.log(item)
            },
            {
                icon: '\\d3a4',
                iconColor: 'black',
                title: 'Duplicate',
                onClick: (item) => console.log(item)
            },
            {
                icon: '\\d2da',
                iconColor: 'black',
                title: 'Tags',
                onClick: (item) => console.log(item)
            },
            {
                icon: '\\d299',
                iconColor: 'black',
                title: 'Move To',
                onClick: (item) => console.log(item)
            },
            {
                icon: '\\e5cd',
                iconColor: 'red',
                title: 'Close',
                onClick: (item) => { alert(''); this.MiningModelClosed() }
            }
        ]
    }

    private OnMiningModelChanged(miningModel: IMiningModelModel) {

        //this.selectedProjectItems = [CreateMVIProjectItem(project, miningModel)];
        // this.OnProjectItemSelected(this.selectedProjectItems[0]);
        this.selectedProjectItemController.Bind({ project: this.project, miningModel: miningModel });
        this.miningModel = miningModel;
    }
    public BindRouterParams({ project, miningModel }: { project: IProjectModel, miningModel: IMiningModelModel }): this {

        Promise.all([
            Services.ProjectService.GetProjectItems(''),
            MiningBrokerClient.GetCaseCount(project.project_id),
            MiningBrokerClient.GetEventCount(project.project_id),
            Services.ProjectService.GetAnalyseModels(project.project_id)
        ]).then(values => {
            this.BeginUpdate();

            this.project = project;
            this.miningModel = miningModel;
            //this.selectedProjectItems = [CreateMVIProjectItem(project, miningModel)];
            // this.OnProjectItemSelected(this.selectedProjectItems[0]);
            this.selectedProjectItemController = DatasetController(project, miningModel)
            this.caseCount = values[1];
            this.eventCount = values[2];
            this.miningModels = values[3];
            this.EndUpdate();

            this.DataBinded = true;
        })


        /*  MiningBrokerClient.GetCaseCount(session_id,miningModel.project.project_id).then(count => {
             this.caseCount = count;
         });
         MiningBrokerClient.GetEventCount(session_id,miningModel.project.project_id).then(count => {
             this.eventCount = count;
         }) */

        return this;
    }

    //When user click add button that under list
    private OnNewProjectItem() {
        FilterUIService.SelectFilter();
        /* const connectorDialog = new ConnectorDialog();
        connectorDialog.ShowDialog(); */
    }

    /*  // When user select items from list
     private OnProjectItemSelected(projectItem: MVIProjectItem) {
         this.selectedProjectItem = projectItem;
         this.selectedProjectItemController = projectItem.controller;
         //if (!this.selectedProjectItemController.IsModelBind) {
         this.selectedProjectItemController.Bind({ miningModel: this.miningModel, model: projectItem });
         // }
     } */
    public LoadProjects(): void {
        const session_id = Services.StateService.GetSessionId();
        Services.ProjectService.GetProjects(session_id).then(projects => {
            console.log('Load Project :', projects);

            this.projects = projects;
            this.ForceUpdate();
        });
    }


    private LoadDesktopView() {
        return DesktopView({
            project: this.project,
            miningModel: this.miningModel,
            /*    selectedProjectItems: this.selectedProjectItems,
               selectedProjectItem: this.selectedProjectItem, */
            selectedProjectItemController: this.selectedProjectItemController,
            NewProjectItemAction: this.OnNewProjectItem.bind(this),
            ProjectItemSelectedAction: () => alert()
        });
    }

    private TestZStack(): UIView {
        return UIScene(
            UIButton(
                Text('Test')
            )
                .background(
                    ZStack(
                        RoundedRectangle().background('yellow').cornerRadius('8px'),
                    )
                )
        );
    }
    public override LoadView() {
        if (this.DataBinded) {
            return (
                UIScene(
                    TwoColumnWithHeaderLayout({
                        header: [
                            ProjectModelPageHeader(this.project?.project_name, this.miningModel?.model_name, this.eventCount, this.caseCount, this.miningModels,
                                (value) => this.OnMiningModelChanged(value), this.menu, this.modelMenu, queryMenu)
                        ],
                        left: [
                            VStack({ spacing: 5 })(
                                HStack({ spacing: 10 })(
                                    VStack({ spacing: 10 })(
                                        Text('100%'),
                                        Spacer(),
                                        RoundedRectangle()
                                            .width(40)
                                            .height().initial({ height: '0%' }).animate({ height: '100%' }).__transition({ duration: 2 })
                                            .background('#14A9D5').cornerRadius(5).shadow('rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;'),
                                        VStack(
                                            Text('Process').textTransform('uppercase'),
                                            Text('31.123').textTransform('uppercase').fontSize('12px')
                                        ).height()
                                    ),
                                    VStack({ spacing: 10 })(
                                        Text('100%'),
                                        Spacer(),
                                        RoundedRectangle().width(40)
                                            .height().initial({ height: '0%' }).animate({ height: '100%' }).__transition({ delay: 1, duration: 2 })
                                            .background('rgb(59,210,115)').cornerRadius(5).shadow('rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;'),
                                        VStack(
                                            Text('Model').textTransform('uppercase'),
                                            Text('31.123').textTransform('uppercase').fontSize('12px')
                                        ).height()
                                    ),
                                    VStack({ spacing: 10 })(
                                        Text('100%'),
                                        Spacer(),
                                        RoundedRectangle().width(40)
                                            .height().initial({ height: '0%' }).animate({ height: '100%' }).__transition({ delay: 2, duration: 2 })
                                            .background('rgb(250,112,3)').cornerRadius(5).shadow('rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;'),
                                        VStack(
                                            Text('Query').textTransform('uppercase'),
                                            Text('31.123').textTransform('uppercase').fontSize('12px')
                                        ).height()
                                    )
                                ).height(500).width(200).padding(20).visible(true),

                                //Project Title
                                HStack(
                                    Text('Project Items')
                                        .font(Fonts.title3)
                                        .padding('8px')
                                        .fontWeight('bold')
                                        .foregroundColor('black')
                                ).height('auto').visible(false),
                                // Poject items list view
                                ListView(
                                    /*  ...ForEach(this.selectedProjectItems)((projectItem: MVIProjectItem) =>
                                         Case<ListViewItemClass>(projectItem.type, {
                                             'Dataset': DatasetListView(projectItem),
                                             'Dashboard': DashboardListView(projectItem)
                                         })
                                             .borderBottom('solid 1px rgb(200,200,200,10%)')
                                             .cornerRadius('5px')
                                             .transition('all 0.35s')
                                             .shadow(this.selectedProjectItem?.project_item_id === projectItem.project_item_id ? 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' : '')
                                             .background(this.selectedProjectItem?.project_item_id === projectItem.project_item_id, 'rgb(255,255,255,50%)', 'rgb(255,255,255,10%)')
                                             .onSelected(() => ProjectItemSelectedAction(projectItem))
                                     ) */

                                ).width('200px').background('rgb(255,255,255,10%)').grow(),
                                // Project items buttons
                                HStack({ alignment: cCenter, spacing: 5 })(
                                    /*    ListFooterButton('\\e145').action(() => NewProjectItemAction()),
                                       ListFooterButton('\\effd'),
                                       ListFooterButton('\\f04a'),
                                       ListFooterButton('\\f0bb') */
                                ).height('auto').width('100%')
                            )
                                .visible(false)
                        ],
                        right: [
                            VStack(
                                /*  this.TestTabView(), */
                                this.selectedProjectItemController
                            ).grow()
                        ],
                        /*  footer: [
                             Text('Test').fontSize('24px')
                         ] */
                    })
                )
            )
        } else {
            return (
                UIScene(
                    Spinner()
                )
            )
        }

    }
}

export function MiningModelController(appController: AppControllerClass, project: IProjectModel, miningModel: IMiningModelModel): MiningModelControllerClass {
    return new MiningModelControllerClass().SetParentAppController(appController).Bind({ project, miningModel });
}