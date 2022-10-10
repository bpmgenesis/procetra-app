import { Button, FileUpload, TForm, TTabPage, View, TApplication, ApplicationModes, Desktop } from '@tuval/forms';
import { AppController } from './App/Controllers/AppController';
import { Resources } from './Resources';
//import { AppController } from './domains/Application/Controllers/AppController';



declare var Viz;
declare var createjs;



@View
export class MainView extends TForm {

    public override InitComponents() {
        this.Width = 1300;
        this.Height = 700;
        this.Name = 'ProcessMaining::MainForm';
        //this.Text = 'Procetra';
        this.Icon = Resources.Icons.ApplicationIcon;

        this.HeaderColor = 'rgb(255,255,255, 20%)';

        const testController = new AppController();
        this.Controls.Add(testController);
       // testController.LoadRecentFiles();
       // testController.RequestDesktop.add(() => this.TopMaximize());


        // testController.LoadProjects();
        /*   const button = new TestButton();
          button.Text = 'Test';
          this.Controls.Add(button);
          setTimeout(()=> button.ShowText(),10000); */

        this.TopMaximizeChanged.add(topMaximized => {

            if (topMaximized) {
                TApplication.ApplicationMode = ApplicationModes.Portal;
            } else {
                TApplication.ApplicationMode = ApplicationModes.Desktop;
            }
        });
    }

    public OnShown(): void {
        if (TApplication.IsPortal) {
            setTimeout(() => this.TopMaximize(), 10);
        }
    }
}