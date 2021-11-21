import { AnySchema, ObjectSchema } from "yup";

export type TFormValidators = Record<string, AnySchema>;
export type TFormInitialObject = Record<string, any>;
export type TFormErrors = Record<string, string[]>;
export type TFormErrorMessage = string | undefined;

export interface TFormOptions<T> {
    initialValues: T;
    validationSchema?: TFormValidators;
    onSubmit: (
        values: T,
        validate: (...args: any[]) => boolean,
        validateAsync: (...args: any[]) => Promise<boolean>
    ) => any;
}
