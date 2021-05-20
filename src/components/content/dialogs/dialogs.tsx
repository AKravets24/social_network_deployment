import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useRouteMatch } from 'react-router-dom';
import { Field, Formik } from 'formik';
import stl from './dialogs.module.css';
import {
  getColorTheme, getDialogsACs_compDialogs,
  getMyId, getSmartDialogsReducer, getThemesDelayFlag
} from "../../../redux/selectors";
import { InitialDialogsState_Type } from '../../../redux/dialogsReducer';
import { DialoguesThemes_Type } from '../../../redux/backGroundSetter';
import { getSmartDialogsLoaders } from '../../../redux/selectors';
import { MatchHook_Type } from "../../RouterHooksTypes";
import { MessageData_Type } from "../../../redux/app";
import { v4 as uuidv4 } from 'uuid';
import cn from 'classnames/bind';


type DialogsActions_Types = {
  getMyNegotiatorsListThunk: () => void
  getTalkWithUserThunk: (userId: number) => void
  sendMessageToUserThunk: (userId: number, msg: string, actionKey: string, userName: string, senderId: number) => void
  talkedBeforeThunk: (userId: number) => void
  setSelectedMessages: (messageId: string) => void
  setSpamMessagesThunk: (messageId: string, index: number) => void
  deleteMessageThunk: (messageId: string, index: number) => void
  addPrevMessagesThunk: (dialogId: number, msgCount: number, pageNumber: number) => void
  userCompCleaner: () => void,
}

type Themes_Type = {
  activeLink: string, dialogAreaBackgroundNSecondScroll: string, dialogDnmc: string, firstScroller: string, errBTNDnmc: string, msgMeDnmc: string, msgUserDnmc: string, sendBTNDnmc: string, talkerBlockA: string, nameInHeaderDnmc: string, talkerBlockTheme: string, textAreaDnmc: string
}

let DialogFuncContainer = () => {
  let match: MatchHook_Type = useRouteMatch();
  let dialogsInfo = useSelector(getSmartDialogsReducer);
  let myId = useSelector(getMyId);
  let themesDelayFlag = useSelector(getThemesDelayFlag);
  let colorTheme = useSelector(getColorTheme);
  let dialogACs = useSelector(getDialogsACs_compDialogs);
  let loaders = useSelector(getSmartDialogsLoaders)



  let dispatch = useDispatch();
  let dialogActions: DialogsActions_Types = {
    getMyNegotiatorsListThunk: () => dispatch(dialogACs.getMyNegotiatorsListThunkAC()),
    getTalkWithUserThunk: (userId: number) => dispatch(dialogACs.getTalkWithUserThunkAC(userId)),
    sendMessageToUserThunk: (userId: number, msg: string, actionKey: string, userName: string, senderId: number) =>
      dispatch(dialogACs.sendMessageToUserThunkAC(userId, msg, actionKey, userName, senderId)),
    talkedBeforeThunk: (userId: number) => dispatch(dialogACs.talkedBeforeThunkAC(userId)),
    setSelectedMessages: (messageId: string) => dispatch(dialogACs.setSelectedMessagesAC(messageId)),
    setSpamMessagesThunk: (messageId: string, index: number) => dispatch(dialogACs.setSpamMessagesThunkAC(messageId, index)),
    deleteMessageThunk: (messageId: string, index: number) => dispatch(dialogACs.deleteMessageThunkAC(messageId, index)),
    addPrevMessagesThunk: (dialogId: number, msgCount: number, pageNumber: number) =>
      dispatch(dialogACs.addPrevMessagesThunkAC(dialogId, msgCount, pageNumber)),
    userCompCleaner: () => dispatch(dialogACs.dialogCompCleaner())
  }



  useEffect(() => {
    match?.params?.userId ? dialogActions.talkedBeforeThunk(+match.params.userId) : dialogActions.getMyNegotiatorsListThunk();

    return () => dialogActions.userCompCleaner()
  }, [])

  let [themes, setThemes] = useState<Themes_Type>({ dialogDnmc: '', firstScroller: '', errBTNDnmc: '', talkerBlockTheme: '', activeLink: '', talkerBlockA: '', msgMeDnmc: '', msgUserDnmc: '', dialogAreaBackgroundNSecondScroll: '', nameInHeaderDnmc: '', textAreaDnmc: '', sendBTNDnmc: '', })
  useEffect(() => {
    switch (colorTheme) {
      case 'NIGHT': return setThemes({
        ...themes, dialogDnmc: stl.dialogN, firstScroller: stl.dialogListN, errBTNDnmc: stl.followBTN_ERR_N, talkerBlockTheme: stl.talkerBlockN, activeLink: stl.activeLinkN, talkerBlockA: stl.talkerBlockA_N, msgMeDnmc: stl.myMsgN,
        msgUserDnmc: stl.userMsgN, dialogAreaBackgroundNSecondScroll: stl.dialogAreaN, nameInHeaderDnmc: stl.nameInHeaderN, textAreaDnmc: stl.textareaN, sendBTNDnmc: stl.sendBTN_N,
      });
      case 'MORNING': return setThemes({
        ...themes, dialogDnmc: stl.dialogM, firstScroller: stl.dialogListM, errBTNDnmc: stl.followBTN_ERR_M, talkerBlockTheme: stl.talkerBlockM, activeLink: stl.activeLinkM, talkerBlockA: stl.talkerBlockA_M, msgMeDnmc: stl.myMsgM,
        msgUserDnmc: stl.userMsgM, dialogAreaBackgroundNSecondScroll: stl.dialogAreaM, nameInHeaderDnmc: stl.nameInHeaderM, textAreaDnmc: stl.textareaM, sendBTNDnmc: stl.sendBTN_M,
      });
      case 'DAY': return setThemes({
        ...themes, dialogDnmc: stl.dialogD, firstScroller: stl.dialogListD, errBTNDnmc: stl.followBTN_ERR_D, talkerBlockTheme: stl.talkerBlockD, activeLink: stl.activeLinkD, talkerBlockA: stl.talkerBlockA_D, msgMeDnmc: stl.myMsgD,
        msgUserDnmc: stl.userMsgD, dialogAreaBackgroundNSecondScroll: stl.dialogAreaD, nameInHeaderDnmc: stl.nameInHeaderD, textAreaDnmc: stl.textareaD, sendBTNDnmc: stl.sendBTN_D,
      });
      case 'EVENING': return setThemes({
        ...themes, dialogDnmc: stl.dialogE, firstScroller: stl.dialogListE, errBTNDnmc: stl.followBTN_ERR_E, talkerBlockTheme: stl.talkerBlockE, activeLink: stl.activeLinkE, talkerBlockA: stl.talkerBlockA_E, msgMeDnmc: stl.myMsgE,
        msgUserDnmc: stl.userMsgE, dialogAreaBackgroundNSecondScroll: stl.dialogAreaE, nameInHeaderDnmc: stl.nameInHeaderE, textAreaDnmc: stl.textareaE, sendBTNDnmc: stl.sendBTN_E,
      });
    }
  }, [colorTheme])

  return themes.dialogDnmc ? <Dialogs
    state={dialogsInfo}
    userIdInURL={match?.params?.userId}
    myId={myId}
    delayFlag={themesDelayFlag}
    themes={themes}
    actions={dialogActions}
    loaders={loaders}
  /> : null;
}

type DialogsProps_Type = {
  myId: null | number
  state: InitialDialogsState_Type
  delayFlag: boolean
  themes: Themes_Type
  userIdInURL: undefined | string | number
  actions: DialogsActions_Types
  loaders: DialoguesThemes_Type
}

type ServInfo_Type = {
  [key: string]: {
    flag?: boolean,
    myId?: number | null,
    dialogId?: number,
    wasError?: boolean,
    isMyMsg?: boolean,
    deleteMsg?: (messageId: string, index: number) => void,
    markAsSpam?: (messageId: string, index: number) => void,
    sendMsg?: (userId: number, msg: string, actionKey: string, userName: string, senderId: number) => void,
    servInfoCorrecter?: (msgId: string) => void,
    closer?: (key: string) => void
  }
}


let Dialogs: React.FC<DialogsProps_Type> = ({ myId, state, themes, userIdInURL, actions, loaders, delayFlag }) => {

  const dialogArea = useRef<HTMLDivElement | any>(null);
  const bufferBlock = useRef<HTMLDivElement>(null);

  interface AreaHeight { }
  type Error_Type = { text?: string }

  let [dialogId, setDialogId] = useState(userIdInURL === undefined ? 0 : +userIdInURL);
  let [msgsMapDone, setMsgsMapDone] = useState(0); //диалог:  0 = не загружен, 1 = загружен первично, 2 = загрузка предыдущей части 3 = загружена предыдущая часть
  let [dialogAreaHeight, setDialogAreaHeight] = useState<AreaHeight | any>(0);
  let [userNameInHeader, setUserNameInHeader] = useState('');

  let counterSetter = useSelector(getDialogsACs_compDialogs).prevMSGsCounterSetter;
  let dispatch = useDispatch();

  let getTalk = (userId: number) => {
    setDialogId(dialogId = userId); dispatch(counterSetter(2)); actions.getTalkWithUserThunk(dialogId)
  };

  let oldMsgLazyLoader = () => {
    actions.addPrevMessagesThunk(dialogId, 10, state.prevMSGsCounter);
    setMsgsMapDone(2);
  };


  useEffect(() => {
    if (msgsMapDone === 1) {
      scrollToDown(bufferBlock)
    }
    else if (msgsMapDone === 3 && !state.prevMsgsIsLoading) {
      dialogArea?.current?.scrollTo(0, dialogArea?.current?.scrollHeight - dialogAreaHeight)
    }

    if (dialogId) {
      let user = state.dialogsList.find(el => el.id === dialogId)
      if (user) return setUserNameInHeader(user.userName)
    }
  }, [msgsMapDone, !state.prevMsgsIsLoading])


  type Value_Type = { text: string }
  let submitter = (values: Value_Type, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    actions.sendMessageToUserThunk(dialogId, values.text, uuidv4() as string, '', myId as number); values.text = ''; setSubmitting(false);
    bufferBlock?.current?.scrollIntoView({ behavior: "auto" })
  }

  let keyCodeChecker = (e: KeyboardEvent, values: Value_Type, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    if (e.keyCode == 13 && e.shiftKey) { return }
    else if (e.keyCode === 13 && !state.certainDialogIsLoading && !state.errCertainDialogGet) {
      submitter(values, { setSubmitting })
    }
  }
  let validator = (values: Value_Type) => { let errors: Error_Type = {}; if (!values.text) { errors.text = 'Required' } return errors }


  let [servInfo, setServInfo] = useState<ServInfo_Type>({})
  let onRightClickListener = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, i: number, arr: MessageData_Type[], msgId: string) => {
    e.preventDefault();
    let newServInfo = { ...servInfo }
    if (!newServInfo[msgId]) newServInfo[msgId] = {}
    newServInfo[msgId].flag = newServInfo[msgId]?.flag ? false : true;
    newServInfo[msgId].myId = myId;
    newServInfo[msgId].dialogId = dialogId;
    newServInfo[msgId].wasError = state.errInSendingArr.some(el => el.actionKey === arr[i].actionKey)
    newServInfo[msgId].isMyMsg = myId === arr[i].senderId;
    newServInfo[msgId].deleteMsg = actions.deleteMessageThunk
    newServInfo[msgId].markAsSpam = actions.setSpamMessagesThunk
    newServInfo[msgId].sendMsg = actions.sendMessageToUserThunk
    newServInfo[msgId].closer = (key: string) => modalCloser(key)
    setServInfo(servInfo = newServInfo)
  }

  let [indexEl, setIndexEl] = useState<{ key: string }>({ key: '' })
  useEffect(() => { if (indexEl.key) { let newServInfo = { ...servInfo }; delete newServInfo[indexEl.key]; setServInfo(servInfo = newServInfo); } }, [indexEl])
  let modalCloser = (key: string) => { setIndexEl({ key }) }

  window.onkeyup = ({ key }: KeyboardEvent) => { if (key === "Escape") { setServInfo(servInfo = {}) } };


  let scrollToDown = (bufferBlock: any) => { bufferBlock.current && bufferBlock.current.scrollIntoView({ behavior: "auto" }) };

  let [btnShow, setBtnShow] = useState<Number>(0); // 0: ничего не показывать, 1: кнопка вниз, 2: кнопка вверх (возвращает на предыдущую высоту)
  let [wasClicked, setWasClicked] = useState(false)
  let [prevHeight, setPrevHeight] = useState<Number>(0);
  let [dialogChanging, setDialogChanging] = useState<boolean>(false)

  let scrollControler = () => {
    if (dialogArea?.current?.scrollHeight - dialogArea?.current?.scrollTop - dialogArea?.current?.clientHeight + 1 >= 200) { setBtnShow(1); setPrevHeight(0) }
    else if (dialogArea?.current?.scrollHeight - dialogArea?.current?.scrollTop - dialogArea?.current?.clientHeight + 1 <= 200 && wasClicked) { setBtnShow(2) }
    else { setBtnShow(0) }
    if (wasClicked) setWasClicked(false)
    !dialogArea?.current?.scrollTop && state?.certainDialog.items.length !== state.certainDialog.totalCount &&
      !state.prevMsgsIsLoading && !dialogChanging && oldMsgLazyLoader()

  }


  let [prevBTNisShown, setPrevBTNisShown] = useState<boolean>(false);
  let hasScroll = () => {
    if (state.certainDialog.items.length)
      dialogArea?.current?.scrollHeight > dialogArea?.current?.clientHeight ? setPrevBTNisShown(false) : setPrevBTNisShown(true);
  }
  (function () {
    window.addEventListener("resize", resizeThrottler, false);
    let resizeTimeout: any;
    function resizeThrottler() { if (!resizeTimeout) { resizeTimeout = setTimeout(() => { resizeTimeout = null; hasScroll(); }, 500); } }
  }())


  useEffect(() => { hasScroll() }, [state.certainDialogIsLoading, state.prevMsgsIsLoading])

  return <>
    <div className={cn(stl.dialogsPage, themes.dialogDnmc, delayFlag && stl.delay)}>
      <div className={stl.dialogListAndArea}>
        <div className={cn(stl.dialogList)}>
          <div className={cn(stl.constrictor, themes.firstScroller)}>
            {state.allDialogsIsLoading ?                                                 // диалоги загружаются?
              <div className={stl.dialogListLoaderWrapper}>
                <img className={stl.dialogListLoader} src={loaders.halfCircle_GIF} alt="Err" />
                <img className={stl.dialogListLoader} src={loaders.interSector_GIF} alt="Err" />
                <img className={stl.dialogListLoader} src={loaders.halfCircle_GIF} alt="Err" />
              </div>
              :
              state.errNegotiatorsListGet ?                                               // есть оштбки при загрузке?
                <div className={stl.errorBlock}>
                  <h2>Error!</h2>
                  <div>
                    <img src={state.errNegotiatorsListPIC} alt="Err" />
                  </div>
                  <p>{state.errNegotiatorsListGet} Connection lost!</p>
                  <button className={`${stl.errBTN} ${themes.sendBTNDnmc}`}
                    onClick={() => actions.getMyNegotiatorsListThunk()}
                  >Try again</button>
                </div>
                :
                state.dialogsList
                  .map((user, i) =>
                    <div className={cn(stl.talkerBlock, themes.talkerBlockTheme, delayFlag && stl.delay)} key={i} >
                      <div className={stl.avaWrapper}>
                        <NavLink to={`/profile/${user.id}`} >
                          <img src={user.photos.large || state.defaultAvatar} alt="err" />
                          <span className={cn(stl.msgCounter, themes.talkerBlockA)}> {user.hasNewMessages && `+${user.newMessagesCount}`}</span>
                        </NavLink>
                      </div>
                      <div className={stl.userNameWrapper}>
                        <NavLink to={`/dialogs/${user.id}`}
                          onClick={() => { getTalk(user.id); setMsgsMapDone(0); setBtnShow(0); setDialogChanging(true); actions.userCompCleaner() }}
                          className={themes.talkerBlockA}
                          activeClassName={themes.activeLink}>
                          {user.userName}
                        </NavLink>
                      </div>
                    </div>)}
          </div>
        </div>
        <div className={stl.dialogsAreaAndSender}>
          <div className={stl.editWrapper}>
            <h2 className={themes.nameInHeaderDnmc}>{userNameInHeader}</h2>
          </div>
          <div className={cn(stl.dialogArea, themes.dialogAreaBackgroundNSecondScroll)}
            ref={dialogArea} onScroll={() => scrollControler()} onContextMenu={e => e.preventDefault()} >
            {!state.dialogsList.length && !state.allDialogsIsLoading && !state.errNegotiatorsListGet &&            // если ни с кем еще не было диалогов
              <div className={stl.noDialogsList}>
                <p>No dialogs here so far...</p>
              </div>}
            <div className={stl.oldMsgsLoader}>
              {state.prevMsgsIsLoading ? <img src={loaders.prevMSGLDR_GIF} alt="Err" /> :                          // предыдущие сообщения грузятся? | лодер
                state.errAtGettingPrevMsgs && <button
                  className={cn(stl.prevBTNLdrBasic, prevBTNisShown ? themes.errBTNDnmc : stl.BTNPassive)}
                  onClick={() => { return prevBTNisShown ? oldMsgLazyLoader() : null }}
                >Failed to load previous messages. Try again.</button>                                             // есть ошибка?                   | соболезнования
              }
              {prevBTNisShown && !state.errAtGettingPrevMsgs && !state.prevMsgsIsLoading &&
                !state.certainDialogIsLoading && state?.certainDialog.items.length !== state.certainDialog.totalCount &&
                <button onClick={oldMsgLazyLoader}
                  className={cn(stl.prevBTNLdrBasic, prevBTNisShown ? stl.addPrevBTNShown : stl.addPrevBTNHidden, themes.sendBTNDnmc)}
                >Add previous messages</button>}
            </div>
            {state.certainDialogIsLoading ? <div className={stl.certainLDRWrapper}><img src={loaders.certainLDR_GIF} alt="err" /></div> :
              state.errCertainDialogGet ? <div className={stl.errorBlock}> {state.errCertainDialogGet}</div> :
                dialogId ? state?.certainDialog?.items
                  .map((msg, i, msgs) => {
                    if (msgsMapDone === 0 && i === msgs.length - 1) { setMsgsMapDone(1); setDialogAreaHeight(dialogArea?.current?.scrollHeight); setDialogChanging(false) }
                    if (msgsMapDone === 2 && i === msgs.length - 1) { setMsgsMapDone(3); setDialogAreaHeight(dialogArea?.current?.scrollHeight); setDialogChanging(false) }

                    return <div
                      key={msg.id}
                      className={cn(myId !== null && +msg.senderId === +myId ? `${stl.messageBlockMe} ${themes.msgMeDnmc} ${delayFlag && stl.delay} ` : `${stl.messageBlockUser} ${themes.msgUserDnmc} ${delayFlag && stl.delay}`)}
                      id={msg.id}
                      onContextMenu={(e) => {
                        return state.sendndigInProgress.some(el => el === msg.actionKey) ? null : onRightClickListener(e, i, msgs, msg.id)
                      }}
                    >
                      <p className={stl.messageBody} >{msg.body}</p>
                      <div className={stl.msgStatWrapper}>
                        {state.forDeletingMsgsArr.some(id => id === msg.id) && <img className={stl.ldrAndErr} src={state.msgLoaderGIF} alt="Err" />}
                        {state.sendndigInProgress.some(el => el === msg.actionKey) && <img className={stl.ldrAndErr} src={state.msgLoaderGIF} alt="Err" />}
                        {state.errInSendingArr.some(el => el.actionKey === msg.actionKey) && <img className={stl.ldrAndErr} src={state.onError} alt="Err" />}
                        <p className={cn(
                          state.errInSendingArr.some(el => el.actionKey === msg.actionKey) || state.errAtDeletingMsgsArr.some(el => el.messageId === msg.id) ? stl.errorMarker :
                            myId !== null && +msg.senderId === +myId ? stl.messageBlockTimeMe : stl.messageBlockTimeUser)}
                        > {state.sendndigInProgress.some(el => el === msg.actionKey) ? 'loading...' :                                         // сообщение  отправляется? 
                          state.forDeletingMsgsArr.some(id => id === msg.id) ? 'deleting...' :                                                // сообщение удаляется?
                            state.errInSendingArr.some(el => el.actionKey === msg.actionKey) ?                                                // пришла ошибка от сервера? 
                              state.errInSendingArr.map(el => { if (el.actionKey === msg.actionKey) return `Error: ${el.error}!` }) :
                              state.errAtDeletingMsgsArr.some(el => el.messageId === msg.id) ?                                                // ошибка при удалении? 
                                state.errAtDeletingMsgsArr.map(el => { if (el.messageId === msg.id) return `Deletng error!` }) :

                                `${msg.addedAt.substring(2, 10)}  ${msg.addedAt.substring(11, 16)}`                                           // тогда рендерим инфо
                          } </p>
                        {state.sendndigInProgress.some(el => el === msg.actionKey) === false && state.errInSendingArr.some(el => el.actionKey === msg.actionKey) === false &&
                          <img className={stl.checkMark} src={msg.viewed ? state.msgSeenFlagPIC : state.msgDeliveredFlagPIC} alt="Err" />}
                      </div>
                      {servInfo[msg.id]?.flag && <ModalMenu
                        index={i}
                        msgEl={msgs[i]}
                        servInfo={servInfo[msg.id]}
                      />}
                    </div>
                  }) : null}
            <div ref={bufferBlock} />
          </div>
          <div className={stl.sender}>

            <button className={btnShow === 0 ? stl.scrollToDownBtnHidden : btnShow === 1 ? stl.scrollToDownBtn : stl.scrollToPrevHeightBTN}

              onClick={() => {
                if (btnShow === 1) { setPrevHeight(dialogArea?.current?.scrollTop); scrollToDown(bufferBlock); setWasClicked(true) }
                else if (btnShow === 2) { dialogArea?.current?.scrollTo(0, prevHeight); setPrevHeight(0) }
              }}>
              <img src={state.arrowDownPIC} alt="Err" />
            </button>
            <div className={stl.senderWrapper}>
              <Formik initialValues={{ text: '' }} validate={validator} onSubmit={submitter} >
                {({ values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting }) => (
                  <form onSubmit={handleSubmit} >
                    <Field name="text" onChange={handleChange} value={values.text} placeholder={errors.text} as='textarea'
                      className={cn(stl.txtAreaField, themes.textAreaDnmc, delayFlag && stl.delay)} disabled={!dialogId}
                      onKeyDown={(e: KeyboardEvent) => (keyCodeChecker(e, values, {
                        setSubmitting
                      }))}
                    />
                    <div className={stl.sendBTNWrapper}>
                      {dialogId ?
                        <button disabled={isSubmitting || state.certainDialogIsLoading || !!state.errCertainDialogGet} className={cn(stl.sendBTN, themes.sendBTNDnmc)}
                        > Send </button> : null
                      }
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
};


type ModalMenuProps_Type = {
  index: number,
  msgEl: MessageData_Type,
  servInfo: ServInfo_Type['key'] | any // тут всё до невозможности понятно, any исключительно возможно для того чтобы ts возможно отстал со своим невозможным possibly undefined
}

let ModalMenu = React.memo(({ index, msgEl, servInfo }: ModalMenuProps_Type) => {


  let spamMarker = (msgId: string, index: number) => { servInfo.markAsSpam(msgId, index); servInfo.closer(msgEl.id) }
  let msgDeleter = (msgId: string, index: number) => { servInfo.deleteMsg(msgId, index); servInfo.closer(msgEl.id) }
  let msgSender = (dialogId: number, mesgBody: string, actionKey: string, userName: string, myId: number) => { servInfo?.sendMsg(dialogId, mesgBody, actionKey, userName, myId); servInfo?.closer(msgEl.id) }

  return <div className={cn(servInfo?.isMyMsg ? `${stl.contextMenu} ${stl.contMenuMyMsg}` : `${stl.contextMenu} ${stl.contMenuFriendMsg}`)}>
    <div className={stl.contextMenuUpper} >
      <div className={stl.repeatNSpam} onClick={() => spamMarker(msgEl.id, index)}>Mark as spam</div>
      <button onClick={() => servInfo?.closer(msgEl.id)}>X</button>
    </div>
    <div className={stl.deleteMsg} onClick={() => servInfo?.wasError ? msgSender(servInfo?.dialogId, msgEl.body, msgEl.actionKey, '', servInfo?.myId) : msgDeleter(msgEl.id, index)}>
      {servInfo?.wasError ? 'Resend' : 'Delete message'}</div>
  </div>
})

export default DialogFuncContainer;

