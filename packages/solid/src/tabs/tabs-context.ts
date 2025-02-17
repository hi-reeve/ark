import { createContext } from '../create-context'
import { type UseTabsReturn } from './use-tabs'

export type TabsContext = UseTabsReturn

export const [TabsProvider, useTabsContext] = createContext<TabsContext>({
  hookName: 'useTabsContext',
  providerName: '<TabsProvider />',
})
