(this.webpackJsonpsocial_network_deployment=this.webpackJsonpsocial_network_deployment||[]).push([[9],{175:function(e,a,r){e.exports={loginBackground:"unAuthorised_loginBackground__2dWh6",reactCrown:"unAuthorised_reactCrown__3jex1",redCrown:"unAuthorised_redCrown__TTTSE",blueCrown:"unAuthorised_blueCrown__VjORe","reactCrown-spin":"unAuthorised_reactCrown-spin__3eUp7",AllFormsWrapper:"unAuthorised_AllFormsWrapper__Im6FY",formsWrapper:"unAuthorised_formsWrapper__3fjfk",formInput:"unAuthorised_formInput__Prid_",errorsContainers:"unAuthorised_errorsContainers__ay1Wc",captchaDiv:"unAuthorised_captchaDiv__2bNr6",epigraph:"unAuthorised_epigraph__eHB58"}},180:function(e,a,r){"use strict";r.r(a);var t=r(19),n=r(0),o=r.n(n),c=r(175),s=r.n(c),l=r(158),i=r(8),m=r(9),u=function(e){var a=e.unAuthInfo,r=a.authErr,c=a.captchaPic,i=a.errCaptchaGet,m=e.actions,u=Object(n.useState)(s.a.redCrown),p=Object(t.a)(u,2),d=p[0],h=p[1];return o.a.createElement("div",{className:s.a.loginBackground},o.a.createElement("div",{className:"".concat(s.a.reactCrown," ").concat(d)}),o.a.createElement("h1",null,"Sign in, samurai!"),o.a.createElement(l.b,{initialValues:{text:"",email:"",password:"",rememberMe:!0,captchaCode:""},validate:function(e){var a={};return e.email?/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(e.email)||(a.email="Invalid email address"):a.email="Required Field",e.password?e.password.length<3&&(a.password="Set longer pass"):a.password="Required Field",c&&(e.captchaCode||(a.captchaCode=i)),0===Object.keys(a).length?h(s.a.blueCrown):h(s.a.redCrown),a},onSubmit:function(e,a){var r=a.setSubmitting,t=e.email,n=e.password,o=e.rememberMe,c=e.captchaCode;!function(e,a,r,t){m.setMeLoginThunk(e,a,r,t)}(t,n,o,c),c="",r(!1)}},(function(e){var a=e.values,t=e.errors,n=e.touched,i=e.handleChange,m=e.handleBlur,u=e.handleSubmit,p=e.isSubmitting;return o.a.createElement("form",{onSubmit:u,className:s.a.AllFormsWrapper},o.a.createElement("div",{className:s.a.formsWrapper},o.a.createElement(l.a,{className:s.a.formInput,type:"email",name:"email",placeholder:"Your eMail",onChange:i,onBlur:m,value:a.email}),o.a.createElement("div",{className:s.a.errorsContainers},o.a.createElement("h3",null," ",t.email&&n.email&&t.email," "))),o.a.createElement("div",{className:s.a.formsWrapper},o.a.createElement("input",{className:s.a.formInput,type:"password",name:"password",placeholder:"Set your password",onChange:i,onBlur:m,value:a.password}),o.a.createElement("div",{className:s.a.errorsContainers},o.a.createElement("h3",null," ",t.password&&n.password&&t.password," "),!c&&o.a.createElement("div",{className:s.a.formsWrapper},o.a.createElement("h3",null," ",r," ")))),c&&o.a.createElement("div",{className:s.a.captchaDiv},o.a.createElement("img",{src:c,alt:"err"}),o.a.createElement("input",{className:s.a.formInput,type:"captchaCode",name:"captchaCode",placeholder:t.captchaCode||"Insert captcha symbols here",onChange:i,onBlur:m,value:a.captchaCode})),o.a.createElement("div",{className:s.a.formsWrapper},o.a.createElement(l.a,{type:"checkbox",name:"rememberMe"}),o.a.createElement("label",{htmlFor:"rememberMe"})," Remember Me"),o.a.createElement("div",{className:s.a.formsWrapper},o.a.createElement("button",{type:"submit",disabled:p,className:s.a.formInput},"Login!")),c&&o.a.createElement("div",{className:s.a.formsWrapper},o.a.createElement("h3",null," ",r," ")))})),o.a.createElement("div",{className:s.a.epigraph},o.a.createElement("h4",null,"You was born in the land of courage and valor"),o.a.createElement("h4",null,"You must fight, samurai, don't give up like a maiden...")))};a.default=function(){var e=Object(i.d)(m.c),a=Object(i.d)(m.p),r={authErr:a.authErr,captchaPic:a.captchaPic,errCaptchaGet:a.errCaptchaGet},t=Object(i.c)(),n={setMeLoginThunk:function(a,r,n,o){return t(e.setMeLoginThunkAC(a,r,n,o))},getCaptchaThunk:function(){return t(e.getCaptchaThunkAC())}};return o.a.createElement(u,{actions:n,unAuthInfo:r})}}}]);
//# sourceMappingURL=9.7cfecb1c.chunk.js.map