import { combineProps } from '@kobalte/utils'
import { useAccordionContext } from './accordion-context'
import { useAccordionItemContext } from './accordion-item-context'
import { ark, type HTMLArkProps } from './factory'

export type AccordionTriggerProps = HTMLArkProps<'button'>

export const AccordionTrigger = (props: AccordionTriggerProps) => {
  const accordion = useAccordionContext()
  const itemProps = useAccordionItemContext()
  const mergedProps = combineProps(accordion().getTriggerProps(itemProps), props)
  return <ark.button {...mergedProps} />
}
