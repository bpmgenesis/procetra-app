import { HStack, Icon, TextField, UIView, BindingClass } from '@tuval/forms';

export function RegularTextBox({ icon, value, autofocus }: { icon?: string, value: BindingClass<string>, autofocus?: boolean }): UIView {
    return (

        TextField().fontSize('1rem')
            .value(value.get())
            .foregroundColor('#495057')
            .padding('0.75rem 0.75rem 0.75rem 0rem')
            .onTextChange((text) => { value.set(text); })

    )
}