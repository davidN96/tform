import { AnySchema } from "yup";

export interface TFormOptions<T> {
  initialValues: T;
  validationSchema: Record<string, AnySchema>;
  onSubmit: (
    values: T,
    validate: (...args: any[]) => boolean,
    validateAsync: (...args: any[]) => Promise<boolean>
  ) => any;
}
