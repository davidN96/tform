import {
    TFormInitialObject,
    TFormErrorMessage,
    TFormValidators,
    TFormOptions,
    TFormErrors,
} from "types";

class TForm<T> {
    private _initialValues: T | TFormInitialObject = {};
    private _values: T | TFormInitialObject = {};
    private _validators: TFormValidators = {};
    private _errors: TFormErrors = {};
    private _pending: boolean = false;

    constructor(options: TFormOptions<T>) {
        this.initializeValidators(options?.validationSchema);
        this.initializeErrors(options.initialValues);
        this.inializeValues(options.initialValues);
    }

    private inializeValues(values: T): void {
        this._initialValues = { ...values };
        this._values = { ...values };
    }

    private initializeErrors(values: T): void {
        Object.keys(values).forEach(
            (field: string) => (this._errors[field] = [])
        );
    }

    private initializeValidators(validators?: TFormValidators): void {
        if (validators) this._validators = { ...validators };
    }

    private get firstErrors(): Record<string, TFormErrorMessage> {
        const errors: Record<string, TFormErrorMessage> = {};

        Object.keys(this._errors).forEach(
            (field: string) => (errors[field] = this._errors[field][0])
        );

        return errors;
    }

    private get lastErrors(): Record<string, TFormErrorMessage> {
        const errors: Record<string, TFormErrorMessage> = {};

        Object.keys(this._errors).forEach(
            (field: string) =>
                (errors[field] =
                    this._errors[field][this._errors.field.length - 1])
        );

        return errors;
    }

    private get hasErrors(): Record<string, boolean> {
        const errors: Record<string, boolean> = {};

        Object.keys(this._errors).forEach(
            (field: string) =>
                (errors[field] = Boolean(this._errors[field].length))
        );

        return errors;
    }

    public get errors(): Record<
        string,
        Record<string, TFormErrorMessage | boolean>
    > {
        return {
            first: this.firstErrors,
            last: this.lastErrors,
            any: this.hasErrors,
        };
    }

    public get isValid(): boolean {
        return Object.values(this._errors).every(Boolean);
    }

    public get isInvalid(): boolean {
        return !this.isInvalid;
    }

    public get values(): T {
        return this._values as T;
    }

    public set values(values: T) {
        this._values = values;
    }

    public get isPending(): boolean {
        return this._pending;
    }

    public set isPending(state: boolean) {
        this._pending = state;
    }

    public wait(): void {
        this.isPending = true;
    }

    public continute(): void {
        this.isPending = false;
    }
}
