import { CertainDialog_Type, DialogsList_Type, MessageData_Type, usersApi } from './app';
import maleProfilePic from './img/dialogs/male.png';
import errorPic from './img/dialogs/error.png';
import radioTowerPIC from './img/dialogs/radioTower1.png';
import arrowDownPIC from './img/dialogs/arrowDown.png';
import msgSendLoaderGIF from './loader/dialogs/onSendMsg/msgSender.gif';
import msgDeliveredFlag from './img/dialogs/delivered.png'
import msgSeenFlag from './img/dialogs/seen.png'
import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { AppStateType, InferActionsTypes } from './redux-store';
import { v4 as uuidv4 } from 'uuid';


type FeedBackWindowCloserAC_Type = { type: 'FEEDBACK_WINDOW_CLOSER', actionKey: string }
type SetSelectedMessagesAC_Type = { type: 'SET_SELECTED_MESSAGES', messageId: string }
type CreateNewDialogAC_Type = { type: 'CREATE_AND_SET_NEW_DIALOG', userId: number, fullName: string, photos: Photos_Type }
type Photos_Type = { large: null | string, small: null | string }


const actions = {
  setDialogsAreLoadingToggleAC: (allDialogs: boolean, certainDialog: boolean) => ({ type: 'DIALOGS_ARE_LOADING_TOGGLER', allDialogs, certainDialog } as const),
  setMyCompanions: (data: DialogsList_Type[]) => ({ type: 'SET_MY_COMPANIONS_LIST', data } as const),
  setErrMyNegotiatorsList: (errorCode: number) => ({ type: 'ERR_NEGOTIATORS_LIST_GET', errorCode } as const),
  setTalkWithUser: (data: CertainDialog_Type, userId: number) => ({ type: 'SET_TALK_WITH_USER', data, userId } as const),
  addPrevMSGS: (prevMsgs: MessageData_Type[]) => ({ type: 'ADDED_PREVIOUS_MSGS', prevMsgs } as const),
  prevMsgsloadingTogglerAC: (prevMsgsIsLoading: boolean) => ({ type: 'PREV_MSGS_LOADING_TOGGLER', prevMsgsIsLoading } as const),
  sendMsgAC: (msgItem: MessageData_Type,) => ({ type: 'SEND_MESSAGE_TO_USER', msgItem } as const),
  onSendingMSGEStatusAC: (number: number, userId: number, actionKey: string, userName: string) => ({ type: 'ON_SENDING_MSG_STATUS', number, userId, actionKey, userName } as const),
  feedBackWindowCloserAC: (actionKey: string) => ({ type: 'FEEDBACK_WINDOW_CLOSER', actionKey } as const),
  createNewDialogAC: (userId: number, fullName: string, photos: Photos_Type) => ({ type: 'CREATE_AND_SET_NEW_DIALOG', userId, fullName, photos } as const),
  setErrCertainDialogGetAC: (error: string) => ({ type: 'ERR_CERTAIN_DIALOG_GET', error } as const),
  newMsgActonCombiner: (newMessagesCount: number, BTNIsDisabled: boolean, hasErr: boolean) => ({ type: 'NEW_MSG_ACTTION_COMBINER', newMessagesCount, BTNIsDisabled, hasErr } as const),
  setSelectedMessagesAC: (messageId: string) => ({ type: 'SET_SELECTED_MESSAGES', messageId } as const),
  deleteMessageAC: (messageId: string, index: number) => ({ type: 'DELETE_MESSAGE', messageId, index } as const),
  setAsSpamMessage: (messageId: string, index: number) => ({ type: 'SET_SPAM_MESSAGE', messageId, index } as const),
  toggleSendingInProgressAC: (isSending: boolean, actionKey: string) => ({ type: 'TOGGLE_SENDING_IN_PROGRESS', isSending, actionKey } as const),
  errCatcherAtSendingAC: (actionKey: string, errCode: number) => ({ type: 'ERROR_AT_SENDING_TOGGLER', actionKey, errCode } as const),
  errAtGettingPrevMsgsAC: (isErr: boolean) => ({ type: 'IS_ERROR_AT_GETTING_PREV_MSGS', isErr } as const),
  addToForDeletingArrAC: (isDeleting: boolean, messageId: string) => ({ type: 'MSG_TO_FOR_DELETING_ARR', isDeleting, messageId } as const),
  errAtDeletingMsgArrAC: (isErr: boolean, messageId: string) => ({ type: 'ERR_AT_DELETENG_MSG_ARR', isErr, messageId } as const),
  dialogCompCleanerAC: () => ({ type: 'DIALOG_AREA_ARR_WAS_CLEANED' } as const),
  prevMSGsCounterSetterAC: (counter: number) => ({ type: 'PREV_MSGS_COUNTER_SET', counter } as const),
}

type ActionTypes = InferActionsTypes<typeof actions>
type Dispatch_Type = Dispatch<ActionTypes>;
export type ThunkAC_Type = ThunkAction<Promise<void>, AppStateType, unknown, ActionTypes>

export type PseudoMsg_Type = { /* pseudoId: string, */ body: string, actionKey: string, senderId: number, isSending: boolean, addedAt: string, deletedByRecipient: boolean, deletedBySender: boolean, distributionId: null, id: string, isSpam: boolean, recipientId: number, recipientName: string, senderName: string, translatedBody: null, viewed: boolean }


const getMyNegotiatorsListThunkAC = (): ThunkAC_Type => async (dispatch: Dispatch_Type) => {
  dispatch(actions.setDialogsAreLoadingToggleAC(true, false))
  dispatch(actions.setErrMyNegotiatorsList(0))
  try {
    let response = await usersApi.getMyNegotiatorsList();
    if (response.status === 200) dispatch(actions.setMyCompanions(response.data))
  }
  catch (err) {
    dispatch(actions.setErrMyNegotiatorsList(parseInt(JSON.stringify(err.message).replace(/\D+/g, "")))); // errorCode
  }
  dispatch(actions.setDialogsAreLoadingToggleAC(false, false))
};
const getTalkWithUserThunkAC = (userId: number): ThunkAC_Type => async (dispatch: Dispatch_Type) => {
  dispatch(actions.setDialogsAreLoadingToggleAC(false, true))
  dispatch(actions.setErrCertainDialogGetAC(''))
  try {
    let response = await usersApi.getTalkWithUser(userId);
    if (response.status === 200) dispatch(actions.setTalkWithUser(response.data, userId))
  }
  catch (err) { dispatch(actions.setErrCertainDialogGetAC(JSON.stringify(err.message))) };
  dispatch(actions.setDialogsAreLoadingToggleAC(false, false))
};
const talkedBeforeThunkAC = (userId: number): ThunkAC_Type => async (dispatch: Dispatch_Type) => {
  dispatch(actions.setDialogsAreLoadingToggleAC(true, true))
  try {
    let response = await usersApi.getMyNegotiatorsList()                                                      // получаем список диалогов
    if (response.status === 200) {
      dispatch(actions.setMyCompanions(response.data))
      if (response.data.find((el: DialogsList_Type) => (el.id === +userId))) {                                // если в списке диалогов есть нужный юзер
        try {
          let responseCertainUser = await usersApi.getTalkWithUser(userId)                                    // то запрашиваем диалог с ним
          responseCertainUser.status === 200 && dispatch(actions.setTalkWithUser(responseCertainUser.data, userId))
        }
        catch (err) { dispatch(actions.setErrCertainDialogGetAC(JSON.stringify(err.message))) };              // error
      } else {
        let getProfileResponse = await usersApi.getProfile(userId);
        let { fullName, photos } = getProfileResponse.data;
        dispatch(actions.createNewDialogAC(+userId, fullName, photos))
      }
    }
  } catch (err) {
    dispatch(actions.setErrMyNegotiatorsList(parseInt(JSON.stringify(err.message).replace(/\D+/g, "")))); // errorCode
    dispatch(actions.setErrCertainDialogGetAC(JSON.stringify(err.message)));                                                  // error
    // dispatch(setErrMyNegotiatorsList(parseInt(JSON.stringify(response).replace(/\D+/g,""))));                              // errorCode
    // dispatch(setErrCertainDialogGetAC(JSON.stringify(response)));                                                          // error
  }
  dispatch(actions.setDialogsAreLoadingToggleAC(false, false))
};
const addPrevMessagesThunkAC = (userId: number, msgCount: number, pageNumber: number): ThunkAC_Type => async (dispatch: Dispatch_Type) => {
  dispatch(actions.prevMsgsloadingTogglerAC(true));
  dispatch(actions.errAtGettingPrevMsgsAC(false));
  try {
    let response = await usersApi.getTalkWithUser(userId, msgCount, pageNumber)
    dispatch(actions.addPrevMSGS(response.data.items))
    dispatch(actions.prevMSGsCounterSetterAC(pageNumber + 1))
  }
  catch (err) {
    dispatch(actions.errAtGettingPrevMsgsAC(true));
  }
  dispatch(actions.prevMsgsloadingTogglerAC(false));
};
const deleteMessageThunkAC = (messageId: string, index: number): ThunkAC_Type => async (dispatch: Dispatch_Type) => {
  dispatch(actions.addToForDeletingArrAC(true, messageId))
  dispatch(actions.errAtDeletingMsgArrAC(false, messageId))
  try {
    let response = await usersApi.deleteMessage(messageId)
    if (response.status === 200) { dispatch(actions.deleteMessageAC(messageId, index)) }
  }
  catch (err) { dispatch(actions.errAtDeletingMsgArrAC(true, messageId)) }
  dispatch(actions.addToForDeletingArrAC(false, messageId))
};
const setSpamMessagesThunkAC = (messageId: string, index: number): ThunkAC_Type => async (dispatch: Dispatch_Type) => {
  try {
    let response = await usersApi.setAsSpamMessage(messageId)
    if (response.status === 200) dispatch(actions.setAsSpamMessage(messageId, index))
  }
  catch (err) { console.log(err) }
};
const getNewMessagesRequestThunkAC = (): ThunkAC_Type => async (dispatch: Dispatch_Type) => {
  dispatch(actions.newMsgActonCombiner(0, true, false))
  try {
    let response = await usersApi.getNewMessages()
    if (response.status === 200) dispatch(actions.newMsgActonCombiner(response.data, false, false))
  }
  catch (err) { dispatch(actions.newMsgActonCombiner(0, false, true)) };
};
const sendMessageToUserThunkAC = (userId: number, body: string, actionKey: string, userName: string, senderId: number): ThunkAC_Type => async (dispatch: Dispatch_Type) => {
  dispatch(actions.onSendingMSGEStatusAC(0, userId, actionKey, userName));  //for friends, users comps
  dispatch(actions.errCatcherAtSendingAC(actionKey, 0));
  dispatch(actions.toggleSendingInProgressAC(true, actionKey));
  let pseudoMsg: PseudoMsg_Type = { body, actionKey, senderId, isSending: false, addedAt: '', deletedByRecipient: false, deletedBySender: false, distributionId: null, id: uuidv4(), isSpam: false, recipientId: -1, recipientName: '', senderName: '', translatedBody: null, viewed: false };

  dispatch(actions.sendMsgAC(pseudoMsg))
  try {
    let response = await usersApi.sendMsgToTalker(userId, body)
    let modifiedmsgItem = response.data.data.message;
    modifiedmsgItem.actionKey = actionKey
    if (response.status === 200) dispatch(actions.onSendingMSGEStatusAC(1, userId, actionKey, userName)) && dispatch(actions.sendMsgAC(modifiedmsgItem)) // response.data.data.message
  }
  catch (err) {
    dispatch(actions.onSendingMSGEStatusAC(2, userId, actionKey, userName)) //for friends, users  comps
    dispatch(actions.errCatcherAtSendingAC(actionKey, parseInt(JSON.stringify(err.message).replace(/\D+/g, ""))))
  }
  dispatch(actions.toggleSendingInProgressAC(false, actionKey));
};
const feedBackPopUpCloser = (actionKey: string) => (dispatch: Dispatch_Type) => { dispatch(actions.feedBackWindowCloserAC(actionKey)) }
const dialogCompCleaner = () => (dispatch: Dispatch_Type) => { dispatch(actions.dialogCompCleanerAC()) }
const prevMSGsCounterSetter = (counter: number) => (dispatch: Dispatch_Type) => { dispatch(actions.prevMSGsCounterSetterAC(counter)) }





export type DialogActions_Type = {
  getMyNegotiatorsListThunkAC: () => ThunkAC_Type
  getTalkWithUserThunkAC: (userId: number) => ThunkAC_Type
  sendMessageToUserThunkAC: (userId: number, body: string, actionKey: string, userName: string, senderId: number) => ThunkAC_Type
  createNewDialogAC: (userId: number, fullName: string, photos: Photos_Type) => CreateNewDialogAC_Type
  talkedBeforeThunkAC: (userId: number) => ThunkAC_Type
  setSelectedMessagesAC: (messageId: string) => SetSelectedMessagesAC_Type
  setSpamMessagesThunkAC: (messageId: string, index: number) => ThunkAC_Type
  deleteMessageThunkAC: (messageId: string, index: number) => ThunkAC_Type
  getNewMessagesRequestThunkAC: () => ThunkAC_Type
  addPrevMessagesThunkAC: (userId: number, msgCount: number, pageNumber: number) => ThunkAC_Type
  feedBackPopUpCloser: (actionKey: string) => void
  dialogCompCleaner: () => void
  prevMSGsCounterSetter: (counter: number) => void
}

const dialogActions: DialogActions_Type = {
  getMyNegotiatorsListThunkAC, getTalkWithUserThunkAC, sendMessageToUserThunkAC, createNewDialogAC: actions.createNewDialogAC,
  talkedBeforeThunkAC, setSelectedMessagesAC: actions.setSelectedMessagesAC, setSpamMessagesThunkAC, deleteMessageThunkAC, getNewMessagesRequestThunkAC,
  addPrevMessagesThunkAC, feedBackPopUpCloser, dialogCompCleaner, prevMSGsCounterSetter,
};

export const dialogACs = (state = dialogActions) => { return state };

type ErrinSendingArr_Type = { actionKey: string, error: number }
type ErrInDeletingArr_Type = { messageId: string, }
export type FeedBackArr_Type = { statNum: number, userId: number, userName: string, actionKey: string }

let initialDialogsState = {
  dialogsList: [] as DialogsList_Type[],
  certainDialog: { items: [], totalCount: 0, error: null } as CertainDialog_Type,
  allDialogsIsLoading: false as boolean,
  certainDialogIsLoading: false as boolean,
  defaultAvatar: maleProfilePic as string,
  newMessagesCounter: 0 as number,
  onError: errorPic as string,
  newMessageBTNDisabled: false as boolean,
  prevMsgsIsLoading: false as boolean,
  errGettingNewMSGSCount: false as boolean,
  feedbackArr: [] as FeedBackArr_Type[],
  errNegotiatorsListGet: 0 as number,
  errNegotiatorsListPIC: radioTowerPIC as string,
  errCertainDialogGet: '' as string,
  sendndigInProgress: [] as string[],
  errInSendingArr: [] as ErrinSendingArr_Type[],
  msgLoaderGIF: msgSendLoaderGIF as string,
  msgDeliveredFlagPIC: msgDeliveredFlag as string,
  msgSeenFlagPIC: msgSeenFlag as string,
  arrowDownPIC: arrowDownPIC as string,
  errAtGettingPrevMsgs: false as boolean,
  forDeletingMsgsArr: [] as string[],
  errAtDeletingMsgsArr: [] as ErrInDeletingArr_Type[],
  prevMSGsCounter: 2 as number,
};

export type InitialDialogsState_Type = typeof initialDialogsState;

export type PartDialogReducer_Type = { newMessageBTNDisabled: boolean, newMessagesCounter: number, errGettingNewMSGSCount: boolean, onError: string, envelope_GIF: string, }


export const dialogsReducer = (state = initialDialogsState, action: ActionTypes, /* date:string, time:string */): InitialDialogsState_Type => {
  let stateCopy = { ...state };
  switch (action.type) {

    case 'PREV_MSGS_COUNTER_SET': return { ...state, prevMSGsCounter: action.counter }

    case 'NEW_MSG_ACTTION_COMBINER': return { ...state, newMessagesCounter: action.newMessagesCount, newMessageBTNDisabled: action.BTNIsDisabled, errGettingNewMSGSCount: action.hasErr };

    case 'TOGGLE_SENDING_IN_PROGRESS':
      return { ...state, sendndigInProgress: action.isSending ? [...state.sendndigInProgress, action.actionKey] : [...state.sendndigInProgress.filter(el => el != action.actionKey)] }

    case 'ERROR_AT_SENDING_TOGGLER':
      let { errCode, actionKey } = action;
      return {
        ...state, errInSendingArr: action.errCode ? [...state.errInSendingArr, { actionKey, error: errCode }] : [...state.errInSendingArr.filter(el => el.actionKey != action.actionKey)]
      }
    case 'MSG_TO_FOR_DELETING_ARR':
      return {
        ...state, forDeletingMsgsArr: action.isDeleting ?
          [...state.forDeletingMsgsArr, action.messageId] : [...state.forDeletingMsgsArr.filter(id => id != action.messageId)]
      }

    case 'ERR_AT_DELETENG_MSG_ARR':
      return {
        ...state, errAtDeletingMsgsArr: action.isErr ?
          [...state.errAtDeletingMsgsArr, { messageId: action.messageId }] : [...state.errAtDeletingMsgsArr.filter(el => el.messageId != action.messageId)]
      }

    case 'SET_MY_COMPANIONS_LIST': return { ...state, dialogsList: action.data };
    case 'ERR_NEGOTIATORS_LIST_GET': return { ...state, errNegotiatorsListGet: action.errorCode };
    case 'DIALOGS_ARE_LOADING_TOGGLER': return { ...state, allDialogsIsLoading: action.allDialogs, certainDialogIsLoading: action.certainDialog }
    case 'ERR_CERTAIN_DIALOG_GET': return { ...state, errCertainDialogGet: action.error.substr(1, action.error.length - 2) };
    case 'SET_TALK_WITH_USER':
      let certainListCopy = [...action.data.items];
      let actionDataCopy = { ...action.data };
      let newMsgCounter = state.newMessagesCounter;
      let dialogListCopy = [...state.dialogsList];
      dialogListCopy.find(el => {
        if (el.id === action.userId) {
          el.hasNewMessages = false;
          if (newMsgCounter) return newMsgCounter -= el.newMessagesCount;
          el.newMessagesCount = 0
        }
      })
      certainListCopy.forEach(el => { if (el.senderId === action.userId) { el.viewed = true } })
      actionDataCopy.items = certainListCopy;
      return { ...state, certainDialog: actionDataCopy, newMessagesCounter: newMsgCounter };
    case 'CREATE_AND_SET_NEW_DIALOG':
      type Photos_Type = { small: string, large: string }
      type NewDialogListItem_Type = {
        hasNewMessages: boolean,
        id: number,
        lastDialogActivityDate: null | string,
        lastUserActivityDate: null | string,
        newMessagesCount: number,
        photos: Photos_Type,
        userName: string,
      }
      let newDialogListItem: any | NewDialogListItem_Type = {
        hasNewMessages: false,
        id: action.userId,
        lastDialogActivityDate: null,
        lastUserActivityDate: null,
        newMessagesCount: 0,
        photos: { small: action.photos.small, large: action.photos.large },
        userName: action.fullName,
      };

      stateCopy.dialogsList.unshift(newDialogListItem);
      stateCopy = { ...state, certainDialog: { items: [] } }
      return stateCopy;

    case 'SEND_MESSAGE_TO_USER':
      let totalMsgCountInc: number = 0;                                                                   // этот колхоз из=за TS, ибо object possibly undefined
      if (state?.certainDialog?.totalCount) totalMsgCountInc = state.certainDialog.totalCount + 1         // и этот 
      let duplicateIndex = state.certainDialog.items.findIndex(item => item.actionKey === action.msgItem.actionKey);
      let finalArr: MessageData_Type[] = [...state.certainDialog.items];
      duplicateIndex === -1 ? finalArr = [...state.certainDialog.items, action.msgItem] : finalArr[duplicateIndex] = action.msgItem
      return { ...state, certainDialog: { items: finalArr, totalCount: duplicateIndex === -1 ? totalMsgCountInc : state.certainDialog.totalCount } };

    case 'DELETE_MESSAGE':
      let certainDialog = { ...state.certainDialog };
      let indexForDeleting = state.certainDialog.items.findIndex(item => item.id === action.messageId);
      certainDialog.items.splice(indexForDeleting, 1);

      let totalMsgCountDec: number = 0;                                                                   // этот колхоз из=за TS, ибо object possibly undefined
      if (state?.certainDialog?.totalCount) totalMsgCountDec = state.certainDialog.totalCount - 1
      return { ...state, certainDialog: { items: certainDialog.items, totalCount: totalMsgCountDec } }

    case 'ADDED_PREVIOUS_MSGS':
      let reverseItems = action.prevMsgs.reverse();
      reverseItems.forEach((el: MessageData_Type) => state.certainDialog.items.unshift(el))
      return stateCopy;

    case 'PREV_MSGS_LOADING_TOGGLER': return { ...state, prevMsgsIsLoading: action.prevMsgsIsLoading };
    case 'IS_ERROR_AT_GETTING_PREV_MSGS': return { ...state, errAtGettingPrevMsgs: action.isErr }

    case 'ON_SENDING_MSG_STATUS':
      let index = state.feedbackArr.findIndex((el) => (el.actionKey === action.actionKey));
      let newFeedbackArr = [...state.feedbackArr]
      index === -1 ?
        newFeedbackArr.unshift({ statNum: action.number, userId: action.userId, userName: action.userName, actionKey: action.actionKey }) :
        newFeedbackArr[index].statNum = action.number;
      return { ...state, feedbackArr: newFeedbackArr };

    case 'FEEDBACK_WINDOW_CLOSER':
      let arrDelItem = [...state.feedbackArr]
      let FBAindex = arrDelItem.findIndex((el) => el.actionKey === action.actionKey)
      arrDelItem.splice(FBAindex, 1)
      return { ...state, feedbackArr: arrDelItem };

    case 'DIALOG_AREA_ARR_WAS_CLEANED': return {
      ...state, errAtGettingPrevMsgs: false, forDeletingMsgsArr: [], certainDialog: { items: [] },
      errInSendingArr: [], errAtDeletingMsgsArr: [], prevMSGsCounter: 2
    }

    default: return stateCopy;
  }
};

