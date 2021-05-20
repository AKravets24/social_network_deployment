import React, { useState, useEffect, useRef, Children, } from "react";
import stl from './users.module.css';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import { Field, Formik } from 'formik';
import { v4 as uuidv4 } from 'uuid';
import { UsersThemes_Type, usersActions_Type } from "./usersContainer";
import { InitialUsersInfo_Type } from "../../../redux/usersReducer";
import { UsersThemesBGR_Type } from "../../../redux/backGroundSetter";
import * as queryString from 'querystring';
import cn from 'classnames/bind';
import { UsersArr } from "../../../redux/app";
import { PalsThemes_Type } from "../friends/friendsContainer";
// import UnAuthorised                       from "../unAuthorised/unAuthorised";


type UsersProps_Type = {
  themes: UsersThemes_Type
  usersInfo: InitialUsersInfo_Type & UsersThemesBGR_Type
  usersFuncs: usersActions_Type
  delayFlag: boolean
}

export type ModalMsgs_Type = { servInfo: { flag?: boolean, closer?: (i: number, e: any) => void }[] }

export let Users: React.FC<UsersProps_Type> = ({ themes, usersInfo, usersFuncs, delayFlag }) => {

  type Error_Type = { text?: string }
  type Value_Type = { text: string }

  let [wrapperLocker, setWrapperLocker] = useState('');
  let [portionNumber, setPortionNumber] = useState(1);
  let [searchMode, setSearchMode] = useState(false);
  let [userSearchName, setUserSearchName] = useState<string>('')

  let history = useHistory();

  let { totalCount, pageSize } = usersInfo;
  let pagesAmount = Math.ceil(totalCount / pageSize)

  useEffect(() => {
    if (parsedString['term'] && parsedString['term'] !== '') { setSearchMode(true); setUserSearchName(parsedString['term'] as string) }
    if (parsedString['?page'] && totalCount && +parsedString['?page'] > pagesAmount) {
      usersFuncs.getUsersThunk(pageSize, pagesAmount); setPortionNumber(Math.ceil(totalCount / 1000))
    } else if (parsedString['?page']) { setPortionNumber(Math.ceil(+parsedString['?page'] / 10)) }
  }, [totalCount])

  let Paginator = () => {
    let pageStep = 10;
    let leftPortionPageNumber = (portionNumber - 1) * pageStep + 1
    let rightPortionPageNumber = portionNumber * pageStep;
    let portionCount = Math.ceil(pagesAmount / pageStep)
    let pagesArr = [];
    for (let i = 1; i <= pagesAmount; i++) { pagesArr.push(i) }

    let defaultStylesUsersSetter = (e: any) => {
      let userUnitStlArr: HTMLDivElement[] = Array.from(e.target.parentElement.parentElement.parentElement.children[1]?.children)
      userUnitStlArr.forEach((el) => el.children[0].className = cn(stl.userUnit, themes.userUnitDnmc, stl.userUnitShowed))
      setWriteMsgMode(writeMsgMode = { servInfo: [] });

    }
    return !!pagesAmount ? <div className={stl.paginationBlockOutside} >
      <button className={`${stl.pagBTN} ${themes.pagBTNDnmc}`} onClick={() => setPortionNumber(portionNumber - 1)}
        disabled={portionNumber === 1}> &#171; {pageStep} </button>
      {pagesArr
        .filter(p => p >= leftPortionPageNumber && p <= rightPortionPageNumber)
        .map(p => {
          return <span key={p} className={usersInfo.currentPage === p ? `${stl.paginationSelected} ${themes.paginationSelectedDnmc}` :
            `${stl.pagination} ${themes.paginationDnmc}`}
            onClick={(e) => {
              mapWrapperRef?.current?.scrollTo(0, 0)
              if (!usersInfo.isLoading) {
                if (searchMode && usersInfo.currentPage !== p) { usersFuncs.getCertainUserThunk(pageSize, userSearchName, p); defaultStylesUsersSetter(e) }
                else { setPageListener(pageSize, p); defaultStylesUsersSetter(e) }
              }
            }}
          >{p}
          </span>
        })}
      <button className={`${stl.pagBTN} ${themes.pagBTNDnmc}`} onClick={() => setPortionNumber(portionNumber + 1)}
        disabled={
          // pageStep > pagesAmount ||
          portionNumber > portionCount - 1
        }> {pageStep} &#187;</button>
    </div> : null
  };

  let setPageListener = (pageSize: number, page: number) => {
    usersFuncs.setCurrentPageThunk(pageSize, page);
    wrapperLocker && setWrapperLocker('');
  };

  let queryRequest = useLocation().search;
  let parsedString = queryString.parse(queryRequest);


  let friendsSeekerSubmitter = (userName: Value_Type, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    setSearchMode(true)
    setUserSearchName(userName.text)
    history.push({ pathname: 'users', search: `?page=${usersInfo.currentPage}&term=${userName.text}` })
    usersFuncs.getCertainUserThunk(pageSize, userName.text.trim(), 1)
    setSubmitting(false);
  }

  let searchModeCloseListener = () => {
    if (searchMode) {
      usersFuncs.setCurrentPageThunk(50, 1); setSearchMode(false);
      history.push({ pathname: 'users', search: `?page=${usersInfo.currentPage}` })
    } usersFuncs.setErrorToNull();
  };

  let validator = (values: Value_Type) => { let errors: Error_Type = {}; if (!values.text.trim()) { values.text = ''; errors.text = 'Required' } return errors }


  let [writeMsgMode, setWriteMsgMode] = useState<ModalMsgs_Type>({ servInfo: [] })

  let userIdTalkModeOn = (e: any, i: number,) => {
    if (mapWrapperRef?.current && e.target.parentElement.parentElement.parentElement.parentElement.getBoundingClientRect().top <= mapWrapperRef?.current?.getBoundingClientRect().top) {
      e.target.parentElement.parentElement.parentElement.parentElement.scrollIntoView({ behavior: "smooth" }) //плавный автоСкролл если элемент если он вызе вьюпорта
    }
    setWrapperLocker(stl.wrapperLocked);

    let newServInfo = [...writeMsgMode.servInfo]

    if (newServInfo[i] === undefined) { newServInfo[i] = { flag: true } }
    else if (newServInfo[i].flag === true) { newServInfo[i].flag = false; }
    else if (newServInfo[i].flag === false) { newServInfo[i].flag = true; }
    newServInfo[i].closer = (index: number, event: any) => modalCloser(index, event)
    let finalState = { servInfo: newServInfo }
    setWriteMsgMode(writeMsgMode = finalState)
  }

  let mapWrapperRef = React.createRef<HTMLDivElement>();

  let userUnitStlDefolter = () => {
    if (writeMsgMode.servInfo.length) {
      let newServInfo = [...writeMsgMode.servInfo]
      newServInfo.forEach(el => { if (el !== undefined) el.flag = false })
      let finalState = { servInfo: newServInfo }
      setWriteMsgMode(writeMsgMode = finalState); setWrapperLocker('');
    }
  }

  window.onkeyup = (e: KeyboardEvent) => { e.key === 'Escape' && userUnitStlDefolter() }

  type indexEl_Type = { index: number, elem: any }  // хз какой тип элемента должен быть
  let [indexEl, setIndexEl] = useState<indexEl_Type>({ index: -1, elem: '' })

  useEffect(() => {
    if (indexEl.index >= 0) {
      let newServInfo = [...writeMsgMode.servInfo]
      newServInfo[indexEl.index].flag = false
      let finalState = { servInfo: newServInfo }
      indexEl.elem.className = cn(stl.userUnit, themes.userUnitDnmc, stl.userUnitShowed)
      setWriteMsgMode(writeMsgMode = finalState)
      if (newServInfo.filter(el => el !== undefined).every(el => el.flag === false)) setWrapperLocker(stl.wrapperUnlocked);
    }
  }, [indexEl])

  let modalCloser = (i: number, e: any) => { setIndexEl({ index: i, elem: e }) }



  return <>
    <div className={cn(stl.usersPage, themes.userPageDnmc, delayFlag && stl.delay)} >
      <div className={stl.userInfo}>
        <div className={cn(stl.generalHeader, themes.generalHeaderDnmc, delayFlag && stl.delay)}>
          <h2 className={stl.userHeader}>Users</h2>
          <Paginator />
          <div className={stl.searchBlock} >
            <Formik initialValues={{ text: parsedString.term as string || '' }} validate={validator} onSubmit={friendsSeekerSubmitter}>
              {({ values, errors, handleChange, handleSubmit, isSubmitting, handleReset }) => (
                <form onSubmit={handleSubmit} onReset={handleReset}>
                  <Field name="text" type="text" value={values.text} onChange={handleChange} placeholder={errors.text}
                    className={cn(stl.searchInput, themes.searchInputDnmc, delayFlag && stl.delay)} />
                  <button type="submit" disabled={isSubmitting} className={cn(stl.pagBTN, themes.pagBTNDnmc)} >Find!</button>
                  <button className={cn(stl.pagBTN, themes.pagBTNDnmc)} type="reset" onClick={searchModeCloseListener} >X</button>
                </form>
              )}
            </Formik>
          </div>
        </div>
        {usersInfo.isLoading ?                                                                   // список юзеров грузится?
          <div className={stl.loaderDiv_Users}>
            <img className={stl.loader} src={usersInfo.generalLDR_GIF} alt="Err" />
          </div> :
          usersInfo.usersGettingError || usersInfo.userFindingError ?                            // ошибка при поиске юзеров?
            <div className={stl.Houston}>
              <h2>Houston, we've got a problem...</h2>
              <h2>{usersInfo.usersGettingError || usersInfo.userFindingError}</h2>
              {usersInfo.usersGettingError && <button
                className={cn(stl.moreUsersShower, themes.pagBTNDnmc)}
                onClick={() => { usersFuncs.setErrorToNull(); setPageListener(usersInfo.pageSize, usersInfo.currentPage); }}
              >Try again</button>}
            </div>
            :
            usersInfo.userNotFound && !usersInfo.initialUsersList.length ?                       // ничего не найдено при кастомном поиске?
              <div className={stl.nobodyFound}>
                <img src={usersInfo.userNotFoundGIF} alt="Err" />
                <h2>{usersInfo.userNotFound} =(</h2>
              </div> :
              <div ref={mapWrapperRef} className={cn(stl.mapWrapper, themes.mapWrapperDnmc, wrapperLocker, delayFlag && stl.delay)}>
                {usersInfo?.initialUsersList
                  .map((user, i, users) =>
                    <div className={stl.userUnitContainer} key={i}>
                      <div className={!writeMsgMode.servInfo[i]?.flag ? cn(stl.userUnit, themes.userUnitDnmc, stl.userUnitShowed) :
                        cn(stl.userUnitHidden)
                      } >
                        <div className={stl.avaDiv}>
                          <NavLink to={`/profile/${user.id}`}>
                            <img src={user.photos.large || usersInfo.defaultAvatar} alt='err'
                              className={`${themes.userAvaDnmc}`} />
                          </NavLink>
                        </div>
                        <div className={stl.nameStateBTNs}>
                          <div className={stl.userBlockInfo}>
                            <NavLink to={`/profile/${user.id}`}>
                              <h2 className={cn(stl.userName, themes.userNameDnmc)}>{user.name} </h2>
                            </NavLink>
                            <p>{user.status}</p>
                          </div>
                          <div className={stl.followNWriteBTNS}>

                            <button
                              id={user.id}
                              disabled={usersInfo.followingInProgress.some(id => id === user.id)}
                              className={cn(stl.followBTN, user.error ? themes.followBTN_ERR_DNMC : themes.followBTNDnmc)}
                              onClick={() => usersFuncs.followThunkToggler(user.id, user.followed, user.error)}
                            >
                              <div className={stl.followBTNContainer}>
                                <div className={stl.followBTNText}>
                                  {user.error ?
                                    <>
                                      <p className={stl.onFollowingErrBTN}>{user.error}</p>
                                      <p className={stl.tryAgainBTN}>Try again!</p>
                                    </>
                                    :
                                    user.followed ? 'unFollow' : 'Follow'} </div>
                                <div className={stl.followBTNLoader}> {usersInfo.followingInProgress.some(id => id === user.id) && <img src={usersInfo.BTN_FLW_GIF} alt="Err" />} </div>
                              </div>
                            </button>
                            <button className={cn(stl.followBTN, themes.followBTNDnmc)}
                              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => { userIdTalkModeOn(e, i) }}
                            >Write message </button>
                          </div>
                        </div>
                      </div>
                      {writeMsgMode.servInfo[i]?.flag &&
                        <WriterMode
                          index={i}
                          userEl={users[i]}
                          themes={themes}
                          sendMsg={usersFuncs.sendMessageToUserThunk}
                          closer={writeMsgMode.servInfo[i].closer}
                          delayFlag={delayFlag} />
                      }
                    </div >
                  )}
              </div>
        }
      </div>
      <div className={cn(stl.moreUserUnits, themes.moreUserUnitsDnmc)} />
    </div>
  </>
}

type WriterMode_Type = {
  themes: UsersThemes_Type | PalsThemes_Type,
  userEl: UsersArr,
  sendMsg: usersActions_Type['sendMessageToUserThunk'],
  index: number,
  delayFlag: boolean,
  closer: ((i: number, el: any) => void) | undefined

}

export let WriterMode = React.memo(({ themes, userEl, sendMsg, index, closer, delayFlag, }: WriterMode_Type) => {  // Прикруитть нормальную типизацию

  type Error_Type = { text?: string }
  type Value_Type = { text: string }
  let validator = (values: Value_Type) => { const errors: Error_Type = {}; if (!values.text) { errors.text = 'Required' } return errors }

  let formSubmitter = (userId: number, textValue: Value_Type, userName: string, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    let actionKey: string = uuidv4()
    sendMsg(userId, textValue.text, actionKey, userName);
    textValue.text = ''; setSubmitting(false);
  }
  let keyCodeChecker = (e: KeyboardEvent, userId: number, values: Value_Type, userName: string, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    if (e.keyCode == 13 && e.shiftKey) { return } // для переноса строки =)
    else if (e.keyCode === 13) { formSubmitter(userId, values, userName, { setSubmitting }) }
  }

  let closeAction = (index: number, elem: any) => {
    let element = elem?.parentElement?.parentElement?.parentElement?.parentElement?.children[index]?.children[0]
    if (closer) closer(index, element)
  }

  return <div className={cn(stl.userWriteMode, themes.userWriteModeDnmc, stl.userUnitShowed, delayFlag && stl.delay)}>

    <div className={stl.miniHeadWrapper}>
      <h2 className={cn(stl.userName, themes.userNameDnmc)}>{userEl.name}</h2>
      <NavLink to={`/dialogs/${userEl.id}`} >
        <button className={cn(stl.followBTN, themes.followBTNDnmc)}>
          Go to chat
        </button>
      </NavLink>

      <button className={cn(stl.closeBTN, stl.followBTN, themes.followBTNDnmc)}
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => { closeAction(index, e.target) }}
      >X</button>
    </div>
    <div className={stl.textAreaWrapper}>
      <Formik initialValues={{ text: '' }} validate={validator}
        onSubmit={(values, { setSubmitting }) => {
          formSubmitter(userEl.id, values, userEl.name, { setSubmitting }); values.text = ''; setSubmitting(false);
        }}>
        {({ values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <Field name="text" className={stl.talkTextarea} as='textarea'
              onChange={handleChange} value={values.text} placeholder={errors.text}
              onKeyDown={(e: KeyboardEvent) => (keyCodeChecker(e, userEl.id, values, userEl.name, { setSubmitting }))}
            />
            <button type="submit" disabled={isSubmitting} className={cn(stl.followBTN, themes.followBTNDnmc)}
            > Send Msg </button>
          </form>
        )}
      </Formik>
    </div>
  </div>

})
