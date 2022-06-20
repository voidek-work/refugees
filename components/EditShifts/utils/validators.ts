import * as Yup from 'yup';

export const validationSchemaShifts = Yup.object().shape({
  table: Yup.array().of(
    Yup.object().shape({
      dateStart: Yup.string(),
      dateEnd: Yup.string(),
      isDriver: Yup.string(),
      countOfPassengerTo: Yup.number(),
      countOfPassengerBack: Yup.number(),
      city: Yup.string(),
      name: Yup.string(),
      phone: Yup.string(),
      telegramName: Yup.string(),
      telegramNameDriverTo: Yup.string(),
      telegramNameDriverBack: Yup.string(),
    })
  ),
});
