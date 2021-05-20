import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import stl from './../users/users.module.css'
import { PalsThemes_Type, FriendsActions_Type } from './friendsContainer';
import { InitialFriendsInfo_Type } from '../../../redux/friendsReducer';
import { UsersArr } from '../../../redux/app';
import { UsersThemesBGR_Type } from '../../../redux/backGroundSetter';
import cn from 'classnames/bind';
import { ModalMsgs_Type, WriterMode } from '../users/users';


type FriendsProps_Type = {
  themes: PalsThemes_Type
  palsInfo: InitialFriendsInfo_Type & UsersThemesBGR_Type
  palsFuncs: FriendsActions_Type
}

export let Friends: React.FC<FriendsProps_Type> = ({ themes, palsFuncs, palsInfo }) => {

  let [wrapperLocker, setWrapperLocker] = useState<string>('');
  let [friendsListPage, setFriendsListPage] = useState<number>(1);

  let followTogglerListener = (userId: number, userIsFollowed: boolean, error: string) => { palsFuncs.followThunkToggler(userId, userIsFollowed, error) }
  let getMyFriendsListener = (page: number) => { palsFuncs.getMyFriendsListThunk(page) }


  let mapWrapperRef = React.createRef<HTMLDivElement>();

  let [writeMsgMode, setWriteMsgMode] = useState<ModalMsgs_Type>({ servInfo: [] })

  let userIdTalkModeOn = (e: any, i: number) => {
    if (mapWrapperRef?.current && e.target.parentElement.parentElement.parentElement.parentElement.getBoundingClientRect().top <= mapWrapperRef?.current?.getBoundingClientRect().top) {
      e.target.parentElement.parentElement.parentElement.parentElement.scrollIntoView({ behavior: "smooth" })
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

  let userUnitStlDefolter = () => {
    if (writeMsgMode.servInfo.length) {
      let newServInfo = [...writeMsgMode.servInfo]
      newServInfo.forEach(el => { if (el !== undefined) el.flag = false })
      let finalState = { servInfo: newServInfo }
      setWriteMsgMode(writeMsgMode = finalState); setWrapperLocker('');
    }
  }

  window.onkeyup = (e: KeyboardEvent) => { e.key === 'Escape' && userUnitStlDefolter() }

  type indexEl_Type = { index: number, elem: any }
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

  let [delayFlag, setDelayFlag] = useState(false)
  useEffect(() => {
    setTimeout(() => { setDelayFlag(true) }, 4000)
  }, [])

  return <>
    <div className={cn(stl.friendsGeneral, themes.friendsGeneralDnmc, delayFlag && stl.delay)}>
      {palsInfo.friendsListIsLoading ?                                                    // список друзей загружается? 
        <div className={stl.loaderDiv_Friends}>
          <img className={stl.loader} src={palsInfo.generalLDR_GIF} alt="Err" />
        </div> :
        palsInfo.errOnGettingFriends ?                                                    // есть ошибка при загрузке?
          <div className={cn(stl.Houston)}>
            <h2>Houston, we've got a problem...</h2>
            <h2>{palsInfo.errOnGettingFriends}</h2>
            <button className={`${stl.moreUsersShower} ${themes.pagBTNDnmc}`} onClick={() => getMyFriendsListener(friendsListPage)}
            >Try again</button>
          </div>
          :
          !palsInfo.friendsList.length ?                                                  //есть ли друзья в списке?
            <div className={stl.noFriendsWrapper}>
              <p>No friends here so far...</p>
            </div> :
            <>
              <div className={cn(stl.friendsHeader, themes.generalHeaderDnmc)}>
                <h2 className={stl.friendsHeaderH2}>Friends {palsInfo.friendsCount ? `(${palsInfo.friendsList.length} / ${palsInfo.friendsCount})` : null}</h2>
              </div>
              <div ref={mapWrapperRef} className={cn(stl.mapWrapper, themes.mapWrapperDnmc, wrapperLocker)}>
                {palsInfo.friendsList.map((user: UsersArr, i, users) =>
                  <div className={stl.userUnitContainer} key={user.id}>
                    <div className={!writeMsgMode.servInfo[i]?.flag ? cn(stl.userUnit, themes.userUnitDnmc, stl.userUnitShowed) :
                      cn(stl.userUnitHidden)} >
                      <div className={stl.avaDiv}>
                        <NavLink to={`/profile/${user.id}`}>
                          <img src={user.photos.large || palsInfo.defaultAvatar} alt='err'
                            className={`${themes.userAvaDnmc}`} />
                        </NavLink>
                      </div>
                      <div className={stl.nameStateBTNs}>
                        <div className={stl.userBlockInfo}>
                          <NavLink to={`/profile/${user.id}`}>
                            <h2 className={cn(stl.userName, themes.userNameDnmc)}>{user.name} </h2>
                          </NavLink>
                          <p className={`${themes.userNameDnmc}`}>{user.status}</p>
                        </div>
                        <div className={stl.followNWriteBTNS}>
                          <button
                            id={user.id}
                            disabled={palsInfo.followingInProgress.some(id => id === user.id)}
                            className={cn(stl.followBTN, user.error ? themes.followBTN_ERR_DNMC : themes.followBTNDnmc)}
                            onClick={() => followTogglerListener(user.id, user.followed, user.error)}
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
                              <div className={stl.followBTNLoader}> {palsInfo.followingInProgress.some(id => id === user.id) && <img src={palsInfo.BTN_FLW_GIF} alt="Err" />} </div>
                            </div>
                          </button>
                          <button className={`${stl.followBTN} ${themes.followBTNDnmc}`}
                            onClick={(e) => userIdTalkModeOn(e, i)}
                          > Write message
                          </button>
                        </div>
                      </div>
                    </div>
                    {writeMsgMode.servInfo[i]?.flag &&
                      <WriterMode
                        index={i}
                        userEl={users[i]}
                        themes={themes}
                        sendMsg={palsFuncs.sendMessageToUserThunk}
                        closer={writeMsgMode.servInfo[i].closer}
                        delayFlag={delayFlag} />
                    }
                  </div>
                )}
              </div>
              <div className={cn(stl.moreUserUnits, themes.moreUserUnitsDnmc, delayFlag && stl.delay)}>
                <button
                  disabled={palsInfo.moreFriendsIsLoading || palsInfo.friendsCount === palsInfo.friendsList.length}
                  className={cn(stl.moreUsersShower, palsInfo.errOnGettingFriends ? themes.followBTN_ERR_DNMC : themes.pagBTNDnmc)}
                  onClick={() => { setFriendsListPage(++friendsListPage); getMyFriendsListener(friendsListPage) }}
                >
                  <div className={stl.followBTNContainer}>
                    <div className={stl.followBTNText}>
                      {palsInfo.errOnGettingFriends ?
                        <>
                          <p className={stl.onFollowingErrBTN}>{palsInfo.moreFriendsLoadErr} Err!</p>
                          <p className={stl.tryAgainBTN}>Try again!</p>
                        </>
                        :
                        palsInfo.friendsCount === palsInfo.friendsList.length ? 'All list loaded!' : " Show more!"} </div>
                    <div className={stl.followBTNLoader}> {palsInfo.moreFriendsIsLoading && <img src={palsInfo.BTN_FLW_GIF} alt="Err" />} </div>
                  </div>
                </button>

              </div>
            </>
      }
    </div>
  </>
};

