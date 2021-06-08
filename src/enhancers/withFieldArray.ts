import {EnhancerResult, EnhancerContext, isFunction, PROPS} from '@truefit/bach';
import {useFieldArray, UseFieldArrayProps, FieldValues, FieldArrayPath} from 'react-hook-form';

type FieldArrayOptionsParameter<
  T extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<T> = FieldArrayPath<T>,
  TKeyName extends string = 'id',
> =
  | UseFieldArrayProps<T, TFieldArrayName, TKeyName>
  | ((props: T) => UseFieldArrayProps<T, TFieldArrayName, TKeyName>)
  | undefined;

export default <
    T extends FieldValues = FieldValues,
    TFieldArrayName extends FieldArrayPath<T> = FieldArrayPath<T>,
    TKeyName extends string = 'id',
  >(
    options?: FieldArrayOptionsParameter<T>,
    fieldArrayName = 'fieldArray',
  ) =>
  ({generateNewVariable}: EnhancerContext): EnhancerResult => {
    const optionsAlias = generateNewVariable();
    const resolveOptionsAlias = generateNewVariable();
    const resolveOptions = isFunction(options)
      ? options
      : (): FieldArrayOptionsParameter<T, TFieldArrayName, TKeyName> =>
          options as FieldArrayOptionsParameter<T, TFieldArrayName, TKeyName>;

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
