
import { cLeading, cTopLeading, cTrailing, HStack, IUploadFileReady, State, Text, Theme, UIController, UIFileUpload, UIScene, UIView, VStack } from '@tuval/forms';

import { ProjectMainMenu } from '@procetra/common';
import { Steps } from '../../UI/Dialogs/UploadDataDialog/Views/Steps';
import { CancelButton } from '../../UI/Views/Buttons';
import { RegularText } from '../../UI/Views/Texts';


export class SelectUploadFileController extends UIController {

    @State()
    private project

    protected BindRouterParams({ project }) {
        this.project = project;
    }
    public action_OnFileSelected(fileInfo: IUploadFileReady) {
        console.log('/app(procetra)/project/' + this.project.project_id + '/upload-map-columns');
        this.navigotor('/app(procetra)/project/' + this.project.project_id + '/upload-map-columns',
            {
                state:
                    { project: this.project, file_name: fileInfo.fileName, file_ext: fileInfo.fileExt, content: fileInfo.GetFileContentAsString() }
            });
    }
    public LoadView(): UIView {
        return (
            UIScene(
                VStack({ alignment: cTopLeading })(
                    ProjectMainMenu(this, this.project, 'Process Overview', [], () => alert(''), null, [], []),
                    VStack({ alignment: cLeading })(
                        Steps(['Select File', 'Map Columns', 'Upload File', 'Data Analysis'], 0),
                        VStack(
                            UIFileUpload(
                                VStack(
                                    VStack(
                                        Text('Drop file here').fontSize('24px').foregroundColor('#333').fontFamily("'Source Sans Pro', Arial, sans-serif")
                                    )
                                    .shadow({ default: '0px 3px 12px var(--application-border-color)', focus: '0 0 3px 1px #00c3ff' })
    
                                        .cursor('copy')
                                        .backgroundColor({default:Theme.secondaryBackgroundColor, hover: '#f5f5f5' })
                                        .border('2px dashed #2baab5')
                                        .cornerRadius(10),
                                    RegularText('Browse Files').foregroundColor('#2baab5').fontSize('18px').fontWeight('bold').lineHeight('20px').cursor('pointer').padding(10).fontFamily("'Source Sans Pro', Arial, sans-serif")
                                )
                            )
                               
                                .marginTop('10px')
                                .width(600)
                                .height(400)
                                .onFileReady((e) => { this.action_OnFileSelected(e) })
                        ),
                        HStack({ alignment: cTrailing })(
                            CancelButton('Cancel'),
                        ).height()
                    )
                )
            ).background(Theme.darkBackgroundColor)
        )
    }
}