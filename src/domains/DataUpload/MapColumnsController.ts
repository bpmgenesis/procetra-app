import { Convert, is, foreach } from '@tuval/core';
import {
    HStack, cLeading, ForEach, Icon, UIView, VStack, cTopLeading, Cache, UIController, State, IUploadFileReady, UIScene, TextField, Text, ScrollView, IconLibrary,
    RenderingTypes, DropDown
} from '@tuval/forms';
import { RegularText } from '../../UI/Views/Texts';
import { CvsToJson } from '../../utils/csv2json';
import { GridRow, IGridColumn } from '../../modules/Statistics/Views/CasesGrid';
import { IProjectModel, PageButton } from '@procetra/common';
import { Spinner, Color, cTrailing } from '@tuval/forms';
import { Steps } from '../../UI/Dialogs/UploadDataDialog/Views/Steps';
import { AcceptButton, CancelButton } from '../../UI/Views/Buttons';

export const mapTypesModel = [
    {
        name: 'Case ID',
        color: '#CB5A25',
        foreColor: 'white'
    },
    {
        name: 'Activity',
        color: '#CB5A25',
        foreColor: 'white'
    },
    {
        name: 'Start Timestamp',
        color: '#2CA02C',
        foreColor: 'white'
    },
    {
        name: 'End Timestamp',
        color: '#2CA02C',
        foreColor: 'white'
    },
    {
        name: 'Other Timestamp',
        color: '#2CA02C',
        foreColor: 'white'
    },
    {
        name: 'Resource',
        color: '#9467BD',
        foreColor: 'white'
    },
    {
        name: 'Cost',
        color: '#9467BD',
        foreColor: 'white'
    },
    {
        name: 'Event Attribute',
        color: '#9467BD',
        foreColor: 'white'
    },
    {
        name: 'Case Attribute',
        color: '#9467BD',
        foreColor: 'white'
    },
    {
        name: 'Ignore Column',
        color: '#9467BD',
        foreColor: 'white'
    }
]


const infoText = `
To upload data you must first map the fields (columns) of your data file.
+ Map __required fields__ (Case ID, Timestamp and Event Name) by dragging the corresponding label to the desired column
+ Map __optional fields__ (columns) that you want to use for filtering your cases by dragging the New Attribute label to the desired column.
+ Once you have completed your mapping press the 'Confirm and start upload' button.
`;

interface IMapColumn extends IGridColumn {
    mappedData: any;
}


export function MapGridHeader(columnInfo: IMapColumn[]) {
    const width = Convert.ToInt32(100 / columnInfo.length);
    return (
        HStack({ alignment: cLeading })(
            ...ForEach(columnInfo)(cInfo =>
                HStack({ alignment: cLeading })(
                    RegularText(cInfo.title)
                        .fontFamily("'Source Sans Pro', Arial, sans-serif")
                        .fontSize('18px')
                        .fontWeight('500')
                        .foregroundColor('#1A1A1A')
                        //.textTransform('uppercase')
                        .whiteSpace('nowrap')
                        .width('80%')
                        .textOverflow('ellipsis')
                        .padding('0 10px')
                        .borderRight('2px solid transparent'),
                    cInfo.mappedData && Icon('\\e3c9').size(20).cursor('pointer').onClick(() => console.log('e')/* ProjectUIService.MapColumnSettingsDialog() */),
                )
                    .width()
                    .minWidth(is.number(cInfo.width) ? `${cInfo.width}px` : width + '%')

            )
        ).height(40).borderBottom('2px solid #e4e4e4')
    )
}

export function MapColumnsGrid(columns, data, onSelectedRow: Function): UIView {
    return (

        VStack({ alignment: cTopLeading })(
            MapGridHeader(columns),
            Cache(true, () =>
                VStack({ alignment: cTopLeading })(
                    ...ForEach(data)((row =>
                        GridRow(columns, row, onSelectedRow)
                    ))
                ).useCache(true)
            )
        ).alias('Merhaba')

    )
}

export class MapColumnsController extends UIController {

    @State()
    private project: IProjectModel;

    @State()
    private fileName: string;

    @State()
    private fileExt: string;

    @State()
    private fileContent: string;

    private csv: string;

    @State()
    private csvData: any[];

    @State()
    public gridHeaders: IMapColumn[];

    @State()
    public selectedItemMe: any;

    public mappingFileName: string;
    public mappingName: string;

    @State()
    private selectedItem: any;

    protected InitController() {

    }

    public BindRouterParams({ project, file_name, file_ext, content }: { project: IProjectModel, file_name: string, file_ext: string, content: string }) {
        this.BeginUpdate();
        this.project = project;
        this.fileName = file_name;
        this.fileExt = file_ext;
        this.fileContent = content;

        const headers: IMapColumn[] = [];
        debugger;
        this.csv = content;
        this.csvData = CvsToJson.Convert(this.csv, { parseNumbers: true });
        this.mappingFileName = file_name + '.' + file_ext;
        this.mappingName = this.mappingFileName;

        const keys = Object.keys(this.csvData[0]);
        foreach(keys, (key) => {
            headers.push({
                key: key,
                title: key,
                width: 210,
                mappedData: null
            })
        });

        this.gridHeaders = headers;

        this.EndUpdate();

    }

    private onColumnMapped(column: any, selectedItem: any) {
        column.mappedData = selectedItem;
        this.gridHeaders = [...this.gridHeaders];
        console.log(this.gridHeaders);
    }

    private view_Warning() {
        const [_, isCaseIDSelected, isActivitySelected, isEndDateSelected] = this.isMappingValid();
        return (
            HStack({ alignment: cLeading, spacing: 5 })(
                Icon('\\e88e').size(25),
                Text(`Please select ${!isCaseIDSelected ? '[Case ID] ' : ''} ${!isActivitySelected ? '[Activity name]' : ''}  ${!isEndDateSelected ? '[End Timestamp] ' : ''} `)
                    .fontSize(16)
            ).foregroundColor('#a03b3b')
        )
    }
    private isMappingValid() {
        let isCaseIDSelected = false;
        let isActivitySelected = false;
        let isEndDateSelected = false;
        foreach(this.gridHeaders, header => {
            switch (header.mappedData) {
                case 'Case ID':
                    isCaseIDSelected = true;
                    break;
                case 'Activity':
                    isActivitySelected = true;
                    break;
                case 'End Timestamp':
                    isEndDateSelected = true;
                    break;
            }
        })

        return [isCaseIDSelected && isActivitySelected && isEndDateSelected, isCaseIDSelected, isActivitySelected, isEndDateSelected];
    }

    private action_StartUpload() {
        this.navigotor('/app(procetra)/project/' + this.project.project_id + '/upload-file',
            {
                state: {
                    project: this.project,
                    gridHeaders: this.gridHeaders,
                    mappingName: this.fileName,
                    mappingFileName: this.fileName,
                    fileContent: this.fileContent,
                }
            });
    }

    private action_Cancel() {
        this.navigotor(`/app(procetra)/project/${this.project.project_id}/empty`, { state: { project: this.project } });
    }

    public LoadView(): UIView {
        console.log('Render View -----------------')
        return (
            UIScene(
                this.gridHeaders == null ? Spinner() :
                    VStack({ alignment: cLeading })(
                        HStack({ alignment: cLeading, spacing: 5 })(
                            Icon('\\e241').size(24).foregroundColor('#263238'),
                            RegularText('Upload data').fontSize(20)
                        ).minHeight('64px').maxHeight('64px').background('#eceff1').foregroundColor('#263238').paddingLeft('10px'),
                        Steps(['Select File', 'Map Columns', 'Upload File', 'Data Analysis'], 1),

                        // Container for text information
                        VStack({ alignment: cTopLeading, spacing: 10 })(
                            HStack({ alignment: cLeading, spacing: 10 })(
                                Icon('\\e2c6').size(35).foregroundColor('#33333399'),
                                RegularText('Map').fontSize(24).fontWeight('500').lineHeight('1.25em').foregroundColor('#333').fontFamily("'Source Sans Pro', Arial, sans-serif"),
                                HStack(
                                    TextField().fontSize('1rem')
                                        .backgroundColor('transparent')
                                        .foregroundColor('#495057')
                                        .padding('0.75rem 0.75rem 0.75rem 0rem')
                                        .value(this.mappingFileName)
                                        .onTextChange((text) => { this.mappingName = text }),
                                    Icon('\\e3c9')
                                        .size(20)
                                        .paddingRight('10px')
                                        .paddingLeft('10px'),
                                )
                                    .width()
                                    .paddingRight('5px')
                                    .overflow('hidden')
                                    .borderBottom('1px solid #ced4da')
                                    //.shadow({ default: '', focus: '0 0 0 0.2rem #c7d2fe' })
                                    //.transition('background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s')
                                    //.backgroundColor('rgba(255,255,255,0.3)')
                                    .height()
                                    .tabIndex(0)
                            ).height(),
                            Text(infoText).render(RenderingTypes.Markdown).
                                fontFamily("'Source Sans Pro', Arial, sans-serif")
                                .fontSize('16px')
                                .lineHeight('1.5')
                        ).height().padding(),

                        // Container for data grid
                        VStack({ alignment: cTopLeading })(
                            ScrollView(
                                HStack({ alignment: cLeading, spacing: 10 })(
                                    ...ForEach(this.gridHeaders)(header =>
                                        HStack({ alignment: cLeading })(
                                            DropDown(option =>
                                                Text(option.name)
                                            )
                                                (option =>
                                                    HStack(
                                                        Text(option.name)
                                                    )
                                                        .padding(5)
                                                        .foregroundColor(Color.white)
                                                        .backgroundColor(option.color)
                                                )
                                                .fontSize('1rem')
                                                .placeholder('Click to map...')
                                                .model(mapTypesModel)
                                                .optionValue('name')
                                                .optionLabel('name')
                                                .value((header as any).mappedData)
                                                .backgroundColor((header as any).mappedData?.color)
                                                .foregroundColor((header as any).mappedData?.foreColor)
                                                .onSelected(item => this.onColumnMapped(header, item))
                                        ).width().minWidth('200px').border('2px dashed #e0e0e0').height(42).minHeight('18px').marginTop('8px').marginBottom('10px')
                                    )
                                ),
                                /*     DataTable()
                                      .columns(
                                         ...ForEach(this.gridHeaders)(item =>
                                             Column()
                                             .body(
                                                 Text(item.title)
                                             )
                                             .field(item.key)
                                             .header(item.title)
                                             .width(`${item.width}px`) as any
                                         )

                                     ).value(this.csvData.slice(0, 1000)) */
                                MapColumnsGrid(this.gridHeaders, this.csvData.slice(0, 5000), () => { })
                            )
                        ).padding(),
                        HStack({ alignment: cTrailing })(
                            this.view_Warning(),
                            CancelButton('Cancel').action(() => this.action_Cancel()),
                            AcceptButton('Start Upload', !this.isMappingValid()[0]).width(200).action(() => this.action_StartUpload())
                            //PageButton('Start Upload').width(200).action(() => this.action_StartUpload()),
                        ).height().padding()
                    )
            ).background(Color.white)
        )
    }
}