
import { UIController, UIScene, UIView, UIStep, VStack, cTop, UIFileUpload, Text, HStack, cLeading, Icon, RoundedRectangle, cTrailing, ForEach, If, State, IUploadFileReady, cTopLeading, Color } from '@tuval/forms';

import { IProjectModel } from '@procetra/common';
import { MiningBrokerClient, Services } from '@procetra/common';
import { int, Event } from '@tuval/core';
import { FileSelected, SelectFileController } from '../../UI/Dialogs/UploadDataDialog/Controllers/SelectFileController';
import { MapColumnsController } from '../../UI/Dialogs/UploadDataDialog/Controllers/MapColumnsController';
import { RegularText } from '../../UI/Views/Texts';
import { Steps } from '../../UI/Dialogs/UploadDataDialog/Views/Steps';
import { AcceptButton, CancelButton } from '../../UI/Views/Buttons';


export class SelectUploadFileController extends UIController {

    @State()
    private project

    protected BindRouterParams({ project }) {
        this.project = project;
    }
    public action_OnFileSelected(fileInfo: IUploadFileReady) {
        console.log('/app(procetra)/project/' + this.project.project_id + '/upload-map-columns');
        this.navigotor('/app(procetra)/project/' + this.project.project_id + '/upload-map-columns', { state: { project: this.project, file_name: fileInfo.fileName, file_ext: fileInfo.fileExt, content: fileInfo.GetFileContentAsString() } });
    }
    public LoadView(): UIView {
        return (
            UIScene(
                VStack({ alignment: cTopLeading })(
                    VStack({ alignment: cLeading })(
                        HStack({ alignment: cLeading, spacing: 5 })(
                            Icon('\\e241').size(24).foregroundColor('#263238'),
                            RegularText('Upload data').fontSize(20)
                        ).minHeight('64px').maxHeight('64px').background('#eceff1').foregroundColor('#263238').paddingLeft('10px'),
                        Steps(['Select File', 'Map Columns', 'Upload File', 'Data Analysis'], 0),
                        VStack(
                            UIFileUpload(
                                VStack(
                                    VStack(
                                        Text('Drop file here').fontSize('24px').foregroundColor('#333').fontFamily("'Source Sans Pro', Arial, sans-serif")
                                    )
                                        .cursor('copy')
                                        .backgroundColor({ hover: '#f5f5f5' })
                                        .border('2px dashed #2baab5')
                                        .cornerRadius(10),
                                    RegularText('Browse Files').foregroundColor('#2baab5').fontSize('18px').fontWeight('bold').lineHeight('20px').cursor('pointer').padding(10).fontFamily("'Source Sans Pro', Arial, sans-serif")
                                )
                            )

                                .marginTop('10px')
                                .width(600)
                                .height(400).onFileReady((e) => { this.action_OnFileSelected(e) })
                        ),
                        HStack({ alignment: cTrailing })(
                            CancelButton('Cancel'),
                        ).height()
                    )
                ).background(Color.white)
            )
        )
    }
}