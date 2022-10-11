import { State, Text, UIController } from "@tuval/forms";
import { SelectAnalysisView, IProjectModel, MiningBrokerClient } from '@procetra/common';


export class SelectAnalysisModuleController extends UIController {
    @State()
    private project: IProjectModel;
    public override BindRouterParams({ project_id }) {
        MiningBrokerClient.GetProjectById(project_id).then(project => {
            this.project = project;
        });
    }

    public override LoadView() {
        return (
            Text('Select Module'),
            SelectAnalysisView(this.project)
        )
    }
}