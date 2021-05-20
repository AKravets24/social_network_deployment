import React, { useState, useEffect, useContext } from "react";
import { Users } from './users';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import stl from "./users.module.css";
import {
  getUsersACs, getColorTheme,
  getDialogsACs_compUsers,
  getSmartUsersMediaData,
  getThemesDelayFlag,
} from "../../../redux/selectors";
import * as queryString from 'querystring'

export type UsersThemes_Type = {
  userPageDnmc: string, generalHeaderDnmc: string, pagBTNDnmc: string, paginationSelectedDnmc: string, paginationDnmc: string, searchInputDnmc: string,
  userAvaDnmc: string, followBTNDnmc: string, followBTN_ERR_DNMC: string, userNameDnmc: string, mapWrapperDnmc: string, userUnitDnmc: string, userWriteModeDnmc: string,
  moreUserUnitsDnmc: string
}

export type usersActions_Type = {
  getUsersThunk: (pageSize: number, currentPage: number) => void
  setCurrentPageThunk: (pageSize: number, currentPage: number) => void
  followThunkToggler: (userId: number, isFollowed: boolean, error: string) => void
  getCertainUserThunk: (pageSize: number, userName: string, pageOfEquals: number) => void
  sendMessageToUserThunk: (userId: number, body: string, actionKey: string, userName: string) => void
  setErrorToNull: () => void
  componentStateCleaner: () => void
}

export let UsersFuncContainer = () => {


  let smartData = useSelector(getSmartUsersMediaData);
  let dialogsACs = useSelector(getDialogsACs_compUsers);
  let usersACs = useSelector(getUsersACs);
  let colorTheme = useSelector(getColorTheme);
  let themesDelayFlag = useSelector(getThemesDelayFlag);

  let dispatch = useDispatch();
  let usersActions: usersActions_Type = {
    getUsersThunk: (pageSize: number, currentPage: number) => dispatch(usersACs.getUsersThunkAC(pageSize, currentPage)),
    setCurrentPageThunk: (pageSize: number, currentPage: number) => dispatch(usersACs.setCurrentPageThunkAC(pageSize, currentPage)),
    followThunkToggler: (userId: number, isFollowed: boolean, error: string) => dispatch(usersACs.followThunkTogglerAC(userId, isFollowed, error)),
    getCertainUserThunk: (pageSize: number, userName: string, pageOfEquals: number) => { dispatch(usersACs.getCertainUserThunkAC(pageSize, userName, pageOfEquals)) },
    sendMessageToUserThunk: (userId: number, body: string, actionKey: string, userName: string) => dispatch(dialogsACs.sendMessageToUserThunkAC(userId, body, actionKey, userName, -1)),
    setErrorToNull: () => dispatch(usersACs.setErrorToNullAC()),
    componentStateCleaner: () => { dispatch(usersACs.unMountCleaner()) }
  }

  let { pageSize, currentPage } = smartData;

  let history = useHistory();
  let queryRequest = useLocation().search;


  const parsedString = queryString.parse(queryRequest);

  let [wasClicked, setWasClicked] = useState(false)

  useEffect(() => {

    if (parsedString['?page'] && Number.isInteger(+parsedString['?page']) && !wasClicked && !parsedString['term']) { // выполняет ветку один раз - инфа  берется из линка
      let pageFromLink = Math.trunc(+parsedString['?page'])
      if (pageFromLink <= 0) pageFromLink = 1;
      usersActions.getUsersThunk(pageSize, pageFromLink)
      history.push({ pathname: 'users', search: `?page=${pageFromLink}` })
      setWasClicked(true)
    } else if (!parsedString['?page'] || !Number.isInteger(+parsedString['?page']) && !wasClicked) {
      history.push({ pathname: 'users', search: `?page=${currentPage}` })
      usersActions.getUsersThunk(pageSize, currentPage)
      setWasClicked(true)
    } else if (parsedString['term'] && parsedString['term'] !== '' && !wasClicked) { // проверка второго необязательного параметра
      history.push({ pathname: 'users', search: `?page=${currentPage}&term=${parsedString['term']}` })
      let termValue = parsedString.term as string
      usersActions.getCertainUserThunk(pageSize, termValue, currentPage)
      setWasClicked(true)
    } else if (parsedString['term'] && parsedString['term'] !== '' && wasClicked) {
      history.push({ pathname: 'users', search: `?page=${currentPage}&term=${parsedString['term']}` })
    } else {
      history.push({ pathname: 'users', search: `?page=${currentPage}` })
    }

    return () => { usersActions.componentStateCleaner() }

  }, [currentPage])


  let [themes, setThemes] = useState<UsersThemes_Type>({
    userPageDnmc: '', generalHeaderDnmc: '', pagBTNDnmc: '', paginationSelectedDnmc: '', paginationDnmc: '', searchInputDnmc: '', userAvaDnmc: '',
    followBTNDnmc: '', followBTN_ERR_DNMC: '', userNameDnmc: '', mapWrapperDnmc: '', userUnitDnmc: '', userWriteModeDnmc: '', moreUserUnitsDnmc: '',
  });
  useEffect(() => {
    switch (colorTheme) {
      case 'NIGHT':
        return setThemes({
          ...themes,
          userPageDnmc: stl.usersPageN,
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
          userPageDnmc: stl.usersPageM,
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
          userPageDnmc: stl.usersPageD,
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
          userPageDnmc: stl.usersPageE,
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

  return themes.userPageDnmc ?
    <Users
      usersInfo={smartData}
      themes={themes}
      usersFuncs={usersActions}
      delayFlag={themesDelayFlag}
    /> : null
}

export default UsersFuncContainer;
