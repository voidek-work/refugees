import { Shifts } from '@prisma/client';
import {
  UseFormRegister,
  Control,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
import { CellProps } from 'react-table';

export type TableShiftCellProps = CellProps<Shifts> & {
  register: UseFormRegister<{ table: Shifts[] }>;
  isLoading: IsLoading;
  setIsLoading: SetIsLoading;
  updateMyData: Function;
  control: Control<{ table: Shifts[] }>;
  save: SaveFn;
  getValues: UseFormGetValues<{ table: Shifts[] }>;
  setValue: UseFormSetValue<{ table: Shifts[] }>;
};

export type IsLoading = { [key: string]: boolean };
export type SetIsLoading = (isLoading: IsLoading) => void;
export type SaveFn = (
  params: Partial<TableShiftCellProps> & { shift: Partial<Shifts> }
) => void;
