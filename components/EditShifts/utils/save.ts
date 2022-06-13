import { Shifts } from '@prisma/client';
import debounce from 'debounce';
import { prepareClientDates } from '../../../shared/prepareDates';
import { IsLoading, SetIsLoading } from './types';

export const save = (
  shift: Partial<Shifts>,
  isLoading: IsLoading,
  setIsLoading: SetIsLoading
) => {
  console.log(setIsLoading);

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
    fetch(`/api/shift/${shift.id}`, requestOptions).then((data) => {
      // TODO: set to form
      setIsLoading({ ...isLoading, [shift.id!]: false });
    });
  } catch (e) {
    setIsLoading({ ...isLoading, [shift.id!]: false });
    return console.log(e);
  }
};

export const debouncedSave = debounce(save, 2000);
