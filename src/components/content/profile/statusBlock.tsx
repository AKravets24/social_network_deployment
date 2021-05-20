import React, { useEffect, useState } from "react";
import stl from "./statusBlock.module.css";


type StatusProps = {
  colorTheme: string, errOnStatusLoading: string, errOnStatusUpdate: string, isLoading: boolean, isMe: boolean, loader: string, statusField: string, updateStatusThunk: (text: string) => void,
}

export let StatusCompFunc: React.FC<StatusProps> = ({ colorTheme, errOnStatusLoading, errOnStatusUpdate, isLoading, isMe, loader, statusField, ...props }) => {

  const [statusEdit, setStatusEdit] = useState(false);
  const fieldMaxLength = 300;
  const [fieldBalanceLength, setFieldBalanceLength] = useState(0);
  const [statusFieldValue, setStatusFieldValue] = useState('')
  const [previousStatus, setPreviousStatus] = useState('')

  useEffect(() => {
    setStatusFieldValue(statusField)
    setPreviousStatus(statusField)
    statusField !== null && setFieldBalanceLength(fieldMaxLength - statusField.length)
  }, [statusField])

  let [themes, setThemes] = useState({ windowDNMC: '', textInput: '' })

  useEffect(() => {
    if (colorTheme === 'NIGHT') setThemes({ ...themes, windowDNMC: stl.mWindow_N, textInput: stl.inputN })
    else if (colorTheme === 'MORNING') setThemes({ ...themes, windowDNMC: stl.mWindow_M, textInput: stl.inputM })
    else if (colorTheme === 'DAY') setThemes({ ...themes, windowDNMC: stl.mWindow_D, textInput: stl.inputD })
    else if (colorTheme === 'EVENING') setThemes({ ...themes, windowDNMC: stl.mWindow_E, textInput: stl.inputE })
  }, [colorTheme])

  let statusChangeListener = ({ target }: any) => { let { value } = target; setFieldBalanceLength(fieldMaxLength - value.length); setStatusFieldValue(value); };
  let confirmStatus = () => { props.updateStatusThunk(statusFieldValue); setStatusFieldValue(statusField); setStatusEdit(false); };
  let rejectStatus = () => { setStatusFieldValue(previousStatus); setFieldBalanceLength(fieldMaxLength - previousStatus.length); setStatusEdit(false); };

  window.onkeyup = ({ key }: any) => { statusEdit && key === "Escape" && rejectStatus() };

  let modalCloser = ({ target }: React.MouseEvent<HTMLDivElement>) => {
    let el = target as HTMLInputElement; el.getAttribute('data-name') === 'modalBackground' && setStatusEdit(false)
  }


  return <>
    <div className={isMe ? stl.myStatusWrapper : stl.statusWrapper} onClick={isMe ? (e: React.MouseEvent) => { setStatusEdit(true) } : undefined}>
      <p className={`${stl.statusField} ${errOnStatusUpdate || errOnStatusLoading && stl.statusError}`}>
        {errOnStatusLoading ?
          `${errOnStatusLoading}  error!` : errOnStatusUpdate ?
            errOnStatusUpdate : statusField ?
              statusField : isMe ?
                'Set your status here' : null
        }
      </p>
    </div>
    { statusEdit && <div className={`${stl.modalBackground}`} data-name='modalBackground'
      onMouseDown={modalCloser}>
      <div className={`${stl.modalWindow}  ${themes.windowDNMC}`}>
        <textarea autoFocus={true}
          maxLength={fieldMaxLength}
          className={`${stl.statusTextArea} ${themes.textInput}`}
          value={statusFieldValue}
          onChange={statusChangeListener}
          placeholder={'write your mind here'}
        />
        <div> {fieldBalanceLength} symbols left</div>
        <div className={stl.twoBTNs} >
          <button className={stl.BTNChangeSaver} onClick={() => { confirmStatus() }}> Apply changes</button>
          <button className={stl.BTNChangeReject} onClick={rejectStatus}> Reject changes </button>
        </div>
      </div>
    </div>
    }
  </>
};

