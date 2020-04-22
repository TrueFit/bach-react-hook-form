import {EnhancerContext, EnhancerResult, isFunction, PROPS} from '@truefit/bach';
import {useForm, UseFormOptions} from 'react-hook-form';

type FormConfigParameter<T, P> = UseFormOptions<T> | ((props: P) => UseFormOptions<T>) | undefined;

export default <T, P>(formConfig: FormConfigParameter<T, P>) => ({
  generateNewVariable,
}: EnhancerContext): EnhancerResult => {
  const formConfigAlias = generateNewVariable();
  const resolveFormConfigAlias = generateNewVariable();
  const resolveFormConfig = isFunction(formConfig)
    ? formConfig
    : (): UseFormOptions<T> => formConfig as UseFormOptions<T>;

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
