import {EnhancerResult} from '@truefit/bach';
import {useFormContext} from 'react-hook-form';

export default () => (): EnhancerResult => {
  return {
    dependencies: {
      useFormContext,
    },
    initialize: `
      const formContext = useFormContext();
    `,
    props: ['formContext'],
  };
};
