import { JSONSchemaType } from 'ajv';

import { CSVDataType } from '../../types/domain';

export const csvDataVS: JSONSchemaType<CSVDataType> = {
  type: 'array',

  items: {
    type: 'array',

    items: [
      { type: 'string' },
      { type: 'string' },
      { type: 'number' },
      { type: 'number' },
      { type: 'number' },
    ],

    minItems: 5,
    maxItems: 5,
  },
};
