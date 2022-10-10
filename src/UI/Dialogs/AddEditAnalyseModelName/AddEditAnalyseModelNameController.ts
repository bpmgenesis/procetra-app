import { Binding, cLeading, cTopLeading, Dialog, HStack, UIController, UIScene, UIView, VStack, $ } from '@tuval/forms';

import { AcceptButton, CancelButton } from '../../Views/Buttons';
import { RegularTextBox } from '../../Views/RegularTextBox';
import { RegularText } from '../../Views/Texts';


export class AddEditAnalyseModelNameDialog extends Dialog {
    private openProjectDialogController: AddEditAnalyseModelNameController;

    public override InitComponents() {
        this.Text = 'New Analyse Model';
        this.Width = 600;
        this.Height = 230;

        this.openProjectDialogController = new AddEditAnalyseModelNameController();
        this.openProjectDialogController.Bind(this);
        this.Controls.Add(this.openProjectDialogController);
    }

    public override OnShown(): void {

    }
    public OnOKClick(value: string) {
        this.ShowDialogAsyncResolve(value);
        this.Hide();
    }

    public OnCancel() {
        this.Hide();
    }
}
class AddEditAnalyseModelNameController extends UIController {

    private dialog: AddEditAnalyseModelNameDialog;

    @Binding()
    private txtName: string;

    public OnBindModel(dialog: AddEditAnalyseModelNameDialog) {
        this.dialog = dialog;
    }
    public LoadView(): UIView {
        return (
            UIScene(
                VStack({ spacing: 10 })(
                    HStack({ alignment: cLeading, spacing: 5 })(
                        // Icon('\\d1fe').size(24).foregroundColor('#263238'),
                        RegularText('New Mining Model').fontSize(20).fontFamily("'Source Sans Pro', Arial, sans-serif")
                    ).minHeight('64px').maxHeight('64px').background('#eceff1').foregroundColor('#263238').paddingLeft('10px'),
                    VStack({ alignment: cTopLeading, spacing: 20 })(
                        VStack(
                            RegularTextBox({ icon: '\\d1fd', value: $(this.txtName), autofocus: true }),
                        ).height(), //auto

                        // Select Repository Button
                        //SelectButton('Select Repository'),

                        HStack(
                            CancelButton('Cancel').action(() => this.dialog.OnCancel()),
                            AcceptButton('OK').action(() => this.dialog.OnOKClick(this.txtName))
                        )
                    ).padding(10)
                )
            )
        )
    }
}