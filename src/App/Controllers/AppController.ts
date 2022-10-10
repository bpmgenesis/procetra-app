import { Color, Context, HStack, State, TForm, UIController, UIScene, VStack, UIImage, Text, PositionTypes } from '@tuval/forms';
import { Resources } from '../../Resources';

import { theme } from '../../Theme';
import { Routes } from '../../Views/Router';

export class AppController extends UIController {

    protected InitController() {

    }

    public LoadView() {
        return (
            UIScene(
                HStack(
                    VStack(
                        Routes()
                    )
                )
            )
        )

    }
}