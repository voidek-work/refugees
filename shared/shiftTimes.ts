import add from 'date-fns/add';
import set from 'date-fns/set';

export const dateNight = set(new Date(), {
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
});
export const dateMorning = set(new Date(), {
  hours: 8,
  minutes: 30,
  seconds: 0,
  milliseconds: 0,
});
export const dateEvening = set(new Date(), {
  hours: 19,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
});
export const dateNightNext = add(dateNight, { days: 1 });
