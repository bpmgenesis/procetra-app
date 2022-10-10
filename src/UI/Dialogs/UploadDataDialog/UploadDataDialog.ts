import { Event } from '@tuval/core';
import { Dialog, ListBox } from '@tuval/forms';
import { IProjectModel } from '@procetra/common';
import { UploadDataDialogController } from './Controllers/UploadDataDialogController';

export class UploadDataDialog extends Dialog {
    public OkButtonClicked: any = new Event();

    private uploadDataDialogController: UploadDataDialogController;

    public override InitComponents() {
        this.Text = 'Open Project';
        this.Width = 1200;
        this.Height = 930;
    }

    public SetProject(project: IProjectModel) {
        this.uploadDataDialogController = new UploadDataDialogController();
        this.uploadDataDialogController.Bind(project);
        this.Controls.Add(this.uploadDataDialogController);
    }
    public override OnShown(): void {
        //this.uploadDataDialogController.LoadProjects();
    }

    private OnCancel() {
        this.Hide();
    }

    private OnOKClick() {
        this.ShowDialogAsyncResolve(/* this.projectList.SelectedItem.Tag */);
        this.OkButtonClicked(/* this.projectList.SelectedItem.Text */);
        this.Hide();
    }

}
