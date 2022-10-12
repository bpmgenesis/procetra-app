import { State, Text, UIController, VStack } from "@tuval/forms";
import { SelectAnalysisView, IProjectModel, MiningBrokerClient, ProjectMainMenu } from '@procetra/common';


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
           VStack(
            ProjectMainMenu(this,this.project, 'Process Overview', this.eventCount ?? 0, this.caseCount ?? 0, [], () => alert(''), this.menu, [], []),
            SelectAnalysisView(this.project)
           )
            
        )
    }
}