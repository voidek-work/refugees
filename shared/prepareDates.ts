import { get as getProp, set as setProp } from 'object-path';

export const prepareServerDates = (obj: { [key: string]: any }) => {
  if (!obj) {
    return obj;
  }
  const shallowCopy = { ...obj };
  Object.entries(obj).forEach(([key, val]) => {
    if (val && val.getTime) {
      shallowCopy[key] = val.getTime();
    } else if (val && typeof val === 'object') {
      shallowCopy[key] = prepareServerDates(val);
    }
  });

  return shallowCopy;
};

export const prepareClientDates = (
  obj: { [key: string]: any },
  dateFields: string[]
) => {
  if (!obj || !dateFields) {
    return obj;
  }
  const shallowCopy = { ...obj };

  dateFields.forEach((key) => {
    setProp(shallowCopy, key, new Date(getProp(shallowCopy, key)));
  });

  return shallowCopy;
};
