export type CSVDataType = ReadonlyArray<
  [region: string, country: string, steel: number, coal: number, oil: number]
>;

export type ViewType = 'raw' | 'find' | 'filter1' | 'filter2';
