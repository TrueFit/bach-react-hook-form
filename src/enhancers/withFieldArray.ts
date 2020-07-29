import {EnhancerResult, EnhancerContext, isFunction, PROPS} from '@truefit/bach';
import {useFieldArray, UseFieldArrayOptions, Control} from 'react-hook-form';

type FieldArrayOptionsParameter<
  T,
  TKeyName extends string = 'id',
  TControl extends Control = Control
> =
  | UseFieldArrayOptions<TKeyName, TControl>
  | ((props: T) => UseFieldArrayOptions<TKeyName, TControl>)
  | undefined;

export default <T, TKeyName extends string = 'id', TControl extends Control = Control>(
  options?: FieldArrayOptionsParameter<T>,
  fieldArrayName = 'fieldArray',
) => ({generateNewVariable}: EnhancerContext): EnhancerResult => {
  const optionsAlias = generateNewVariable();
  const resolveOptionsAlias = generateNewVariable();
  const resolveOptions = isFunction(options)
    ? options
    : (): FieldArrayOptionsParameter<T, TKeyName, TControl> =>
        options as FieldArrayOptionsParameter<T, TKeyName, TControl>;

  return {
    dependencies: {
      [resolveOptionsAlias]: resolveOptions,
      useFieldArray,
    },
    initialize: `
      const ${optionsAlias} = ${resolveOptionsAlias}(${PROPS});
      const ${fieldArrayName} = useFieldArray(${optionsAlias});
    `,
    props: [fieldArrayName],
  };
};
