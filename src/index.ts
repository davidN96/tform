import * as yup from "yup";

export default class TForm<T> {
    private _validatorsPending: TFormValidators | Record<string, boolean> = {};
    private _initialValues: T | TFormInitialObject = {};
    private _values: T | TFormInitialObject = {};
    private _validators: TFormValidators = {};
    private _touched: TFormInitialObject = {};
    private _errors: TFormErrors = {};
    private _pending: boolean = false;

    constructor(options: TFormOptions<T>) {
        this.initializeValidators(
            options.initialValues,
            options?.validationSchema
        );
        this.initializeTouched(options.initialValues);
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

    private initializeValidators(
        values: T,
        validators?: TFormValidators
    ): void {
        if (validators) {
            this._validators = { ...validators };
            Object.keys(values).forEach(
                (field: string) => (this._validatorsPending[field] = false)
            );
        }
    }

    private initializeTouched(values: T): void {
        Object.keys(values).forEach(
            (field: string) => (this._touched[field] = false)
        );
    }

    private handleTouch(field: string): void {
        this._touched[field] = true;
    }

    private handleUntouch(field: string): void {
        this._touched[field] = false;
    }

    private get firstErrors(): Record<string, TFormErrorMessage> {
        const errors: Record<string, TFormErrorMessage> = {};

        Object.keys(this._errors).forEach(
            (field: string) => (errors[field] = this._errors[field][0] || null)
        );

        return errors;
    }

    private get lastErrors(): Record<string, TFormErrorMessage> {
        const errors: Record<string, TFormErrorMessage> = {};

        Object.keys(this._errors).forEach(
            (field: string) =>
                (errors[field] =
                    this._errors[field][this._errors[field]?.length - 1] ||
                    null)
        );

        return errors;
    }

    private get hasErrors(): Record<string, boolean> {
        const errors: Record<string, boolean> = {};

        Object.keys(this._errors).forEach(
            (field: string) =>
                (errors[field] = Boolean(this._errors[field]?.length))
        );

        return errors;
    }

    private get errorsCount(): Record<string, number> {
        const errorsCount: Record<string, number> = {};

        Object.keys(this._errors).forEach(
            (field: string) =>
                (errorsCount[field] = this._errors[field]?.length)
        );

        return errorsCount;
    }

    public get errors(): Record<
        string,
        Record<string, TFormErrorMessage | boolean | number | string[]>
    > {
        return {
            count: this.errorsCount,
            first: this.firstErrors,
            last: this.lastErrors,
            any: this.hasErrors,
            all: this._errors,
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

    public get isFormPending(): boolean {
        return this._pending;
    }

    public set isFormPending(state: boolean) {
        this._pending = state;
    }

    public get pending(): Record<string, boolean> {
        return {
            form: this.isFormPending,
            ...this._validatorsPending,
        };
    }

    public wait(): void {
        this.isFormPending = true;
    }

    public continue(): void {
        this.isFormPending = false;
    }

    public reset(): void {
        this.values = { ...this._initialValues } as T;
        Object.keys(this._touched).forEach(this.handleUntouch);
    }

    private waitForField(field: string): void {
        this._validatorsPending[field] = true;
    }

    private continueForField(field: string): void {
        this._validatorsPending[field] = false;
    }

    public validateField(field: string): boolean {
        const schema = this._validators[field];

        if (schema) {
            this.waitForField(field);

            try {
                yup.object(this._validators).validateSyncAt(
                    field,
                    this.values,
                    { abortEarly: false }
                );
            } catch (ex) {
                this._errors[field] = (ex as yup.ValidationError).errors;
            }

            this.continueForField(field);
        }

        return this.hasErrors[field];
    }

    public async validateFieldAsync(
        field: string
    ): Promise<boolean | undefined> {
        const schema = this._validators[field];

        if (!schema) return true;

        if (schema) {
            this.waitForField(field);

            try {
                await yup
                    .object(this._validators)
                    .validateAt(field, this.values, { abortEarly: false });
            } catch (ex) {
                this._errors[field] = (ex as yup.ValidationError).errors;
            }

            this.continueForField(field);
        }

        return this.hasErrors[field];
    }

    public validate(): boolean {
        Object.keys(this._validators).forEach((field) =>
            this.validateField(field)
        );

        return this.isValid;
    }

    public async validateAsync(): Promise<boolean> {
        await Promise.all(
            Object.keys(this._validators).map(
                async (field) => await this.validateFieldAsync(field)
            )
        );

        return this.isValid;
    }

    public handleFocusIn(e: Record<string, string | unknown>): void {
        const field: string = (e.target as Record<string, string>).name;

        if (field) {
            this.clearFieldErrors(field);
            this.handleTouch(field);
        }
    }

    public async handleFocusOut(
        e: Record<string, string | unknown>
    ): Promise<void> {
        const field: string = (e.target as Record<string, string>).name;

        if (field) await this.validateFieldAsync(field);
    }

    public handleSubmit(): void {
        this.validateAsync();
    }
}

export type TFormValidators = Record<string, yup.AnySchema>;
export type TFormInitialObject = Record<string, unknown>;
export type TFormErrors = Record<string, string[]>;
export type TFormErrorMessage = string | null;

export interface TFormOptions<T> {
    validationSchema?: TFormValidators;
    initialValues: T;
}
