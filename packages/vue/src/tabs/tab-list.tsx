import { defineComponent } from 'vue'
import { ark, type HTMLArkProps } from '../factory'
import { getValidChildren, type ComponentWithProps } from '../utils'
import { useTabsContext } from './tabs-context'

export type TabListProps = HTMLArkProps<'div'>

export const TabList: ComponentWithProps<TabListProps> = defineComponent({
  name: 'TabList',
  setup(_, { slots, attrs }) {
    const api = useTabsContext()

    return () => (
      <ark.div {...api.value.tablistProps} {...attrs}>
        {() => getValidChildren(slots)}
      </ark.div>
    )
  },
})
