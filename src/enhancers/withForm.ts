import {EnhancerContext, EnhancerResult} from '@truefit/bach';
import {useForm, UseFormOptions} from 'react-hook-form';

export default <T>(formConfig?: UseFormOptions<T>) => ({
  generateNewVariable,
}: EnhancerContext): EnhancerResult => {
  const formConfigAlias = generateNewVariable();

  return {
    dependencies: {
      useForm,
      [formConfigAlias]: formConfig,
    },
    initialize: `
      const formContext = useForm(${formConfigAlias});
    `,
    props: ['formContext'],
  };
};
