// @mui
import { DialogProps } from '@mui/material';

// ----------------------------------------------------------------------

export interface ConfirmDialogProps extends Omit<DialogProps, 'title'> {
  title: string;
  content?: any;
  action: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
}
