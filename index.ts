import {
    TFormInitialObject,
    TFormValidators,
    TFormOptions,
    TFormErrors,
} from "types";

class TForm<T> {
    private initialValues: T | TFormInitialObject = {};
    private values: T | TFormInitialObject = {};
    private validators: TFormValidators = {};
    private errors: TFormErrors = {};

    constructor(options: TFormOptions<T>) {
        this.initializeValidators(options?.validationSchema);
        this.initializeErrors(options.initialValues);
        this.inializeValues(options.initialValues);
    }

    private inializeValues(values: T): void {
        this.initialValues = { ...values };
        this.values = { ...values };
    }

    private initializeErrors(values: T): void {
        Object.keys(values).forEach(
            (field: string) => (this.errors[field] = [])
        );
    }

    private initializeValidators(validators?: TFormValidators): void {
        if (validators) this.validators = { ...validators };
    }
}
