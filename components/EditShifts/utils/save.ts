import { Shifts } from '@prisma/client';
import debounce from 'debounce';
import {
  prepareClientDates,
  prepareServerDates,
} from '../../../shared/prepareDates';
import { Shift } from '../../AddShift';
import { IsLoading, SetIsLoading, TableShiftCellProps, SaveFn } from './types';

export const save: SaveFn = ({
  row,
  setIsLoading,
  isLoading,
  shift,
  updateMyData,
  setValue,
}) => {
  if (
    !row ||
    !setIsLoading ||
    !isLoading ||
    !shift ||
    !updateMyData ||
    !setValue
  ) {
    throw Error(
      JSON.stringify({
        row,
        setIsLoading,
        isLoading,
        shift,
        updateMyData,
        setValue,
      })
    );
  }

  const { index } = row;

  setIsLoading({ ...isLoading, [shift.id!]: true });
  const { countOfPassenger, direction } = shift;

  delete shift.userId;

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...prepareClientDates(shift, [
        'dateStart',
        'dateEnd',
        'createdAt',
        'updatedAt',
        'user.dateOfBirthday',
      ]),
      countOfPassenger: Number(countOfPassenger),
      direction: direction && direction.length > 0 ? direction : [],
    }),
  };
  try {
    fetch(`/api/shift/${shift.id}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        const preparedData = prepareClientDates(data, [
          'dateStart',
          'dateEnd',
          'createdAt',
          'updatedAt',
          'user.dateOfBirthday',
        ]);

        setIsLoading({ ...isLoading!, [shift.id!]: false });
        updateMyData(index, preparedData);
        setValue(`table.${index}`, preparedData as Shift);
      });
  } catch (e) {
    setIsLoading({ ...isLoading, [shift.id!]: false });
    return console.log(e);
  }
};

export const debouncedSave = debounce(save, 2000);
