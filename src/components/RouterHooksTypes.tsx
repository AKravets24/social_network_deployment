export type HistoryHook_Type = {
  block: (prompt: any) => void,
  createHref: (location: any) => void,
  go: (n: any) => void,
  goBack: () => void,
  goForward: () => void,
  listen: (listener: any) => void,
  push: (path: string, state?: any) => void,
  replace: (path: string, state: any) => void,
  action: string,
  length: number,
  location: {
    hash: string,
    key?: string | undefined,
    pathname: string,
    search: string,
    state: undefined | any,
  }
}
export type MatchHook_Type = {
  isExact: boolean
  params?: { userId?: string | number }
  path: string
  url: string
} 