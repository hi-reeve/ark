import * as editable from '@zag-js/editable'
import { normalizeProps, useMachine } from '@zag-js/react'
import { useId } from 'react'
import { useEnvironmentContext } from '../environment'
import { type Optional } from '../types'

export type UseEditableProps = Optional<editable.Context, 'id'> & {
  defaultValue?: editable.Context['value']
}
export type UseEditableReturn = ReturnType<typeof useEditable>

export const useEditable = (props: UseEditableProps) => {
  const getRootNode = useEnvironmentContext()
  const initialContext = {
    id: useId(),
    getRootNode,
    ...props,
    value: props.defaultValue,
  }

  const context = {
    ...initialContext,
    value: props.value,
  }

  const [state, send] = useMachine(editable.machine(initialContext), { context })
  return editable.connect(state, send, normalizeProps)
}
