import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Route, Redirect, withRouter, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import stl from './content.module.css';
import { getDialogsACs_compUsers, getFeedbackArr, getSmartIdAndIsAuth } from "../../redux/selectors";
import { withSuspense } from './HOC/withSuspense';
import { FeedBackArr_Type } from "../../redux/dialogsReducer";

// const ProfileComposer = lazy(()=> import("./profile/profileCompWithContainer").then((m:any) => ({default: m.ProfileComposer}))) // as React.ComponentType
// const ContentComposer = compose<React.ComponentType>(connect(mapStateToProps), withRouter,)(ContentCompContainer); // для примера на память оставлю

let ProfileFuncContainer = lazy(() => import("./profile/profileCompWithContainer")) as React.LazyExoticComponent<React.ComponentType<any>>;
let FriendsComposer = lazy(() => import("./friends/friendsContainer"));
let DialogsComposer = lazy(() => import("./dialogs/dialogs"));
let ChatContainer = lazy(() => import("./chat/chat"))
let UsersComposer = lazy(() => import("./users/usersContainer"));
let UnAuthorised = lazy(() => import("./unAuthorised/unAuthorised"));
let NotFound = lazy(() => import("./404/404"));


let ProfileComp = withSuspense(ProfileFuncContainer)
let FriendsComp = withSuspense(FriendsComposer)
let DialogsComp = withSuspense(DialogsComposer)
let ChatComp = withSuspense(ChatContainer)
let UsersComp = withSuspense(UsersComposer)
let NotFoundComp = withSuspense(NotFound)

export function ContentCompContainer() {
  let smartData = useSelector(getSmartIdAndIsAuth);
  let feedBackArr = useSelector(getFeedbackArr)
  let feedBackPopUpCloser = useSelector(getDialogsACs_compUsers).feedBackPopUpCloser;
  let pathname = useLocation().pathname;



  return <Content authData={smartData} pathname={pathname} feedBackArr={feedBackArr} feedBackPopUpCloser={feedBackPopUpCloser} />
};

type PropsType = { authData: { isAuth: boolean, id: null | number }, pathname: string, feedBackArr: FeedBackArr_Type[], feedBackPopUpCloser: (actionKey: string) => void }

let Content: React.FC<PropsType> = ({ authData: { isAuth, id: myId }, pathname, feedBackArr, feedBackPopUpCloser }) => {

  let [link, setLink] = useState(pathname)
  let prevLinkRef = useRef<string | undefined>();
  let prevLink = prevLinkRef.current;
  useEffect(() => { prevLinkRef.current = link; setLink(pathname) }, [pathname]);

  let loginChecker = () => {
    if (isAuth) {         // ЗАЛОГИНЕН

      if (pathname.match(/^\/profile\b$|^\/login$|^\/$/)) return <Redirect to={`profile/${myId}`} />
      if (!pathname.match(/^\/profile\/\d{1,5}\b$|^\/dialogs\/\d{1,5}\b$|^\/dialogs$|^\/chat$|^\/friends$|^\/users$|^\/$|^\/404$/)) return <Redirect to='/404' />
      return <>
        <Route onLoad={true} exact path='/profile/:userId?' render={() => <ProfileComp />} />
        <Route onLoad={true} exact path='/friends' render={() => <FriendsComp />} />
        <Route onLoad={true} exact path={`/dialogs/:userId?`} render={() => <DialogsComp />} />
        <Route onLoad={true} exact path={'/chat'} render={() => <ChatComp />} />
        <Route onLoad={true} exact path={`/users`} render={() => <UsersComp />} />
        <Route onLoad={true} exact path='/404' render={() => <NotFoundComp />} />

      </>
    }
    else {                      // НЕ ЗАЛОГИНЕН
      if (pathname.match(/^\/profile\/\d{1,5}\b$|^\/dialogs$|^\/dialogs\/\d{1,5}\b$|^\/friends$|^\/users$|^\/$/)) return <Redirect to='/login' />
      if (!pathname.match(/^\/news$|^\/music$|^\/settings$|^\/$|^\/login$|^\/404$/)) return <Redirect to='/404' />
      return <>
        <Route onLoad={true} exact path='/login' render={withSuspense(UnAuthorised)} />
        <Route onLoad={true} exact path='/404' render={withSuspense(NotFound)} />
      </>
    }
  };

  let [wasMaped, setWasMaped] = useState<boolean>(false)

  useEffect(() => {
    if (pathname.includes('/dialogs') && !prevLink?.includes('/dialogs')) { setWasMaped(false) } // если в Диалог пришли из др к-ты
    else if (pathname.includes('/dialogs') && prevLink?.includes('/dialogs')) {
      feedBackArr.length ? setTimeout(() => { setWasMaped(false) }, 3000) : setWasMaped(false)
    }                                                                                            //  если Диалог был со старта, то массив не мапим
    else if (!pathname.includes('/dialogs')) { setWasMaped(true) }                               // если установлена др к-та
  }, [pathname])


  return <div className={stl.content2}> {loginChecker()}

    {wasMaped && feedBackArr.map((el, i, arr) => {
      return <FeedBacker key={el.actionKey}
        feedBackWindowCloser={feedBackPopUpCloser}
        statInfo={arr[i]}
        index={i}
      />
    })}
  </div>
}



interface FBProps_Type {
  feedBackWindowCloser: (actionKey: string) => void
  statInfo: any
  index: number
}

const FeedBacker = React.memo(({ feedBackWindowCloser, statInfo, index }: FBProps_Type) => {
  let dispatch = useDispatch()

  let feedBackNamer = (i: number) => {
    if (i === 0) return `${stl.feedbackWindow0}`
    else if (i === 1) return `${stl.feedbackWindow1}`
    else if (i >= 2) return `${stl.feedbackWindow2}`
  }

  useEffect(() => {
    statInfo.statNum !== 0 && setTimeout(() => {
      dispatch(feedBackWindowCloser(statInfo.actionKey))
    }, 3000)
  }, [statInfo.statNum])

  let feedBackCloser = (actionKey: string) => { feedBackWindowCloser(actionKey) }


  return <div className={feedBackNamer(index)}>
    <button onClick={() => feedBackCloser(statInfo.actionKey)}> X</button>
    <p>{statInfo.statNum === 0 && 'Sending message...' ||
      statInfo.statNum === 1 && `Message delivered to ${statInfo.userName}` ||
      statInfo.statNum === 2 && `Failed to deliver message to ${statInfo.userName} `}
    </p>
  </div>
},
  function areEqual(prevProps, nextProps) {
    return false
  })