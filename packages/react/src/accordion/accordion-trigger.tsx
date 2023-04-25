import { mergeProps } from '@zag-js/react'
import { forwardRef, type ReactNode } from 'react'
import { ark, type WithAsChildProps } from '../factory/factory'
import { useAccordionContext } from './accordion-context'
import { useAccordionItemContext } from './accordion-item-context'

export type AccordionTriggerProps = WithAsChildProps<{ children: ReactNode }>

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger(props, ref) {
    const { getTriggerProps } = useAccordionContext()
    const accordionItem = useAccordionItemContext()
    const mergedProps = mergeProps(getTriggerProps(accordionItem), props)
    return <ark.button {...mergedProps} ref={ref} />
  },
)
