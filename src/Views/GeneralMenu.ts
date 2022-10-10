import { HStack, UIContextMenu, ForEach, Text } from '@tuval/forms';

const menuModel = [
    {
        name: 'Project'
    }
]
/* export const GeneralMenu = () => {
    HStack(
        UIContextMenu(
            ...ForEach(menuModel)(item =>
                Text(item.name).onClick(() => alert(''))
            )
        )(
            RegularText(model_name).whiteSpace('nowrap')
        )
            .cornerRadius(5)
            .padding(cHorizontal, 5).cursor('pointer')
            .border('dotted 1px var(--sub-border-color)'),
    )
} */