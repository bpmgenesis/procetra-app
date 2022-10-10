import { UIController, UIView, UIScene, Spinner, VStack, cLeading, HStack, Icon, cTopLeading, cTrailing, Text, Color, State, UIProgressBar } from '@tuval/forms';
import { mapping } from '../../UI/Dialogs/UploadDataDialog/Models/MapModels';
import { foreach, int } from '@tuval/core';
import { IProjectModel, Services, MiningBrokerClient, PageButton } from '@procetra/common';
import { RegularText } from '../../UI/Views/Texts';
import { Steps } from '../../UI/Dialogs/UploadDataDialog/Views/Steps';
import { CancelButton, AcceptButton } from '../../UI/Views/Buttons';



export class UploadFileController extends UIController {

    @State()
    private fileContent: string;

    @State()
    private mappingName: string;

    @State()
    private mappingFileName: string;

    @State()
    private project: IProjectModel;

    @State()
    private gridHeaders: any[];

    private mapping: mapping = { mapping: {} } as any;

    @State()
    private progress: int;

    protected BindRouterParams({ gridHeaders, project, mappingName, mappingFileName, fileContent }) {
        this.project = project;
        this.gridHeaders = gridHeaders;
        this.mappingName = mappingName;
        this.mappingFileName = mappingFileName;
        this.fileContent = fileContent;
        this.progress = 10;

        this.action_OnPrepareColumnMapping();

    }

    private action_OnPrepareColumnMapping() {
        debugger;
        this.mapping.mapping.case_id = [];
        this.mapping.mapping.event_id = [];
        this.mapping.mapping.resource_id = [];
        this.mapping.mapping.cost_id = [];

        this.mapping.mapping.case_attributes = [];
        this.mapping.mapping.event_attributes = [];

        foreach(this.gridHeaders, header => {
            if (header.mappedData != null) {
                if (header.mappedData === 'Case ID') {
                    this.mapping.mapping.case_id.push({
                        title: header.key,
                        index: 0
                    })
                } else if (header.mappedData === 'Activity') {
                    this.mapping.mapping.event_id.push({
                        title: header.key,
                        index: 0
                    })
                } else if (header.mappedData === 'Start Timestamp') {
                    this.mapping.mapping.start_timestamp = {
                        title: header.key,
                        index: 0,
                        dateFormat: {
                            type: "date",
                            format: "YYYY-M-D H:m:s.SSSS",
                            timeZone: false
                        }
                    }
                } else if (header.mappedData === 'End Timestamp') {
                    this.mapping.mapping.end_timestamp = {
                        title: header.key,
                        index: 0,
                        dateFormat: {
                            type: "date",
                            format: "YYYY-M-D H:m:s.SSSS",
                            timeZone: false
                        }
                    }
                } else if (header.mappedData === 'Other Timestamp') {
                    this.mapping.mapping.other_timestamp = {
                        title: header.key,
                        index: 0,
                        dateFormat: {
                            type: "date",
                            format: "YYYY-M-D H:m:s.SSSS",
                            timeZone: false
                        }
                    }
                } else if (header.mappedData === 'Resource') {
                    this.mapping.mapping.resource_id.push({
                        title: header.key,
                        alias: header.key,
                        index: 0
                    })
                } else if (header.mappedData === 'Cost') {
                    this.mapping.mapping.cost_id.push({
                        title: header.key,
                        alias: header.key,
                        index: 0
                    })
                } else if (header.mappedData === 'Case Attribute') {
                    this.mapping.mapping.case_attributes.push({
                        title: header.key,
                        alias: header.key,
                        index: 0
                    })
                } else if (header.mappedData === 'Event Attribute') {
                    this.mapping.mapping.event_attributes.push({
                        title: header.key,
                        alias: header.key,
                        index: 0
                    })
                }
            }
        })

        console.log(this.mapping);
        const session_id = Services.StateService.GetSessionId();

        Services.ProjectService.CreateMapping(this.project.project_id,
            this.mappingName,
            this.mappingFileName,
            JSON.stringify(this.mapping.mapping)).then(() => {
                this.progress = 10;

                MiningBrokerClient.ImportCsvFile(this.project.project_id, this.fileContent, this.mapping.mapping.case_id.map(item => item.title).join(';'), this.mapping.mapping.event_id.map(item => item.title).join(';'),
                    this.mapping.mapping.start_timestamp.title, this.mapping.mapping.end_timestamp.title, '', '').then(() => {
                        this.progress = 60;
                        MiningBrokerClient.LoadEventData(this.project.project_id).then(() => {
                            MiningBrokerClient.GetHappyPath(this.project.project_id).then((info: any[]) => {
                                console.log(info);
                                this.progress = 100;
                            });
                        });
                    });

            });



    }

    public LoadView(): UIView {
        console.log('Render View -----------------')
        return (
            UIScene(
                this.gridHeaders == null ? Spinner() :
                    VStack({ alignment: cTopLeading })(
                        HStack({ alignment: cLeading, spacing: 5 })(
                            Icon('\\e241').size(24).foregroundColor('#263238'),
                            RegularText(`Uploadin ${this.mappingFileName} > ${this.project.project_name}`).fontSize(20)
                        ).minHeight('64px').maxHeight('64px').background('#eceff1').foregroundColor('#263238').paddingLeft('10px'),
                        Steps(['Select File', 'Map Columns', 'Upload File', 'Data Analysis'], 2),
                        VStack({ alignment: cTopLeading })(
                            Text('Your file uploading, please wait.'),
                            HStack(
                                UIProgressBar(value =>
                                    HStack({ spacing: 5 })(
                                        Text(value.toString() + '%'),
                                        Text('Processing')
                                            .foregroundColor('#777')
                                    )
                                        .position({ before: 'absolute' })
                                        .content({ before: "''" })
                                        .left({ before: 'calc(50% - 10px)' })
                                        .bottom({ before: '-5px' })
                                        .height({ before: '0' })
                                        .borderLeft({ before: 'solid transparent 10px' })
                                        .borderRight({ before: 'solid transparent 10px' })
                                        .borderTop({ before: 'solid #222 5px' })
                                        .cornerRadius(10)
                                        .opacity(.85)
                                        .background('#222')
                                        .height(40)
                                        .width(130)
                                        .padding(5)
                                        .fontSize(16)

                                )
                                    // ProgressBar
                                    .labelOffset(-45)
                                    .value(this.progress)
                                    .height(10)
                            ).height(),
                        ).padding(),
                        HStack({ alignment: cTrailing })(
                            CancelButton('Cancel'),
                        ).height().padding()
                    )
            ).background(Color.white)
        )
    }
}