import { Shifts } from '@prisma/client';
import React, { FC } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { CellProps } from 'react-table';

// Create an editable cell renderer
export const InputCell: FC<
  CellProps<Shifts> & {
    updateMyData: Function;
    register: UseFormRegister<Shifts>;
  }
> = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
  register,
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e: any) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      // value={value}
      // onChange={onChange}
      // onBlur={onBlur}
      // @ts-ignore
      {...register(`table.${index}.${id as FieldPath<Shift>}`)}
      title={value}
      type='text'
      className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md `}
    />
  );
};
