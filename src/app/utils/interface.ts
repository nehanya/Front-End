export interface _Object {
    [key: string]: any
  }

  export interface SessionState {
    isUserLoggedIn?: boolean,
    printerDevice?: any,
    me?: _Object,
  }