import { usersApi } from "./app";
import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk"
import { AppStateType } from "./redux-store";

const SET_LOGOUT_USER_DATA = 'SET_LOGOUT_USER_DATA';

export type SetLogOutUserDataAC_Type = { type: typeof SET_LOGOUT_USER_DATA, data: { id: null, email: null, login: null, isAuth: false } }
const setLogOutUserDataAC = (): SetLogOutUserDataAC_Type => ({ type: SET_LOGOUT_USER_DATA, data: { id: null, email: null, login: null, isAuth: false } })

type ActionTypes = SetLogOutUserDataAC_Type;

type Dispatch_Type = Dispatch<ActionTypes>;
type ThunkAC_Type = ThunkAction<Promise<void>, AppStateType, unknown, ActionTypes>

export const setMeLogOutThunkAC = (): ThunkAC_Type => async (dispatch: Dispatch_Type) => {
  let response = await usersApi.setMeLogOut()

  response.data.resultCode === 0 ? dispatch(setLogOutUserDataAC()) : console.log(response)

};

export type HeaderAC_type = { setMeLogOutThunkAC: () => void }

const actionCreators: HeaderAC_type = { setMeLogOutThunkAC };
export const headerAC = (state = actionCreators) => state;