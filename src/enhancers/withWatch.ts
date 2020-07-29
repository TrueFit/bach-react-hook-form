/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {EnhancerResult, EnhancerContext, isFunction, PROPS} from '@truefit/bach';
import {useWatch} from 'react-hook-form';
import {UseWatchOptions} from '../types';

type UseWatchOptionsGenerator<P> = (props: P) => UseWatchOptions;
type WatchOptionsParameter<P> = UseWatchOptions | UseWatchOptionsGenerator<P> | undefined;
type UseWatchResult = unknown | Record<string, unknown>;

// options
interface OptionsPattern<P> {
  Static: (options: UseWatchOptions) => UseWatchOptions;
  Dynamic: (options: UseWatchOptionsGenerator<P>, props: P) => UseWatchOptions;
  undefined: () => undefined;
}

const matchOptions = <P>(pattern: OptionsPattern<P>) => (options: WatchOptionsParameter<P>) => (
  props: P,
): UseWatchOptions => {
  if (options === undefined) {
    return pattern.undefined();
  }

  if (isFunction(options)) {
    return pattern.Dynamic(options as UseWatchOptionsGenerator<P>, props);
  }

  return pattern.Static(options as UseWatchOptions);
};

interface AssignmentPattern<P> {
  String: (options: UseWatchOptions, props: P, watchValues: unknown) => void;
  Array: (options: UseWatchOptions, props: P, watchValues: Record<string, unknown>) => void;
  undefined: (props: P, watchValues: Record<string, unknown>) => void;
}

// assignment
const matchAssignment = <P>(pattern: AssignmentPattern<P>) => (
  options: UseWatchOptions,
  props: P,
  watchValues: UseWatchResult,
): void => {
  if (options === undefined || options.name === undefined) {
    return pattern.undefined(props, watchValues as Record<string, unknown>);
  }

  if (Array.isArray(options.name)) {
    return pattern.Array(options, props, watchValues as Record<string, unknown>);
  }

  return pattern.String(options, props, watchValues);
};

// enhancer
const WATCH_VALUES = 'watchValues';

export default <P>(options?: WatchOptionsParameter<P>) => ({
  generateNewVariable,
}: EnhancerContext): EnhancerResult => {
  // variables
  const optionsAlias = generateNewVariable();
  const resolveAlias = generateNewVariable();
  const assignmentAlias = generateNewVariable();
  const watchValuesAlias = generateNewVariable();

  // match setup
  const resolve = matchOptions({
    Static: (o) => o,
    Dynamic: (o, p) => o(p),
    undefined: () => undefined,
  })(options);

  const assignment = matchAssignment({
    String: (o, p, w) => {
      // @ts-ignore
      p[o.name as string] = w;
    },
    Array: (o, p, w) => {
      (o.name as string[]).forEach((s) => {
        // @ts-ignore
        p[s] = w[s];
      });
    },
    undefined: (p, w) => {
      // @ts-ignore
      p[WATCH_VALUES] = w;
    },
  });

  return {
    dependencies: {
      useWatch,
      [resolveAlias]: resolve,
      [assignmentAlias]: assignment,
    },
    initialize: `
      const ${optionsAlias} = ${resolveAlias}(${PROPS});
      const ${watchValuesAlias} = useWatch(${optionsAlias});

      ${assignmentAlias}(${optionsAlias}, ${PROPS}, ${watchValuesAlias});
    `,
    props: [],
  };
};
