"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const yup = __importStar(require("yup"));
class TForm {
    constructor(options) {
        this._validatorsPending = {};
        this._initialValues = {};
        this._values = {};
        this._validators = {};
        this._touched = {};
        this._errors = {};
        this._pending = false;
        this.initializeValidators(options.initialValues, options === null || options === void 0 ? void 0 : options.validationSchema);
        this.initializeTouched(options.initialValues);
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
    initializeValidators(values, validators) {
        if (validators) {
            this._validators = Object.assign({}, validators);
            Object.keys(values).forEach((field) => (this._validatorsPending[field] = false));
        }
    }
    initializeTouched(values) {
        Object.keys(values).forEach((field) => (this._touched[field] = false));
    }
    handleTouch(field) {
        this._touched[field] = true;
    }
    handleUntouch(field) {
        this._touched[field] = false;
    }
    get firstErrors() {
        const errors = {};
        Object.keys(this._errors).forEach((field) => (errors[field] = this._errors[field][0] || null));
        return errors;
    }
    get lastErrors() {
        const errors = {};
        Object.keys(this._errors).forEach((field) => {
            var _a;
            return (errors[field] =
                this._errors[field][((_a = this._errors[field]) === null || _a === void 0 ? void 0 : _a.length) - 1] ||
                    null);
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
            all: this._errors,
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
    get isFormPending() {
        return this._pending;
    }
    set isFormPending(state) {
        this._pending = state;
    }
    get pending() {
        return Object.assign({ form: this.isFormPending }, this._validatorsPending);
    }
    wait() {
        this.isFormPending = true;
    }
    continue() {
        this.isFormPending = false;
    }
    reset() {
        this.values = Object.assign({}, this._initialValues);
        Object.keys(this._touched).forEach(this.handleUntouch);
    }
    waitForField(field) {
        this._validatorsPending[field] = true;
    }
    continueForField(field) {
        this._validatorsPending[field] = false;
    }
    validateField(field) {
        const schema = this._validators[field];
        if (schema) {
            this.waitForField(field);
            try {
                yup.object(this._validators).validateSyncAt(field, this.values, { abortEarly: false });
            }
            catch (ex) {
                this._errors[field] = ex.errors;
            }
            this.continueForField(field);
        }
        return this.hasErrors[field];
    }
    async validateFieldAsync(field) {
        const schema = this._validators[field];
        if (!schema)
            return true;
        if (schema) {
            this.waitForField(field);
            try {
                await yup
                    .object(this._validators)
                    .validateAt(field, this.values, { abortEarly: false });
            }
            catch (ex) {
                this._errors[field] = ex.errors;
            }
            this.continueForField(field);
        }
        return this.hasErrors[field];
    }
    validate() {
        Object.keys(this._validators).forEach((field) => this.validateField(field));
        return this.isValid;
    }
    async validateAsync() {
        await Promise.all(Object.keys(this._validators).map(async (field) => await this.validateFieldAsync(field)));
        return this.isValid;
    }
    handleFocusIn(e) {
        const field = e.target.name;
        if (field) {
            this.clearFieldErrors(field);
            this.handleTouch(field);
        }
    }
    async handleFocusOut(e) {
        const field = e.target.name;
        if (field)
            await this.validateFieldAsync(field);
    }
    handleSubmit() {
        this.validateAsync();
    }
}
exports.default = TForm;
//# sourceMappingURL=index.js.map