import * as yup from "yup";
import {
    TFormInitialObject,
    TFormErrorMessage,
    TFormValidators,
    TFormOptions,
    TFormErrors,
} from "./types";
export * as yup from "yup";

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

    private get errorsCount(): Record<string, number> {
        const errorsCount: Record<string, number> = {};

        Object.keys(this._errors).forEach(
            (field: string) => (errorsCount[field] = this._errors[field].length)
        );

        return errorsCount;
    }

    public get errors(): Record<
        string,
        Record<string, TFormErrorMessage | boolean | number>
    > {
        return {
            count: this.errorsCount,
            first: this.firstErrors,
            last: this.lastErrors,
            any: this.hasErrors,
        };
    }

    public clearFieldErrors(field: string): void {
        if (field && this._errors[field]) this._errors[field] = [];
    }

    public clearErrors(field?: string): void {
        if (field) this.clearFieldErrors(field);
        else Object.keys(this._errors).forEach(this.clearFieldErrors);
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

    public continue(): void {
        this.isPending = false;
    }

    public reset(): void {
        this.values = { ...this._initialValues } as T;
    }

    public validateField(field: string): boolean {
        const value = (this.values as Record<string, unknown>)[field];
        const schema = this._validators[field];

        if (!schema) return true;

        this.wait();

        try {
            schema.validateSync(value);
        } catch (ex) {
            this._errors[field] = (ex as yup.ValidationError).errors;
        } finally {
            this.continue();

            return this.hasErrors[field];
        }
    }

    public async validateFieldAsync(field: string): Promise<boolean> {
        const value = (this.values as Record<string, unknown>)[field];
        const schema = this._validators[field];

        if (!schema) return true;

        this.wait();

        try {
            schema.validate(value);
        } catch (ex) {
            this._errors[field] = (ex as yup.ValidationError).errors;
        } finally {
            this.continue();
            return this.hasErrors[field];
        }
    }

    public validate(): boolean {
        Object.keys(this._validators).forEach(this.validateField);

        return this.isValid;
    }

    public async validateAsync(): Promise<boolean> {
        await Promise.all(
            Object.keys(this._validators).map(this.validateFieldAsync)
        );

        return this.isValid;
    }
}
