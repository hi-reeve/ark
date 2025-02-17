import type { CellProps } from '@zag-js/date-picker'
import { createContext } from '../create-context'

export const [DatePickerCellProvider, useDatePickerCellContext] = createContext<CellProps>({
  hookName: 'useDatePickerCellContext',
  providerName: '<DatePickerCellProvider />',
})
