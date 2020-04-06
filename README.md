# @truefit/bach-hook-form

This library allows components composed with [@truefit/bach](https://github.com/truefit/bach) to idiomatically use [React Hook Form](https://react-hook-form.com/)

## Installation

```
npm install @truefit/bach-react-hook-form react-hook-form
```

or

```
yarn add @truefit/bach-react-hook-form react-hook-form
```

## Enhancers

### withForm

Allows you access to the form methods from react hook form.

_Helper Signature_

| Parameter  | Type                 | Description                                                                                    |
| ---------- | -------------------- | ---------------------------------------------------------------------------------------------- |
| formConfig | js object (optional) | a js object containing the props to pass to the useForm hook - see documentation for full list |

_Example_

#### Typescript

```Typescript
import React from 'react';
import {compose} from '@truefit/bach';
import {withForm, FormContextValues} from '@truefit/bach-react-hook-form';

type FormValues = {
  name: string;
  address: string;
  age: number;
};

type Props = {
  formContext: FormContextValues<FormValues>;
};

const WithForm = ({formContext: {register, handleSubmit}}: Props) => (
  <div>
    <input name="name" ref={register} />
    <input name="address" ref={register} />
    <input name="age" ref={register} />

    <button type="submit">
      Submit
    </button>
  </div>
);

export default compose(
  withForm({
    defaultValues: {name: 'John Doe', address: '', age: 0},
    onSubmit: (values: FormValues) => {
      console.log(values); // eslint-disable-line
    },
  }),
)(WithForm);
```

#### Javascript

```Javascript
import React from 'react';
import {compose} from '@truefit/bach';
import {withForm, FormContextValues} from '@truefit/bach-react-hook-form';

const WithForm = ({formContext: {register, handleSubmit}}) => (
  <div>
    <input name="name" ref={register} />
    <input name="address" ref={register} />
    <input name="age" ref={register} />

    <button type="submit">
      Submit
    </button>
  </div>
);

export default compose(
  withForm({
    defaultValues: {name: 'John Doe', address: '', age: 0},
    onSubmit: (values) => {
      console.log(values); // eslint-disable-line
    },
  }),
)(WithForm);
```

**React Hook Form Hook**
[useForm](https://react-hook-form.com/api#useForm)

### withFormContext

Allows you access to the form methods from a component that is nested lower in the structure than the declaration of the form.

_Example_

#### Typescript

```Typescript
import React from 'react';
import {compose} from '@truefit/bach';
import {withFormContext, FormContextValues} from '@truefit/bach-react-hook-form';

type FormValues = {
  name: string;
  address: string;
  age: number;
};

type Props = {
  formContext: FormContextValues<FormValues>;
};

const WithFormContext = ({formContext: {register, handleSubmit}}: Props) => (
  <div>
    <input name="name" ref={register} />
    <input name="address" ref={register} />
    <input name="age" ref={register} />

    <button type="submit">
      Submit
    </button>
  </div>
);

export default compose(
  withFormContext(),
)(WithFormContext);
```

#### Javascript

```Javascript
import React from 'react';
import {compose} from '@truefit/bach';
import {withFormContext, FormContextValues} from '@truefit/bach-react-hook-form';

const WithFormContext = ({formContext: {register, handleSubmit}}) => (
  <div>
    <input name="name" ref={register} />
    <input name="address" ref={register} />
    <input name="age" ref={register} />

    <button type="submit">
      Submit
    </button>
  </div>
);

export default compose(
  withFormContext(),
)(WithFormContext);
```

**React Hook Form Hook**
[useFormContext](https://react-hook-form.com/api#useFormContext)
