import { bindNavigate, bindState, UIRoute, UIRoutes, useEffect } from '@tuval/forms';
import { EmptyProjectControllerClass } from '../domains/EmptyProject/Controllers/EmptyProjectController';
import { HomeController } from '../domains/Home/Controllers/HomeController';
import { MiningModelController, MiningModelControllerClass } from '../domains/MiningModel/Controllers/MiningModelController';
import { ProjectControllerClass } from '../domains/Project/Controllers/ProjectController';
import { SelectUploadFileController } from '../domains/DataUpload/SelectUploadFileController';
import { MapColumnsController } from '../domains/DataUpload/MapColumnsController';
import { UploadFileController } from '../domains/DataUpload/UploadDataController';
import { theme } from '../theme/theme';
import { DeleteMiningModelController } from '../domains/MiningModel/Controllers/DeleteMiningModel.Controller';
import { ProcessOverviewController,OverviewController } from '@procetra/modules/processoverview';

export const Routes = () => {
    const [LoggedIn, setLoggedIn] = bindState(null);

    let navigate = bindNavigate();
    useEffect(() => {
        if (LoggedIn) {
            navigate("/app(procetra)/home");
            return () => setLoggedIn(false)
        }
    }, [LoggedIn]);

    setLoggedIn(true);

    return UIRoutes(
        UIRoute('/app(procetra)/home', HomeController),
        UIRoute('/app(procetra)/project/:project_id', ProjectControllerClass),
        UIRoute('/app(procetra)/project/:project_id/empty', EmptyProjectControllerClass),
        UIRoute('/app(procetra)/project/:project_id/select-file', SelectUploadFileController),
        UIRoute('/app(procetra)/project/:project_id/upload-file', UploadFileController),
        UIRoute('/app(procetra)/project/:project_id/upload-map-columns', MapColumnsController),
        UIRoute('/app(procetra)/project/:project_id/model/:model_id', MiningModelControllerClass),
        UIRoute('/app(procetra)/project/:project_id/model/:model_id/delete', DeleteMiningModelController),
        UIRoute(
            UIRoute('overview/:project_id', OverviewController),
        )('/app(procetra)/modules/process-overview', ProcessOverviewController),
    ).setTheme(theme)

}


