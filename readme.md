## 📝 TForm - Lightweight Form Helper

#### :question: What is tform?

TForm is Vue form helper.
It's making development faster.
To validation TForm use yup library. 
Great to use with any UI library like Vuetify.

#### :hammer: Installation

```typescript
npm i vue-tform
```

#### :rocket: Getting started

##### Basic usage

```vue
<template>
    <form
        @submit.prevent="(e) => form.handleSubmit(e)"
        @focusout="(e) => form.handleFocusOut(e)"
        @focusin="(e) => form.handleFocusIn(e)"
    >
        <input
            name="example"
            :disabled="form.errors.any.example"
            v-model="form.values.example"
        />
        <label>{{ form.errors.first.example }}</label>
    </form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as yup from "yup";
import TForm from "vue-tform";

interface Model {
    example: string;
}

@Component({})
export default class Example extends Vue {
    private form<Model> = new TForm<Model>({
        initialValues: { example: "" },
        validationSchema: {
            example: yup.string().required()
        }
    })
}
</script>
```

### :page_facing_up: Docs

#### Available data

-   ##### Values

    Current form values object. You can get input value by "form.values.field-name" for eg. form.values.example.

-   ##### Errors
    Current form errors object.

```typescript
    interface errors<T>: {
        first: string,  // First error message for any form field - get by form.errors.first.example
        last: string,   // Last error message for any form field - get by form.errors.last.example
        any: boolean,   // Boolean state - has field any error - get by form.errors.any.example
        count: number,  // Errors count for any form field - get by form.errors.count.example
        all: string[]   // Errors messages array for all form fields - get by form.errors.all.example
    }
```

-   ##### Pending

    Current validation pending state for all fields and loading state for whole form.

```typescript
interface pending<T>: {
    example: boolean,    // boolean state of validation,
    form: boolean,   // is form blocked
}
```

#### Available methods

-   ##### reset()

    Reset form errors and values

-   ##### wait()

    Block form ( set pending state for form ). Use when you want to load any data asynchronously

-   ##### continue()

    Unblock form

-   ##### validate()

    Validate whole form sync. Returns boolean state - isFormValid

    ```typescript  
    private handleSubmit(): void
    {
        const isValid: boolean = this.form.validate();

        if(isValid) doSomething();
    }
    ```

-   ##### validateAsync()

    Validate whole form async. Returns boolean state - isFormValid
    ```typescript
    private async handleSubmit(): Promise<void>
    {
        const isValid: boolean = await this.form.validateAsync();

        if(isValid) doSomething();
    }
    ```

-   ##### handleFocusIn(e: Event)

    Handle form focusin event. You have to pass it as arrow function with event parameter.
    You have to pass this form method as function invoked in arrow function.

    ```vue
    <template>
        <form @focusin="e => form.handleFocusIn(e)">...</form>
    </template>
    ```

-   ##### handleFocusOut(e: Event)

    Handle form focusout event. You have to pass it as arrow function with event parameter
    You have to pass this form method as function invoked in arrow function.

    ```vue
    <template>
        <form @focusout="e => form.handleFocusOut(e)">...</form>
    </template>
    ```

-   ##### handleSubmit()
    Handle form submit event. Use only when you want to validate on submit.
    You have to pass this form method as function invoked in arrow function.

    ```vue
    <template>
        <form @submit.prevent="e => form.handleSubmit(e)">...</form>
    </template>
    ```
