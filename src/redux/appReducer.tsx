import { usersApi } from "./app";
import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk"
import { AppStateType, InferActionsTypes } from "./redux-store";

const actions = {
  initialisedSuccessAC: () => ({ type: 'INITIALISED_SUCCESSFULLY' } as const),
  setUserDataAC: (id: null | number, email: string, login: string) => ({ type: 'SET_USER_DATA', data: { id, email, login } } as const),
  authErrCatcherAC: (authErr: string) => ({ type: 'AUTH_ERR_CATCHER', authErr } as const),
  captchaSetterAC: (captcha: string) => ({ type: 'GET_CAPTCHA', captcha } as const),
  errGetCaptchaAC: (error: string) => ({ type: 'ERR_GET_CAPTCHA', error } as const),
  setLogOutUserDataAC: () => ({ type: 'SET_LOGOUT_USER_DATA', data: { id: null, email: null, login: null, isAuth: false } } as const)
}

type ActionTypes = InferActionsTypes<typeof actions>;
type Dispatch_Type = Dispatch<ActionTypes>
type ThunkAC_Type = ThunkAction<Promise<void>, AppStateType, unknown, ActionTypes>


const getLogInThunkAC = (): ThunkAC_Type => async (dispatch: Dispatch_Type) => {
  try {
    let response = await usersApi.getLogIn();
    let { id, email, login } = response.data.data;
    if (response.status === 200) dispatch(actions.setUserDataAC(id, email, login))
  }
  catch (err) {
    dispatch(actions.authErrCatcherAC(err.message))
  }

};
const setMeLoginThunkAC = (email: string, password: string, rememberMe: boolean, captchaCode: string): ThunkAC_Type =>
  async (dispatch: Dispatch_Type) => {
    try {
      let response = await usersApi.setMeLogin(email, password, rememberMe, captchaCode);
      if (response.data.resultCode === 0) {
        try {
          let loginResponse = await usersApi.getLogIn();
          let { id, email, login } = loginResponse.data.data;
          if (loginResponse.status === 200) dispatch(actions.setUserDataAC(id, email, login))
          if (response.data.messages.length) { dispatch(actions.authErrCatcherAC(response.data.messages[0])) }
        }
        catch (loginErr) { dispatch(actions.authErrCatcherAC(loginErr.message)) }
      }
      if (response.data.resultCode === 1) {
        debugger
        try {
          if (response.data.messages.length) { dispatch(actions.authErrCatcherAC(response.data.messages[0])) }
        }
        catch (loginErr) { dispatch(actions.authErrCatcherAC(loginErr.message)) }
      }
      if (response.data.resultCode === 10) {
        if (response.data.messages.length) { dispatch(actions.authErrCatcherAC(response.data.messages[0])) }
        try {
          let getCaptchaResponse = await usersApi.getCaptcha();
          if (getCaptchaResponse.status === 200) dispatch(actions.captchaSetterAC(getCaptchaResponse.data.url))
        }
        catch (getCaptchaErr) {                                         // нужен вменяемый обработчик ошибки получения капчи!!
          dispatch(actions.errGetCaptchaAC(getCaptchaErr))                  // не пойму, нужна ли эта строка
          dispatch(actions.errGetCaptchaAC(getCaptchaErr.data.messages[0])) // или эта?
        }
      }
    }
    catch (err) { dispatch(actions.authErrCatcherAC(err.message)) }
  };
const getCaptchaThunkAC = (): ThunkAC_Type => async (dispatch: Dispatch_Type) => {
  try {
    let response = await usersApi.getCaptcha();
    if (response.status === 200) dispatch(actions.captchaSetterAC(response.data.url))
  }
  catch (err) { dispatch(actions.errGetCaptchaAC(err)) }
}
const initializeAppThunkAC = (timer: number): ThunkAC_Type => async (dispatch: Dispatch_Type) => {
  // timerAC(timer)                // было dispatch(timerAC(timer)), вернуть и доработать, если не будет срабатывать вообще вроде он нафиг не нужен тут
  try {
    let response = await usersApi.getLogIn();
    let { id, email, login } = response.data.data;
    if (response.status === 200) dispatch(actions.setUserDataAC(id, email, login))
    dispatch(actions.initialisedSuccessAC())
  }
  catch (err) { dispatch(actions.authErrCatcherAC(err.message)) }
};

export type App_ACs_Type = {
  getLogInThunkAC: () => ThunkAC_Type
  setMeLoginThunkAC: (email: string, password: string, rememberMe: boolean, captchaCode: string) => ThunkAC_Type
  getCaptchaThunkAC: () => ThunkAC_Type
  initializeAppThunkAC: (timer: number) => ThunkAC_Type
}

const actionCreators: App_ACs_Type = { getLogInThunkAC, setMeLoginThunkAC, getCaptchaThunkAC, initializeAppThunkAC };
export const appAC = (state = actionCreators) => state;


const initialState = {
  appIsInitialized: false as boolean,
  id: null as null | number,
  email: '' as null | string,
  login: '' as null | string,
  isAuth: false as boolean,
  authErr: '' as string,      // вынести в редюсер с логинизацией
  captchaPic: '' as string,
  errCaptchaGet: '' as string,
  funnyLoaderArr: ["Calibrating the planet's rotation...",
    "Launching magma streams...", "Launching geomorphological processes...",
    "Placing continental plates ...", 'Filling the oceans...', "Deep water trenching...",
    "Creating the relief of the ocean floor ...", 'Tectonic configuration...', "Land level rise...",
    "Initializing waves ...", "Updating ocean currents ...", "Filtration of the atmosphere...", "Checking nitrogen content...",
    "Optimizing Planetary Air Circulation...", "Checking Ozone Concentration...", "Calculation of solar radiation...",
    "Sea level rise...", "Soil saturation with nutrients...", 'Planting flora...', 'Fauna breeding...', "Melting polar ice...",
    'Crusades...', 'Witch-hunting...', 'Transition into the renaissance era...', 'Scientific and technological revolution...',
    "Discharge of toxic waste...", "Senate's convocation...", "Selecting factions ...", "Energy conversation...",
    "Environmental deterioration", 'Client: Synchronization...',] as string[],
};

export type appStateType = typeof initialState;

export const appAuthReducer = (state = initialState, action: ActionTypes): appStateType => {
  switch (action.type) {
    case 'INITIALISED_SUCCESSFULLY': return { ...state, appIsInitialized: true };
    case 'SET_USER_DATA':
      let { email, login, id } = action.data
      if (email && login && id) {
        return { ...state, ...action.data, isAuth: true }
      } else { return { ...state } }
    case 'SET_LOGOUT_USER_DATA': return { ...state, ...action.data, isAuth: false };
    case 'AUTH_ERR_CATCHER': return { ...state, authErr: action.authErr };
    case 'GET_CAPTCHA': return { ...state, captchaPic: action.captcha };
    case 'ERR_GET_CAPTCHA': return { ...state, errCaptchaGet: action.error };
    default: return state;
  }
};


