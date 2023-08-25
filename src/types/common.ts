export type SIObject<T> = { [key: string]: T };

export type Response = {
  statusCode?: number | undefined;
  headers?: SIObject<boolean | number | string> | undefined;
  body?: string | undefined;
  isBase64Encoded?: boolean | undefined;
  cookies?: string[] | undefined;
}


