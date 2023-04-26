import { mergeProps } from '@zag-js/react'
import type { HTMLArkProps } from '../factory/factory'
import { ark, forwardRef } from '../factory/factory'
import { useAccordionContext } from './accordion-context'
import { useAccordionItemContext } from './accordion-item-context'

export type AccordionTriggerProps = HTMLArkProps<'button'>

export const AccordionTrigger = forwardRef<'button'>(function AccordionTrigger(props, ref) {
  const { getTriggerProps } = useAccordionContext()
  const accordionItem = useAccordionItemContext()
  const mergedProps = mergeProps(getTriggerProps(accordionItem), props)
  return <ark.button {...mergedProps} ref={ref} />
})
