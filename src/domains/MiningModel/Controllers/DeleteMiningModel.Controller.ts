import { UIController, Text, HStack, VStack, cTop, Spinner, State, Button, Typography, Spacer } from '@tuval/forms';
import { MiningBrokerClient, GetAnalyseModelsResponse, FormView } from '@procetra/common';
export class DeleteMiningModelController extends UIController {

    @State()
    private model: GetAnalyseModelsResponse;

    @State()
    private deleting: boolean;

    protected BindRouterParams({ project_id, model_id }) {
        MiningBrokerClient.GetAnalyseModelById(project_id, model_id).then(model => {
            this.model = model;
        })
    }

    private action_DeleteModel() {
        this.deleting = true;
        MiningBrokerClient.DeleteAnalyseModelById(this.model.project_id, this.model.model_id).then(status => {
            //alert(status);
            this.navigotor('/app(procetra)/project/' + this.model.project_id)
        })
    }

    private view_Content() {
        return (
            this.model == null ? Spinner() :
                HStack(
                    VStack({ alignment: cTop })(
                        Typography({ variant: "h2" })('Delete Model'),
                        Text(`You are about to delete the **${this.model.model_name}** named model. Press the delete button below to complete the process.`)
                            .render(2),
                        Spacer(),
                        Button({ color: 'danger' })(
                            Text(this.deleting ? 'Deleting' : 'Delete')
                        )
                            .width(200)
                            .loading(this.deleting)
                            .onClick(() => this.action_DeleteModel())

                    )
                        .padding()
                        .maxWidth(600).height(400)
                        .border('solid 1px gray')
                        .cornerRadius(10)
                )
        )
    }
    public LoadView() {
        return (
            FormView({
                content: this.view_Content()
            })

        )
    }

}