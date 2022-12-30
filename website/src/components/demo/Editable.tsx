import { Stack } from '@/panda/jsx'
import { editable } from '@/panda/recipes'
import {
  Editable,
  EditableArea,
  EditableCancelTrigger,
  EditableControl,
  EditableEditTrigger,
  EditableInput,
  EditablePreview,
  EditableSubmitTrigger,
} from '@ark-ui/react'
import { Button } from '../shared/Button'

export const DemoEditable = () => (
  <Editable
    activationMode="dblclick"
    placeholder="enter a value"
    defaultValue="Chakra"
    className={editable()}
  >
    {(state) => (
      <Stack gap="3">
        <EditableArea>
          <EditableInput />
          <EditablePreview />
        </EditableArea>
        <EditableControl>
          {state.isEditing ? (
            <Stack gap="3" direction="row">
              <EditableSubmitTrigger>
                <Button variant="primary" size="sm">
                  Save
                </Button>
              </EditableSubmitTrigger>
              <EditableCancelTrigger>
                <Button variant="secondary" size="sm">
                  Cancel
                </Button>
              </EditableCancelTrigger>
            </Stack>
          ) : (
            <EditableEditTrigger>
              <Button variant="secondary" size="sm">
                Edit
              </Button>
            </EditableEditTrigger>
          )}
        </EditableControl>
      </Stack>
    )}
  </Editable>
)
