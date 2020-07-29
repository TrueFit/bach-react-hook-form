/* eslint-disable import/prefer-default-export */
import {Control} from 'react-hook-form';

// for ease of import
export {UseFormMethods} from 'react-hook-form';

// Not exported from react-hook-form v6.1.0
export type UseWatchOptions = {
  defaultValue?: unknown;
  name?: string | string[];
  control?: Control;
};
