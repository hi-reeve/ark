import { combineProps } from '@kobalte/utils'
import { type JSX } from 'solid-js'
import { useAccordionContext } from './accordion-context'
import { useAccordionItemContext } from './accordion-item-context'
import { ark, type WithAsChildProps } from './factory'

export type AccordionTriggerProps = WithAsChildProps<{ children: JSX.Element }>

export const AccordionTrigger = (props: AccordionTriggerProps) => {
  const accordion = useAccordionContext()
  const itemProps = useAccordionItemContext()
  const mergedProps = combineProps(accordion().getTriggerProps(itemProps), props)
  return <ark.button {...mergedProps} />
}
