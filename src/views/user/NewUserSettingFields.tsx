import { useState, useEffect } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Box, Stack, Button, Divider } from '@mui/material';
import IconifyIcon from 'src/@core/components/icon'
import { RHFTextField } from '../../hooks/hook-form'

// ----------------------------------------------------------------------
type Props = {
  length: number;
};
// ----------------------------------------------------------------------

export default function NewUserSettingFields({ length }: Props) {
  // const { control, setValue, watch, resetField } = useFormContext();
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'settings',
  });
  const [fieldsAdded, setFieldsAdded] = useState(0);

  useEffect(() => {
    setFieldsAdded(0);
  }, [length, append]);

  const handleAdd = () => {
    append({});
    setFieldsAdded(fieldsAdded + 1);
  };

  const handleRemove = (index: number) => {
    remove(index);
    setFieldsAdded(fieldsAdded - 1);
  };

  return (
    <Box sx={{ pt: 3 }}>
      <Stack spacing={3}>
        {fields.map((item, index) => (
          <Stack key={item.id} spacing="1.5" width="100%">
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(4, 1fr)',
              }}
            >
              <RHFTextField name={`settings[${index}].selectFrom`} label="Select Start" size="small" />
              <RHFTextField name={`settings[${index}].selectEnd`} label="Select End" size="small" />
              <RHFTextField name={`settings[${index}].selectedColor`} label="Select Color" size="small" />
              <Button
                size="small"
                color="error"
                startIcon={<IconifyIcon icon='eva:trash-2-outline' />}
                onClick={() => handleRemove(index)}
              >
                Remove
              </Button>
            </Box>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ my: 3, borderStyle: 'dashed', mt: 4 }} />
      <Stack
        spacing={2}
        direction={{ xs: 'column-reverse', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <Button
          size="small"
          startIcon={<IconifyIcon icon='eva:plus-fill' />}
          onClick={handleAdd}
          sx={{ flexShrink: 0, mb: 4 }}
        >
          Add Routes
        </Button>
      </Stack>
    </Box>
  );
}
