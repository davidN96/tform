"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TForm {
    constructor(options) {
        this._initialValues = {};
        this._values = {};
        this._validators = {};
        this._errors = {};
        this._pending = false;
        this.initializeValidators(options === null || options === void 0 ? void 0 : options.validationSchema);
        this.initializeErrors(options.initialValues);
        this.inializeValues(options.initialValues);
    }
    inializeValues(values) {
        this._initialValues = Object.assign({}, values);
        this._values = Object.assign({}, values);
    }
    initializeErrors(values) {
        Object.keys(values).forEach((field) => (this._errors[field] = []));
    }
    initializeValidators(validators) {
        if (validators)
            this._validators = Object.assign({}, validators);
    }
    get firstErrors() {
        const errors = {};
        Object.keys(this._errors).forEach((field) => (errors[field] = this._errors[field][0]));
        return errors;
    }
    get lastErrors() {
        const errors = {};
        Object.keys(this._errors).forEach((field) => {
            var _a;
            return (errors[field] =
                this._errors[field][((_a = this._errors[field]) === null || _a === void 0 ? void 0 : _a.length) - 1]);
        });
        return errors;
    }
    get hasErrors() {
        const errors = {};
        Object.keys(this._errors).forEach((field) => { var _a; return (errors[field] = Boolean((_a = this._errors[field]) === null || _a === void 0 ? void 0 : _a.length)); });
        return errors;
    }
    get errorsCount() {
        const errorsCount = {};
        Object.keys(this._errors).forEach((field) => { var _a; return (errorsCount[field] = (_a = this._errors[field]) === null || _a === void 0 ? void 0 : _a.length); });
        return errorsCount;
    }
    get errors() {
        return {
            count: this.errorsCount,
            first: this.firstErrors,
            last: this.lastErrors,
            any: this.hasErrors,
        };
    }
    clearFieldErrors(field) {
        if (field && this._errors[field])
            this._errors[field] = [];
    }
    clearErrors(field) {
        if (field)
            this.clearFieldErrors(field);
        else
            Object.keys(this._errors).forEach(this.clearFieldErrors);
    }
    get isValid() {
        return Object.values(this._errors).every(Boolean);
    }
    get isInvalid() {
        return !this.isInvalid;
    }
    get values() {
        return this._values;
    }
    set values(values) {
        this._values = values;
    }
    get isPending() {
        return this._pending;
    }
    set isPending(state) {
        this._pending = state;
    }
    wait() {
        this.isPending = true;
    }
    continue() {
        this.isPending = false;
    }
    reset() {
        this.values = Object.assign({}, this._initialValues);
    }
    validateField(field) {
        const value = this.values[field];
        const schema = this._validators[field];
        if (!schema)
            return true;
        this.wait();
        try {
            schema.validateSync(value);
        }
        catch (ex) {
            this._errors[field] = ex.errors;
        }
        finally {
            this.continue();
            return this.hasErrors[field];
        }
    }
    async validateFieldAsync(field) {
        const value = this.values[field];
        const schema = this._validators[field];
        if (!schema)
            return true;
        this.wait();
        try {
            schema.validate(value);
        }
        catch (ex) {
            this._errors[field] = ex.errors;
        }
        finally {
            this.continue();
            return this.hasErrors[field];
        }
    }
    validate() {
        Object.keys(this._validators).forEach(this.validateField);
        return this.isValid;
    }
    async validateAsync() {
        await Promise.all(Object.keys(this._validators).map(this.validateFieldAsync));
        return this.isValid;
    }
}
exports.default = TForm;
//# sourceMappingURL=index.js.map