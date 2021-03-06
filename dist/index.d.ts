import * as yup from "yup";
export default class TForm<T> {
    private _validatorsPending;
    private _initialValues;
    private _values;
    private _validators;
    private _touched;
    private _errors;
    private _pending;
    constructor(options: TFormOptions<T>);
    private inializeValues;
    private initializeErrors;
    private initializeValidators;
    private initializeTouched;
    private handleTouch;
    private handleUntouch;
    private get firstErrors();
    private get lastErrors();
    private get hasErrors();
    private get errorsCount();
    get errors(): Record<string, Record<string, TFormErrorMessage | boolean | number | string[]>>;
    clearFieldErrors(field: string): void;
    clearErrors(field?: string): void;
    get isValid(): boolean;
    get isInvalid(): boolean;
    get values(): T;
    set values(values: T);
    get isFormPending(): boolean;
    set isFormPending(state: boolean);
    get pending(): Record<string, boolean>;
    wait(): void;
    continue(): void;
    reset(): void;
    private waitForField;
    private continueForField;
    validateField(field: string): boolean;
    validateFieldAsync(field: string): Promise<boolean | undefined>;
    validate(): boolean;
    validateAsync(): Promise<boolean>;
    handleFocusIn(e: Record<string, string | unknown>): void;
    handleFocusOut(e: Record<string, string | unknown>): Promise<void>;
    handleSubmit(): void;
}
export declare type TFormValidators = Record<string, yup.AnySchema>;
export declare type TFormInitialObject = Record<string, unknown>;
export declare type TFormErrors = Record<string, string[]>;
export declare type TFormErrorMessage = string | null;
export interface TFormOptions<T> {
    validationSchema?: TFormValidators;
    initialValues: T;
}
