import { defineComponent } from 'vue'
import { ark, type HTMLArkProps } from '../factory'
import { type ComponentWithProps } from '../utils'
import { useEditableContext } from './editable-context'

export type EditableLabelProps = HTMLArkProps<'label'>

export const EditableLabel: ComponentWithProps<EditableLabelProps> = defineComponent({
  name: 'EditableLabel',
  setup(_, { slots, attrs }) {
    const api = useEditableContext()

    return () => (
      <ark.label {...api.value.labelProps} {...attrs}>
        {slots.default?.()}
      </ark.label>
    )
  },
})
