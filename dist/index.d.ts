export default class TForm<T> {
    private _initialValues;
    private _values;
    private _validators;
    private _errors;
    private _pending;
    constructor(options: TFormOptions<T>);
    private inializeValues;
    private initializeErrors;
    private initializeValidators;
    private get firstErrors();
    private get lastErrors();
    private get hasErrors();
    private get errorsCount();
    get errors(): Record<string, Record<string, TFormErrorMessage | boolean | number>>;
    clearFieldErrors(field: string): void;
    clearErrors(field?: string): void;
    get isValid(): boolean;
    get isInvalid(): boolean;
    get values(): T;
    set values(values: T);
    get isPending(): boolean;
    set isPending(state: boolean);
    wait(): void;
    continue(): void;
    reset(): void;
    validateField(field: string): boolean;
    validateFieldAsync(field: string): Promise<boolean>;
    validate(): boolean;
    validateAsync(): Promise<boolean>;
}
import { AnySchema } from "yup";
export declare type TFormValidators = Record<string, AnySchema>;
export declare type TFormInitialObject = Record<string, any>;
export declare type TFormErrors = Record<string, string[]>;
export declare type TFormErrorMessage = string | undefined;
export interface TFormOptions<T> {
    initialValues: T;
    validationSchema?: TFormValidators;
    onSubmit?: (values: T, validate: (...args: any[]) => boolean, validateAsync: (...args: any[]) => Promise<boolean>) => unknown;
}
