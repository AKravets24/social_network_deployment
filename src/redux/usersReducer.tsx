import maleProfilePic from './img/dialogs/male.png';
import { usersApi, UsersArr } from "./app";
import nobodyFoundGIF from './img/users/polarPupCry.gif';
import { AppStateType, InferActionsTypes } from "./../redux/redux-store"
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';


type SetErrorToNullAC_Type = { type: 'ERROR_NULLIFIER' }

const actions = {
  followBTNTogglerAC: (userId: number, isFollowed: boolean) => ({ type: 'FOLLOW_ACTION_TOGGLER', userId, isFollowed } as const),
  setUsersAC: (users: UsersArr[], totalCount: number) => ({ type: 'SET_USERS', users, totalCount } as const),
  setCurrentPageAC: (currentPage: number) => ({ type: 'SET_CURRENT_PAGE', currentPage } as const),
  setLinkTermName: (userName: string) => ({ type: 'SET_LINK_TERM_NAME', userName } as const),
  toggleIsLoadingAC: (isLoading: boolean) => ({ type: 'TOGGLE_IS_LOADING', isLoading } as const),
  toggleFollowingProgressAC: (isLoading: boolean, userId: number) => ({ type: 'TOGGLE_IS_FOLLOWING_PROGRESS', isLoading, userId } as const),
  errCatcherAtUsersGetAC: (usersGettingError: string) => ({ type: 'AT_GETTING_USERS_ERROR_CAUGHT', usersGettingError } as const),
  errCatcherAtUsersFindAC: (usersFindingError: string) => ({ type: 'AT_FINDING_USERS_ERROR_CAUGHT', usersFindingError } as const),
  setErrorToNullAC: () => ({ type: 'ERROR_NULLIFIER' } as const),
  errCatcherAtFollowingAC: (userId: number, errorCode: number) => ({ type: 'ERROR_AT_FOLLOWING_TOGGLER', userId, errorCode } as const),
  ifUnMountCleanerAC: () => ({ type: 'COMPONENT_UNMOUNTED' } as const),
  followingErrCleaner: (userId: number) => ({ type: 'AT_FOLLOWING_ERROR_CLEANED', userId } as const),
}


type ActionTypes = InferActionsTypes<typeof actions>
type GetState_Type = () => AppStateType      // для примера типизации санок внутри скобок
type Dispatch_Type = Dispatch<ActionTypes>  // для примера типизации санок внутри скобок

type ThunkAction_type = ThunkAction<Promise<void>, AppStateType, unknown, ActionTypes>

const getUsersThunkAC = (pageSize: number, currentPage: number): ThunkAction_type => // после скобок - типизация в сооотв с документашкой
  async (dispatch: Dispatch_Type, getState: GetState_Type) => {    // getState это необязательный  доп аргумент, который в данной реализации проекта не используется
    dispatch(actions.toggleIsLoadingAC(true));
    dispatch(actions.setCurrentPageAC(currentPage));
    try {
      let response = await usersApi.getUsers(pageSize, currentPage);
      if (response.status === 200) dispatch(actions.setUsersAC(response.data.items, response.data.totalCount))
    }
    catch (err) { dispatch(actions.errCatcherAtUsersGetAC(JSON.stringify(err.message))); }
    dispatch(actions.toggleIsLoadingAC(false));
  };
const getCertainUserThunkAC = (pageSize: number, userName: string, pageOfEquals: number = 1): ThunkAction_type => async (dispatch: Dispatch_Type) => {
  dispatch(actions.toggleIsLoadingAC(true));
  dispatch(actions.setCurrentPageAC(pageOfEquals))
  dispatch(actions.setLinkTermName(userName));
  try {
    let response = await usersApi.getCertainUser(pageSize, userName, pageOfEquals)
    if (response.status === 200) dispatch(actions.setUsersAC(response.data.items, response.data.totalCount))
  }
  catch (err) { dispatch(actions.errCatcherAtUsersFindAC(JSON.stringify(err.message))) };
  dispatch(actions.toggleIsLoadingAC(false));
};
const setCurrentPageThunkAC = (pageSize: number, currentPage: number): ThunkAction_type => async (dispatch: Dispatch_Type) => {
  dispatch(actions.toggleIsLoadingAC(true));
  dispatch(actions.setCurrentPageAC(currentPage));
  dispatch(actions.setErrorToNullAC());
  let response = await usersApi.getUsers(pageSize, currentPage)
  response.status === 200 ?
    dispatch(actions.setUsersAC(response.data.items, response.data.totalCount)) : dispatch(actions.errCatcherAtUsersGetAC(JSON.stringify(response)))
  dispatch(actions.toggleIsLoadingAC(false));
};
const followThunkTogglerAC = (userId: number, isFollowed: boolean, error: string = ''): ThunkAction_type => async (dispatch: Dispatch_Type) => {
  dispatch(actions.toggleFollowingProgressAC(true, userId));
  if (error) dispatch(actions.followingErrCleaner(userId))
  let followToggler;
  isFollowed ? followToggler = usersApi.unFollowRequest : followToggler = usersApi.followRequest;
  try {
    let response = await followToggler(userId)
    if (response.status === 200) dispatch(actions.followBTNTogglerAC(userId, !isFollowed))
  }
  catch (err) { dispatch(actions.errCatcherAtFollowingAC(userId, parseInt(JSON.stringify(err.message).replace(/\D+/g, "")))); }
  dispatch(actions.toggleFollowingProgressAC(false, userId));
};

const unMountCleaner = () => (dispatch: Dispatch_Type) => { dispatch(actions.ifUnMountCleanerAC()) }

export type UsersACs_Type = {
  setErrorToNullAC: () => SetErrorToNullAC_Type
  getUsersThunkAC: (pageSize: number, currentPage: number) => ThunkAction_type
  setCurrentPageThunkAC: (pageSize: number, currentPage: number) => ThunkAction_type
  followThunkTogglerAC: (userId: number, isFollowed: boolean, error: string) => ThunkAction_type
  getCertainUserThunkAC: (pageSize: number, userName: string, pageOfEquals: number) => ThunkAction_type
  unMountCleaner: () => void
}

const actionCreators: UsersACs_Type = {
  getUsersThunkAC, setCurrentPageThunkAC,
  getCertainUserThunkAC, setErrorToNullAC: actions.setErrorToNullAC, followThunkTogglerAC, unMountCleaner
};
export const usersACs = (state = actionCreators) => { return state };


const initialUsersInfo = {
  initialUsersList: [] as UsersArr[],
  pageSize: 100 as number,
  totalCount: 0 as number,
  currentPage: 1 as number,
  linkTermName: '' as string,
  isLoading: false as boolean,
  defaultAvatar: maleProfilePic as string,
  followingInProgress: [] as number[],
  userSearchMode: false as boolean,
  usersGettingError: '' as string,
  userNotFound: '' as string,
  userFindingError: '' as string,
  userNotFoundGIF: nobodyFoundGIF as string,
};


export type InitialUsersInfo_Type = typeof initialUsersInfo;

export const usersReducer = (state = initialUsersInfo, action: ActionTypes): InitialUsersInfo_Type => {
  // debugger;
  switch (action.type) {
    case 'FOLLOW_ACTION_TOGGLER':
      return {
        ...state, initialUsersList: state.initialUsersList.map((currentUser: any) => {
          if (+currentUser.id === +action.userId) {
            return { ...currentUser, followed: action.isFollowed, error: '' }
          } return { ...currentUser }
        })
      };
    case 'AT_FOLLOWING_ERROR_CLEANED':
      return {
        ...state, initialUsersList: state.initialUsersList.map((currentUser: any) => {
          if (+currentUser.id === +action.userId) {
            return { ...currentUser, error: '' }
          } return { ...currentUser }
        })
      };

    case 'ERROR_AT_FOLLOWING_TOGGLER':
      return {
        ...state, initialUsersList: state.initialUsersList.map((currentUser: any) => {
          if (+currentUser.id === +action.userId) {
            return { ...currentUser, error: `${action.errorCode} error!` }
          } return { ...currentUser }
        })
      }
    case 'SET_USERS': {
      return !action.totalCount ?
        { ...state, initialUsersList: action.users, userNotFound: 'Nobody was found', totalCount: action.totalCount } :
        { ...state, initialUsersList: action.users, totalCount: action.totalCount }
    }
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.currentPage };
    case 'TOGGLE_IS_LOADING':
      return { ...state, isLoading: action.isLoading };
    case 'TOGGLE_IS_FOLLOWING_PROGRESS':
      return {
        ...state, followingInProgress: action.isLoading
          ? [...state.followingInProgress, action.userId]
          : [...state.followingInProgress.filter(id => id != action.userId)]
      };
    case 'AT_GETTING_USERS_ERROR_CAUGHT':
      return { ...state, usersGettingError: action.usersGettingError.substr(1, action.usersGettingError.length - 2) };
    case 'AT_FINDING_USERS_ERROR_CAUGHT':
      return { ...state, userFindingError: action.usersFindingError.substr(1, action.usersFindingError.length - 2) };
    case 'ERROR_NULLIFIER':
      return { ...state, usersGettingError: '', userFindingError: '', }

    case 'COMPONENT_UNMOUNTED': return { ...state, initialUsersList: [], }

    default: return { ...state };
  }
};


