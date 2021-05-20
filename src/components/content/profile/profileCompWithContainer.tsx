import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory, useRouteMatch } from 'react-router-dom';
import { getMyId, getProfileACs, getProfilePics, getSmartProfileMediaData, getSmartPicsNLoaders, getColorTheme, getThemesDelayFlag } from "../../../redux/selectors";
import { Formik, Field } from 'formik';
import stl from './profile.module.css';
import Post from './post/post';
import { StatusCompFunc } from "./statusBlock";
import { v4 as uuidv4 } from 'uuid';
import { InitialProfileState_Type, profileACs_Type, ProfilePicturesTypes } from "../../../redux/profileReducer";
import { ProfileThemes_Type } from '../../../redux/backGroundSetter'
import { HistoryHook_Type, MatchHook_Type } from '../../RouterHooksTypes'
import cn from 'classnames/bind';


type Themes_Type = {
  profileDnmc: string,
  panoramaSRC: string
  profileInfoDnmc: string,
  BTNs: string,
  BTN_ERR_DNMC: string,
  writePostDnmc: string,
  textInput: string,
  fontClrsDnmc: string;
}
type ProfileState_Type = {
  profileMedia: InitialProfileState_Type
  picsNLoaders: ProfileThemes_Type
  myId: number | null
  profilePics: ProfilePicturesTypes
  profileACs: profileACs_Type
  colorTheme: string
}
type ProfileActions_Type = {
  addPost: (finalPost: string) => void
  getProfileThunk: (userId: null | number, isMe: boolean) => void
  updateStatusThunk: (text: string) => void
  updateMyAvatarThunk: (image: string) => void
  followThunkToggler: (userId: null | number, isFollowed: null | boolean) => void
  sendMsgToTalkerThunk: (userId: null | number, message: string) => void
  sendingStatCleaner: () => void
  profileGetter: () => void
}

let ProfileFuncContainer = () => {

  let history: HistoryHook_Type = useHistory();
  let match: MatchHook_Type | any = useRouteMatch(); //потому что ТС, постоянно пишет object possibly undefined


  let profileMedia = useSelector(getSmartProfileMediaData);
  let picsNLoaders = useSelector(getSmartPicsNLoaders);
  let myId = useSelector(getMyId);
  let profilePics = useSelector(getProfilePics);
  let profileACs = useSelector(getProfileACs);
  let colorTheme = useSelector(getColorTheme);
  let themesDelayFlag = useSelector(getThemesDelayFlag)

  let comparativeId = +match?.params?.userId;

  let profileState = { profileMedia, picsNLoaders, myId, profilePics, profileACs, colorTheme }

  let dispatch = useDispatch();
  let profileActions: ProfileActions_Type = {
    addPost: (finalPost: string) => {
      let date = new Date();
      let data = `${("0" + date.getDate()).slice(-2)}.${("0" + (date.getMonth() + 1)).slice(-2)}.${(date.getFullYear() - 2000)}`;
      let time = `${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}`;
      dispatch(profileACs.addPostAC(finalPost, data, time));
    },
    getProfileThunk: (userId: null | number, isMe: boolean) => dispatch(profileACs.getProfileThUnkAC(userId, isMe)),
    updateStatusThunk: (text: string) => dispatch(profileACs.updateStatusThunkAC(text)),
    updateMyAvatarThunk: (image: string) => dispatch(profileACs.updateMyAvatarThunkAC(image)),
    followThunkToggler: (userId: null | number, isFollowed: null | boolean) => dispatch(profileACs.followThunkTogglerAC(userId, isFollowed)),
    sendMsgToTalkerThunk: (userId: null | number, message: string) => dispatch(profileACs.sendMsgToTalkerThunkAC(userId, message)),
    sendingStatCleaner: () => dispatch(profileACs.afterSendMSGStatCleaner()),
    profileGetter: () => {
      if (myId === comparativeId || !comparativeId) {
        profileActions.getProfileThunk(myId, true); history.push(`/profile/${myId}`);
      } else if (+comparativeId && +comparativeId !== myId) { profileActions.getProfileThunk(comparativeId, false); }
    }

  }
  let panoramaPicSrc = picsNLoaders.panoramaPic;

  useEffect(() => { profileActions.profileGetter(); }, [myId, comparativeId]);

  let [themes, setThemes] = useState<Themes_Type>({ profileDnmc: '', panoramaSRC: '', profileInfoDnmc: '', BTNs: '', BTN_ERR_DNMC: '', writePostDnmc: '', textInput: '', fontClrsDnmc: '' })
  useEffect(() => {
    switch (colorTheme) {
      case 'NIGHT': return setThemes({ ...themes, profileDnmc: stl.profileN, panoramaSRC: panoramaPicSrc, profileInfoDnmc: stl.profileInfoN, BTNs: stl.BTNsN, BTN_ERR_DNMC: stl.BTN_ERR_N, writePostDnmc: stl.writePostN, textInput: stl.inputN, fontClrsDnmc: stl.fontsClr_N })
      case 'MORNING': return setThemes({ ...themes, profileDnmc: stl.profileM, panoramaSRC: panoramaPicSrc, profileInfoDnmc: stl.profileInfoM, BTNs: stl.BTNsM, BTN_ERR_DNMC: stl.BTN_ERR_M, writePostDnmc: stl.writePostM, textInput: stl.inputM, fontClrsDnmc: stl.fontsClr_M })
      case 'DAY': return setThemes({ ...themes, profileDnmc: stl.profileD, panoramaSRC: panoramaPicSrc, profileInfoDnmc: stl.profileInfoD, BTNs: stl.BTNsD, BTN_ERR_DNMC: stl.BTN_ERR_D, writePostDnmc: stl.writePostD, textInput: stl.inputD, fontClrsDnmc: stl.fontsClr_D })
      case 'EVENING': return setThemes({ ...themes, profileDnmc: stl.profileE, panoramaSRC: panoramaPicSrc, profileInfoDnmc: stl.profileInfoE, BTNs: stl.BTNsE, BTN_ERR_DNMC: stl.BTN_ERR_E, writePostDnmc: stl.writePostE, textInput: stl.inputE, fontClrsDnmc: stl.fontsClr_E })
    }
  }, [colorTheme]);


  return themes.profileDnmc ? <Profile
    state={profileState}
    colorTheme={colorTheme}
    themes={themes}
    actions={profileActions}
    delayFlag={themesDelayFlag}
  /> : null;
};


type Profile_Types = {
  actions: ProfileActions_Type
  state: ProfileState_Type
  themes: Themes_Type
  colorTheme: string
  delayFlag: boolean
}

const Profile: React.FC<Profile_Types> = ({ state, actions, themes, colorTheme, delayFlag }) => {
  type Error_Type = { text?: string };

  let { errOnProfileLoading: errOnGettingProfile, errOnStatusLoading, isFollowed, onFollowingErr, isLoading } = state.profileMedia;
  let { userId } = state.profileMedia.profileData


  let [writeMode, setWriteMode] = useState(false)
  let [feedBacker, setFeedBacker] = useState(false)

  useEffect(() => {
    setTimeout(() => { setFeedBacker(false); actions.sendingStatCleaner() }, 2000)
  }, [state.profileMedia.MSGToUserSended || state.profileMedia.errAtMSGSending])



  const getContacts = (obj: any, logos: any) => {
    const result = [];
    let { faceBookLogo, gitHubLogo, instagramLogo, mainLinkLogo, twitterLogo, vkLogo, websiteLogo, youTubeLogo } = logos;
    let { facebook, github, instagram, mainLink, twitter, vk, website, youtube } = obj;
    result.push({ title: faceBookLogo, value: facebook }, { title: gitHubLogo, value: github }, { title: instagramLogo, value: instagram },
      { title: mainLinkLogo, value: mainLink }, { title: twitterLogo, value: twitter }, { title: vkLogo, value: vk },
      { title: websiteLogo, value: website }, { title: youTubeLogo, value: youtube })

    for (let key in obj) { if (!obj[key]) { obj[key] = 'nope' } }
    return (result.map((el) => <li key={uuidv4()}> <img src={el.title} alt="err" />  {el.value === 'nope' ? <p>{el.value}</p> :
      <a href={el.value}>{el.value}</a>}</li>))
  };
  state.profileMedia.profileData.contacts && getContacts(state.profileMedia.profileData.contacts, state.profilePics)

  let photoSaver = (e: any) => { actions.updateMyAvatarThunk(e.target.files[0]) };

  let modalCloser = (e: any) => { e.target.attributes['data-name'] && e.target.attributes['data-name'].value === 'modalBackground' && setWriteMode(false) }

  let feedBackCloser = () => { setFeedBacker(false) }

  type Value_Type = { text: string }
  let validator = (values: Value_Type) => { let errors: Error_Type = {}; if (!values.text) { errors.text = 'Write something..' } return errors }

  let submitterForMSGS = (values: Value_Type, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    actions.sendMsgToTalkerThunk(userId, values.text); setFeedBacker(true); setWriteMode(false); setSubmitting(false);
  }
  let submitterForWall = (values: Value_Type, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    actions.addPost(values.text); values.text = ''; setSubmitting(false);
  }


  let forbiddenIdArr = [1, 17, 21, 23, 31, 1031];
  let [userIdlacking, setUserIdlacking] = useState<boolean>(false)
  let match: MatchHook_Type | any = useRouteMatch();
  useEffect(() => {
    if (forbiddenIdArr.some(el => el === +match.params.userId) || match.params.userId >= 31 && match.params.userId <= 1031) {
      setUserIdlacking(true)
    } else setUserIdlacking(false)
  }, [match.params.userId])

  return <>
    {writeMode &&
      <div data-name='modalBackground' className={stl.modalBackground} onClick={e => { modalCloser(e) }}>
        <div className={`${stl.writeWindow} ${themes.profileDnmc}`}>
          <div className={stl.miniHeadWrapper}>
            {/* <h2 className={`${stl.userName} ${props.themes.userNameDnmc}`}>{props.state.profileMedia.profileData.fullName}</h2> */}
            <NavLink className={`${stl.followBTN} ${themes.BTNs}`} to={`/dialogs/${userId}`}
            > Go to chat </NavLink>
            <button className={`${stl.closeBTN} ${stl.followBTN} ${themes.BTNs}`}
              onClick={() => { setWriteMode(false) }}
            >X</button>
          </div>
          <div className={stl.textAreaWrapper}>

            <Formik initialValues={{ text: '' }} validate={validator} onSubmit={submitterForMSGS}>
              {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                  <Field name="text" className={stl.talkTextarea} as='textarea'
                    onChange={handleChange} value={values.text} placeholder={errors.text} />
                  <button type="submit" disabled={isSubmitting} className={`${stl.followBTN} ${themes.BTNs}`}
                  > Send Msg </button>
                </form>
              )}
            </Formik>

          </div>
        </div>
      </div>
    }

    {feedBacker &&
      <div className={stl.feedBacker}>
        <button onClick={feedBackCloser}> X</button>
        <p>{!state.profileMedia.MSGToUserSended && !state.profileMedia.errAtMSGSending && 'Sending message...' ||
          state.profileMedia.MSGToUserSended && `${state.profileMedia.MSGToUserSended}` ||
          state.profileMedia.errAtMSGSending && `${state.profileMedia.errAtMSGSending} Error! Failed to deliver!`}
        </p>
      </div>
    }

    {!userIdlacking && isLoading && <div className={cn(stl.loaderDiv, themes.profileDnmc, delayFlag && stl.delay)}>
      <img className={stl.loader} src={state.picsNLoaders.auth_LDR_GIF} alt="Err" />
      <p className={themes.fontClrsDnmc}>Loading profile...</p>
    </div>}
    {userIdlacking && <div className={`${stl.Houston} ${themes.profileDnmc}`}>
      <h2>Houston, we've got a problem...</h2>
      <h2>We have no user with such Id</h2>
    </div>}
    {!userIdlacking && errOnGettingProfile && !isLoading &&
      <div className={`${stl.Houston} ${themes.profileDnmc}`}>
        <h2>Houston, we've got a problem...</h2>
        <h2>{errOnGettingProfile} error!</h2>
        <button
          className={`${stl.followBTN} ${themes.BTNs}`}
          onClick={() => { actions.profileGetter() }}
        >Try again</button>
      </div>
    }
    {!userIdlacking && userId && !errOnGettingProfile && !isLoading &&
      <div className={`${stl.profile} ${themes.profileDnmc}`}>
        <div className={stl.panorama}>
          <img
            className={stl.panoramaPic}
            src={themes.panoramaSRC} alt="Err"
          />
        </div>
        <div className={stl.profileWrapper}>
          <div className={stl.profileDetails}>
            <div className={stl.profilePicNBTN}>
              <div>
                <img src={!userId ? state.picsNLoaders.ava_LDR_GIF : state.profileMedia.profileData.photos.large ||
                  state.profileMedia.myAvatarLarge} alt="Err" />
              </div>
              <input disabled={!userId} type="file" name="image" id='file' onChange={photoSaver} className={stl.fileInput} />
              {!userId ?
                <label htmlFor="file" className={`${stl.fileChooser} ${themes.BTNs}`}
                ><img src={state.picsNLoaders.BTN_LDR_GIF} alt="err" /></label> :
                state.myId === userId ?
                  <label htmlFor="file" className={`${stl.fileChooser} ${themes.BTNs}`}
                  >
                    <>
                      {state.profileMedia.errOnAvatarUpdate ?
                        <div className={themes.BTN_ERR_DNMC}> {state.profileMedia.errOnAvatarUpdate} </div> :
                        <div className={stl.noAvaError}>
                          <div> Choose your new picture</div>
                          <div> Choose your <s>destiny!</s></div></div>
                      }
                    </>
                  </label> :
                  <button className={`${stl.writeMessage} ${themes.BTNs}`}
                    disabled={writeMode} onClick={() => setWriteMode(true)}
                  >Write Message</button>
              }
            </div>
            <div className={stl.profileInfo}>
              <div className={cn(stl.nameWrapper, themes.profileInfoDnmc, delayFlag && stl.delay)}>
                <h2> {state.profileMedia.profileData.fullName} {state.myId === userId && '(it\'s you)'}</h2>
                {state.myId !== userId &&
                  <button
                    className={cn(stl.followBTN, onFollowingErr ? themes.BTN_ERR_DNMC : themes.BTNs)}
                    disabled={state.profileMedia.isFollowing}
                    onClick={() => actions.followThunkToggler(userId, isFollowed)}
                  >
                    <div className={stl.followBTNContainer}>
                      <div className={stl.followBTNText}>
                        {onFollowingErr ?                   // есть ошибка при выполнении (un)Follow?
                          <>
                            <p className={stl.onFollowingErrBTN}>{onFollowingErr}</p>
                            <p className={stl.tryAgainBTN}>Try again!</p>
                          </> :                  // если нет ошибки, то : 
                          state.profileMedia.isFollowed ? 'Unfollow' : 'Follow'} </div>
                      <div className={stl.followBTNLoader}> {state.profileMedia.isFollowing && <img src={state.picsNLoaders.BTN_LDR_GIF} alt="Err" />} </div>
                    </div>
                  </button>
                }
              </div>
              <div className={stl.statusBlock}>
                <StatusCompFunc
                  isMe={state.myId === userId}
                  isLoading={!userId}
                  loader={state.picsNLoaders.status_LDR_GIF}
                  colorTheme={colorTheme}
                  statusField={state.profileMedia.statusField}
                  errOnStatusLoading={errOnStatusLoading}
                  updateStatusThunk={actions.updateStatusThunk}
                  errOnStatusUpdate={state.profileMedia.errOnStatusUpdate}
                />
              </div>
              <p className={stl.contactsH2}>Contacts:</p>
              <ul>
                {state.profileMedia.profileData.contacts &&
                  getContacts(state.profileMedia.profileData.contacts, state.profilePics)
                }
              </ul>
              {state.profileMedia.profileData.lookingForAJobDescription &&
                <div className={stl.jobSeeker}>
                  <p>Professional skills:</p>
                  <p>Skill stack: {state.profileMedia.profileData.lookingForAJobDescription}</p>
                  <p>Applicant: {state.profileMedia.profileData.lookingForAJob ? 'yup' : 'nope'}</p>
                  <p>About me: {state.profileMedia.profileData.aboutMe ? state.profileMedia.profileData.aboutMe : 'nope'}</p>
                </div>}
            </div>
          </div>

          {state.myId === userId && <div>
            <div className={cn(stl.writePost, themes.writePostDnmc, delayFlag && stl.delay)}>
              <h2>My posts</h2>
              <div className={stl.inputBox}>
                <Formik initialValues={{ text: '' }} validate={validator} onSubmit={submitterForWall}>
                  {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
                    <form onSubmit={handleSubmit}>
                      <textarea name="text" className={stl.talkTextarea}
                        onChange={handleChange} value={values.text} placeholder={errors.text} />
                      <button type="submit" disabled={isSubmitting} className={`${themes.BTNs}`}> Send Msg </button>
                    </form>
                  )}
                </Formik>

              </div>
            </div>
            <Post wallPosts={state.profileMedia.wallPosts} />
          </div>
          }
        </div>
      </div>
    }


  </>
};

export default ProfileFuncContainer;


