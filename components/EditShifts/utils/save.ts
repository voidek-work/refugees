import { Shifts } from '@prisma/client';
import debounce from 'debounce';
import { IsLoading, SetIsLoading } from './types';

export const save = (
  shift: Partial<Shifts>,
  isLoading: IsLoading,
  setIsLoading: SetIsLoading
) => {
  console.log(setIsLoading);

  setIsLoading({ ...isLoading, [shift.id!]: true });
  const { dateStart, dateEnd, countOfPassenger } = shift;
  delete shift.createdAt;
  delete shift.updatedAt;
  delete shift.userId;

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...shift,
      countOfPassenger: Number(countOfPassenger),
      dateStart: new Date(dateStart!),
      dateEnd: new Date(dateEnd!),
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
