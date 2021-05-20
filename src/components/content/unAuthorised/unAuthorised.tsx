import React, { useState } from 'react';
import stl from './unAuthorised.module.css';
import { Formik, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux'
import { getAppACs, getSmartAppAuthReducer } from "../../../redux/selectors";

type UnAuthorisedActions_Type = {
  setMeLoginThunk: (email: string, password: string, rememberMe: boolean, captchaCode: string) => void
  getCaptchaThunk: () => void
}

type UnAuthorisedState_Type = { authErr: string, captchaPic: string, errCaptchaGet: string }

let LoginContainer = () => {

  let appAC = useSelector(getAppACs);
  let appAuthReducer = useSelector(getSmartAppAuthReducer);

  let { authErr, captchaPic, errCaptchaGet } = appAuthReducer
  let unAuthorisedState = { authErr, captchaPic, errCaptchaGet }

  let dispatch = useDispatch();
  let unAuthorisedActions: UnAuthorisedActions_Type = {
    setMeLoginThunk: (email: string, password: string, rememberMe: boolean, captchaCode: string) => dispatch(appAC.setMeLoginThunkAC(email, password, rememberMe, captchaCode)),
    getCaptchaThunk: () => dispatch(appAC.getCaptchaThunkAC())
  }

  return <Login actions={unAuthorisedActions} unAuthInfo={unAuthorisedState} />
}

type LoginProps_Type = { actions: UnAuthorisedActions_Type, unAuthInfo: UnAuthorisedState_Type }
const Login: React.FC<LoginProps_Type> = ({ unAuthInfo: { authErr, captchaPic, errCaptchaGet }, actions }) => {

  const loginListener = (email: string, password: string, rememberMe: boolean, captchaCode: string) => { actions.setMeLoginThunk(email, password, rememberMe, captchaCode) };

  let [crownExtraClass, setCrownExtraClass] = useState(stl.redCrown)

  type FormikErrors_Type = { email?: string, password?: string, captchaCode?: string }
  type Value_Type = { text: string, email: string, password: string, captchaCode: string, rememberMe: boolean }

  let validator = (values: Value_Type) => {
    const errors: FormikErrors_Type = {};
    if (!values.email) { errors.email = 'Required Field'; }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) { errors.email = 'Invalid email address'; }
    if (!values.password) { errors.password = 'Required Field'; }
    else if (values.password.length < 3) { errors.password = 'Set longer pass'; }

    if (captchaPic) if (!values.captchaCode) { errors.captchaCode = errCaptchaGet }

    Object.keys(errors).length === 0 ? setCrownExtraClass(stl.blueCrown) : setCrownExtraClass(stl.redCrown)
    return errors;
  }

  let submitter = (values: Value_Type, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    let { email, password, rememberMe, captchaCode } = values;
    loginListener(email, password, rememberMe, captchaCode)
    captchaCode = '';
    setSubmitting(false)
  }

  return <div className={stl.loginBackground}>
    <div className={`${stl.reactCrown} ${crownExtraClass}`} />

    <h1>Sign in, samurai!</h1>
    <Formik initialValues={{ text: '', email: '', password: '', rememberMe: true, captchaCode: '' }} validate={validator} onSubmit={submitter} >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit} className={stl.AllFormsWrapper}>
          <div className={stl.formsWrapper}>
            <Field className={stl.formInput} type="email" name="email" placeholder='Your eMail' onChange={handleChange} onBlur={handleBlur} value={values.email} />
            <div className={stl.errorsContainers}>
              <h3> {errors.email && touched.email && errors.email} </h3>
            </div>
          </div>

          <div className={stl.formsWrapper}>
            <input className={stl.formInput} type="password" name="password" placeholder='Set your password'
              onChange={handleChange} onBlur={handleBlur} value={values.password} />
            <div className={stl.errorsContainers}>
              <h3> {errors.password && touched.password && errors.password} </h3>
              {!captchaPic && <div className={stl.formsWrapper}><h3> {authErr} </h3></div>}
            </div>
          </div>

          {captchaPic &&
            <div className={stl.captchaDiv}>
              <img src={captchaPic} alt='err' />
              <input className={stl.formInput} type="captchaCode" name="captchaCode" placeholder={errors.captchaCode || 'Insert captcha symbols here'}
                onChange={handleChange} onBlur={handleBlur} value={values.captchaCode} />
            </div>
          }
          <div className={stl.formsWrapper}>
            <Field type="checkbox" name="rememberMe" />
            <label htmlFor="rememberMe" /> Remember Me
          </div>
          <div className={stl.formsWrapper}>
            <button type="submit" disabled={isSubmitting} className={stl.formInput}>Login!</button>
          </div>
          {captchaPic && <div className={stl.formsWrapper}><h3> {authErr} </h3></div>}
        </form>
      )}
    </Formik>
    <div className={stl.epigraph}>
      <h4>You was born in the land of courage and valor</h4>
      <h4>You must fight, samurai, don't give up like a maiden...</h4>
    </div>
  </div>
};

export default LoginContainer;
