import {EnhancerContext, EnhancerResult, isFunction, PROPS} from '@truefit/bach';
import {useForm, UseFormProps} from 'react-hook-form';

type FormConfigParameter<T, P> = UseFormProps<T> | ((props: P) => UseFormProps<T>) | undefined;

export default <T, P>(formConfig: FormConfigParameter<T, P>) =>
  ({generateNewVariable}: EnhancerContext): EnhancerResult => {
    const formConfigAlias = generateNewVariable();
    const resolveFormConfigAlias = generateNewVariable();
    const resolveFormConfig = isFunction(formConfig)
      ? formConfig
      : (): UseFormProps<T> => formConfig as UseFormProps<T>;

    return {
      dependencies: {
        useForm,
        [resolveFormConfigAlias]: resolveFormConfig,
      },
      initialize: `
      const ${formConfigAlias} = ${resolveFormConfigAlias}(${PROPS});
      const formContext = useForm(${formConfigAlias});
    `,
      props: ['formContext'],
    };
  };
