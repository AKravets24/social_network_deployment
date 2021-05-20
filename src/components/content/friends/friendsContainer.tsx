import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Friends } from './friends';
import stl from './../users/users.module.css';
import { getColorTheme, GetSmartFriendsReducer, getFriendsACs, getDialogsACs_compUsers } from "../../../redux/selectors";
import { InitialFriendsInfo_Type, FriendsACs } from "../../../redux/friendsReducer";
import { DialogActions_Type } from "../../../redux/dialogsReducer";
import { FriendsThemesBGR_Type } from "../../../redux/backGroundSetter";


export type PalsThemes_Type = {
  friendsGeneralDnmc: string, generalHeaderDnmc: string, pagBTNDnmc: string, paginationSelectedDnmc: string, paginationDnmc: string, searchInputDnmc: string, userAvaDnmc: string,
  followBTNDnmc: string, followBTN_ERR_DNMC: string, userNameDnmc: string, mapWrapperDnmc: string, userUnitDnmc: string, userWriteModeDnmc: string, moreUserUnitsDnmc: string
}

export type FriendsActions_Type = {
  getMyFriendsListThunk: (page: number) => void
  followThunkToggler: (userId: number, isFollowed: boolean, error: string) => void
  sendMessageToUserThunk: (userId: number, body: string, actionKey: string, userName: string) => void
}

let FriendsFuncContainer = () => {

  let colorTheme = useSelector(getColorTheme)
  let palsInfo: InitialFriendsInfo_Type & FriendsThemesBGR_Type = useSelector(GetSmartFriendsReducer)

  let dispatch = useDispatch();
  let friendsACs: FriendsACs = useSelector(getFriendsACs)
  let dialogsACs: DialogActions_Type = useSelector(getDialogsACs_compUsers)


  let getMyFriendsListThunk = (page: number) => { dispatch(friendsACs.getMyFriendsListThunkAC(page)) };
  let followThunkToggler = (userId: number, isFollowed: boolean, error: string) => { dispatch(friendsACs.followThunkTogglerAC(userId, isFollowed, error)) };
  let sendMessageToUserThunk = (userId: number, body: string, actionKey: string, userName: string) => {
    dispatch(dialogsACs.sendMessageToUserThunkAC(userId, body, actionKey, userName, -1))
  }
  let componentStateCleaner = () => { dispatch(friendsACs.unMountCleaner()) }
  let palsFuncs: FriendsActions_Type = { getMyFriendsListThunk, followThunkToggler, sendMessageToUserThunk }

  useEffect(() => {
    getMyFriendsListThunk(1)
    return () => { componentStateCleaner() }
  }, []);


  let [themes, setThemes] = useState<PalsThemes_Type>({
    friendsGeneralDnmc: '', generalHeaderDnmc: '', pagBTNDnmc: '', paginationSelectedDnmc: '', paginationDnmc: '', searchInputDnmc: '', userAvaDnmc: '', followBTNDnmc: '', followBTN_ERR_DNMC: '', userNameDnmc: '', mapWrapperDnmc: '', userUnitDnmc: '', userWriteModeDnmc: '', moreUserUnitsDnmc: '',
  });

  useEffect(() => {
    switch (colorTheme) {
      case 'NIGHT':
        return setThemes({
          ...themes,
          friendsGeneralDnmc: stl.friendsGeneralN,
          generalHeaderDnmc: stl.generalHeaderN,
          pagBTNDnmc: stl.pagBTN_N,
          paginationSelectedDnmc: stl.paginationSelectedN,
          paginationDnmc: stl.paginationN,
          searchInputDnmc: stl.searchInputN,
          userAvaDnmc: stl.userAvaN,
          followBTNDnmc: stl.followBTN_N,
          followBTN_ERR_DNMC: stl.followBTN_ERR_N,
          userNameDnmc: stl.userNameN,
          mapWrapperDnmc: stl.mapWrapperN,
          userUnitDnmc: stl.userUnitN,
          userWriteModeDnmc: stl.userWriteModeN,
          moreUserUnitsDnmc: stl.moreUserUnitsN,
        });
      case 'MORNING':
        return setThemes({
          ...themes,
          friendsGeneralDnmc: stl.friendsGeneralM,
          generalHeaderDnmc: stl.generalHeaderM,
          pagBTNDnmc: stl.pagBTN_M,
          paginationSelectedDnmc: stl.paginationSelectedM,
          paginationDnmc: stl.paginationM,
          searchInputDnmc: stl.searchInputM,
          userAvaDnmc: stl.userAvaM,
          followBTNDnmc: stl.followBTN_M,
          followBTN_ERR_DNMC: stl.followBTN_ERR_M,
          userNameDnmc: stl.userNameM,
          mapWrapperDnmc: stl.mapWrapperM,
          userUnitDnmc: stl.userUnitM,
          userWriteModeDnmc: stl.userWriteModeM,
          moreUserUnitsDnmc: stl.moreUserUnitsM,
        });
      case 'DAY':
        return setThemes({
          ...themes,
          friendsGeneralDnmc: stl.friendsGeneralD,
          generalHeaderDnmc: stl.generalHeaderD,
          pagBTNDnmc: stl.pagBTN_D,
          paginationSelectedDnmc: stl.paginationSelectedD,
          paginationDnmc: stl.paginationD,
          searchInputDnmc: stl.searchInputD,
          userAvaDnmc: stl.userAvaD,
          followBTNDnmc: stl.followBTN_D,
          followBTN_ERR_DNMC: stl.followBTN_ERR_D,
          userNameDnmc: stl.userNameD,
          mapWrapperDnmc: stl.mapWrapperD,
          userUnitDnmc: stl.userUnitD,
          userWriteModeDnmc: stl.userWriteModeD,
          moreUserUnitsDnmc: stl.moreUserUnitsD
        });
      case 'EVENING':
        return setThemes({
          ...themes,
          friendsGeneralDnmc: stl.friendsGeneralE,
          generalHeaderDnmc: stl.generalHeaderE,
          pagBTNDnmc: stl.pagBTN_E,
          paginationSelectedDnmc: stl.paginationSelectedE,
          paginationDnmc: stl.paginationE,
          searchInputDnmc: stl.searchInputE,
          userAvaDnmc: stl.userAvaE,
          followBTNDnmc: stl.followBTN_E,
          followBTN_ERR_DNMC: stl.followBTN_ERR_E,
          userNameDnmc: stl.userNameE,
          mapWrapperDnmc: stl.mapWrapperE,
          userUnitDnmc: stl.userUnitE,
          userWriteModeDnmc: stl.userWriteModeE,
          moreUserUnitsDnmc: stl.moreUserUnitsE,
        });
    }
  }, [colorTheme]);

  return <Friends themes={themes} palsFuncs={palsFuncs} palsInfo={palsInfo} />
}

export default FriendsFuncContainer;


