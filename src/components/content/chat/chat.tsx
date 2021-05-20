import React, { useState, useEffect } from 'react'
import stl from './chat.module.css'
import { Field, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { getChatACs, getColorTheme, getSmartChatReducer, getSmartPicsNLoaders } from '../../../redux/selectors';
import { ReadyStatus_Type } from '../../../redux/chatReducer'
import { NavLink } from 'react-router-dom';
import cn from 'classnames/bind';

type ChatArr_Type = { message: string, photo: string, userId: number, userName: string }
type Themes_Type = { chatGeneralDnmc: string, headerDnmc: string, avaDnmc: string, userNameDnmc: string, formSenderDnmc: string, inputerDnmc: string, followBTNDnmc: string }
export default function ChatContainer() {

  let smartData = useSelector(getSmartChatReducer)
  let chatACs = useSelector(getChatACs);
  let colorTheme = useSelector(getColorTheme);
  let dispatch = useDispatch()
  let loaderGIF = useSelector(getSmartPicsNLoaders).auth_LDR_GIF;

  useEffect(() => { dispatch(chatACs.setSocketChannelThunkAC()); return () => { dispatch(chatACs.setChatArrEmpty()) } }, [])

  let chatMSGSender = (msg: string) => { try { smartData.webSocket?.send(msg) } catch (err) { console.log(err) } }

  let [themes, setThemes] = useState<Themes_Type>({ chatGeneralDnmc: '', headerDnmc: '', avaDnmc: '', userNameDnmc: '', formSenderDnmc: '', inputerDnmc: '', followBTNDnmc: '', })
  useEffect(() => {
    switch (colorTheme) {
      case 'NIGHT': return setThemes({
        ...themes, chatGeneralDnmc: stl.chatGeneralN, headerDnmc: stl.headerN, avaDnmc: stl.avaN, userNameDnmc: stl.userNameN, formSenderDnmc: stl.formSenderN, inputerDnmc: stl.inputerN, followBTNDnmc: stl.followBTN_N,
      });
      case 'MORNING': return setThemes({
        ...themes, chatGeneralDnmc: stl.chatGeneralM, headerDnmc: stl.headerM, avaDnmc: stl.avaM, userNameDnmc: stl.userNameM, formSenderDnmc: stl.formSenderM, inputerDnmc: stl.inputerM, followBTNDnmc: stl.followBTN_M,
      });
      case 'DAY': return setThemes({
        ...themes, chatGeneralDnmc: stl.chatGeneralD, headerDnmc: stl.headerD, avaDnmc: stl.avaD, userNameDnmc: stl.userNameD, formSenderDnmc: stl.formSenderD, inputerDnmc: stl.inputerD, followBTNDnmc: stl.followBTN_D,
      });
      case 'EVENING': return setThemes({
        ...themes, chatGeneralDnmc: stl.chatGeneralE, headerDnmc: stl.headerE, avaDnmc: stl.avaE, userNameDnmc: stl.userNameE, formSenderDnmc: stl.formSenderE, inputerDnmc: stl.inputerE, followBTNDnmc: stl.followBTN_E,
      });
    }
  }, [colorTheme])


  return <> { smartData.webSocket === null ? null : <Chat chatData={smartData.chatArr} msgSender={chatMSGSender} readyStatus={smartData.readyStatus} defaultAva={smartData.defaultAvatar} themes={themes} ldrGIF={loaderGIF} />} </>

}

type ChatProps_Type = { chatData: ChatArr_Type[], msgSender: (arg: string) => void, readyStatus: ReadyStatus_Type, defaultAva: string, themes: Themes_Type, ldrGIF: string }
let Chat: React.FC<ChatProps_Type> = ({ chatData, msgSender, readyStatus, defaultAva, ldrGIF, themes }) => {

  type Value_Type = { text: string }
  type Error_Type = { text?: string }

  let validator = (values: Value_Type) => { let errors: Error_Type = {}; if (!values.text) { errors.text = 'Required' } return errors }

  let submitter = (values: Value_Type, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    msgSender(values.text); values.text = ''; setSubmitting(false);
  }


  return <div className={cn(stl.chatGeneral, themes.chatGeneralDnmc)} >
    <div className={cn(stl.header, themes.headerDnmc)}>
      <p>Chat</p>
      <p>There are more than 15 thousand of us!</p>
    </div>
    <div className={cn(stl.chatWrapper, themes.chatGeneralDnmc)}>
      {readyStatus === 'pending' &&
        <div className={stl.loaderDiv_Users}>
          <img className={stl.loader} src={ldrGIF} alt="Err" />
        </div>
      }
      {chatData.map((el, i) =>
        <div key={i} className={cn(stl.msgBlock, themes.headerDnmc)}>
          <div className={cn(stl.avaAndLink, themes.avaDnmc)}>
            <NavLink to={`/profile/${el.userId}`}>
              <img src={el.photo ? el.photo : defaultAva} alt="Err" />
            </NavLink>
            <NavLink to={`/dialogs/${el.userId}`}
            > <p className={themes.userNameDnmc}>{el.userName}</p> </NavLink>
          </div>

          <div className={stl.msgBody}> {el.message} </div>
        </div>
      )}
    </div>
    <div className={cn(stl.formSender, themes.formSenderDnmc)}>
      <Formik initialValues={{ text: '' }} validate={validator} onSubmit={submitter}>
        {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit} className={stl.formik} >
            <Field name="text" onChange={handleChange} value={values.text} placeholder={errors.text} as='textarea'
              className={cn(stl.inputer, themes.inputerDnmc)}
            />
            <button
              type="submit" disabled={isSubmitting && readyStatus === 'opened'}
              className={`${stl.sendBTN} ${themes.followBTNDnmc}`}
            >
              <span className={stl.respect}>{'Good luck. And remember - respect is everything =))'}</span>
              Send
            </button>
          </form>
        )}
      </Formik>
    </div>
  </div>
}
