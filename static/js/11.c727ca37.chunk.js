(this.webpackJsonpsocial_network_deployment=this.webpackJsonpsocial_network_deployment||[]).push([[11],{179:function(e,a,n){"use strict";n.r(a),n.d(a,"UsersFuncContainer",(function(){return g}));var r=n(1),t=n(19),c=n(0),s=n.n(c),u=n(163),o=n(8),m=n(10),p=n(159),i=n.n(p),D=n(9),l=n(48),g=function(){var e=Object(o.d)(D.y),a=Object(o.d)(D.i),n=Object(o.d)(D.B),p=Object(o.d)(D.f),g=Object(o.d)(D.A),N=Object(o.c)(),T={getUsersThunk:function(e,a){return N(n.getUsersThunkAC(e,a))},setCurrentPageThunk:function(e,a){return N(n.setCurrentPageThunkAC(e,a))},followThunkToggler:function(e,a,r){return N(n.followThunkTogglerAC(e,a,r))},getCertainUserThunk:function(e,a,r){N(n.getCertainUserThunkAC(e,a,r))},sendMessageToUserThunk:function(e,n,r,t){return N(a.sendMessageToUserThunkAC(e,n,r,t,-1))},setErrorToNull:function(){return N(n.setErrorToNullAC())},componentStateCleaner:function(){N(n.unMountCleaner())}},f=e.pageSize,h=e.currentPage,d=Object(m.f)(),U=Object(m.g)().search,M=l.parse(U),E=Object(c.useState)(!1),_=Object(t.a)(E,2),B=_[0],w=_[1];Object(c.useEffect)((function(){if(M["?page"]&&Number.isInteger(+M["?page"])&&!B&&!M.term){var e=Math.trunc(+M["?page"]);e<=0&&(e=1),T.getUsersThunk(f,e),d.push({pathname:"users",search:"?page=".concat(e)}),w(!0)}else if(M["?page"]&&(Number.isInteger(+M["?page"])||B))if(M.term&&""!==M.term&&!B){d.push({pathname:"users",search:"?page=".concat(h,"&term=").concat(M.term)});var a=M.term;T.getCertainUserThunk(f,a,h),w(!0)}else M.term&&""!==M.term&&B?d.push({pathname:"users",search:"?page=".concat(h,"&term=").concat(M.term)}):d.push({pathname:"users",search:"?page=".concat(h)});else d.push({pathname:"users",search:"?page=".concat(h)}),T.getUsersThunk(f,h),w(!0);return function(){T.componentStateCleaner()}}),[h]);var b=Object(c.useState)({userPageDnmc:"",generalHeaderDnmc:"",pagBTNDnmc:"",paginationSelectedDnmc:"",paginationDnmc:"",searchInputDnmc:"",userAvaDnmc:"",followBTNDnmc:"",followBTN_ERR_DNMC:"",userNameDnmc:"",mapWrapperDnmc:"",userUnitDnmc:"",userWriteModeDnmc:"",moreUserUnitsDnmc:""}),C=Object(t.a)(b,2),O=C[0],R=C[1];return Object(c.useEffect)((function(){switch(p){case"NIGHT":return R(Object(r.a)({},O,{userPageDnmc:i.a.usersPageN,generalHeaderDnmc:i.a.generalHeaderN,pagBTNDnmc:i.a.pagBTN_N,paginationSelectedDnmc:i.a.paginationSelectedN,paginationDnmc:i.a.paginationN,searchInputDnmc:i.a.searchInputN,userAvaDnmc:i.a.userAvaN,followBTNDnmc:i.a.followBTN_N,followBTN_ERR_DNMC:i.a.followBTN_ERR_N,userNameDnmc:i.a.userNameN,mapWrapperDnmc:i.a.mapWrapperN,userUnitDnmc:i.a.userUnitN,userWriteModeDnmc:i.a.userWriteModeN,moreUserUnitsDnmc:i.a.moreUserUnitsN}));case"MORNING":return R(Object(r.a)({},O,{userPageDnmc:i.a.usersPageM,generalHeaderDnmc:i.a.generalHeaderM,pagBTNDnmc:i.a.pagBTN_M,paginationSelectedDnmc:i.a.paginationSelectedM,paginationDnmc:i.a.paginationM,searchInputDnmc:i.a.searchInputM,userAvaDnmc:i.a.userAvaM,followBTNDnmc:i.a.followBTN_M,followBTN_ERR_DNMC:i.a.followBTN_ERR_M,userNameDnmc:i.a.userNameM,mapWrapperDnmc:i.a.mapWrapperM,userUnitDnmc:i.a.userUnitM,userWriteModeDnmc:i.a.userWriteModeM,moreUserUnitsDnmc:i.a.moreUserUnitsM}));case"DAY":return R(Object(r.a)({},O,{userPageDnmc:i.a.usersPageD,generalHeaderDnmc:i.a.generalHeaderD,pagBTNDnmc:i.a.pagBTN_D,paginationSelectedDnmc:i.a.paginationSelectedD,paginationDnmc:i.a.paginationD,searchInputDnmc:i.a.searchInputD,userAvaDnmc:i.a.userAvaD,followBTNDnmc:i.a.followBTN_D,followBTN_ERR_DNMC:i.a.followBTN_ERR_D,userNameDnmc:i.a.userNameD,mapWrapperDnmc:i.a.mapWrapperD,userUnitDnmc:i.a.userUnitD,userWriteModeDnmc:i.a.userWriteModeD,moreUserUnitsDnmc:i.a.moreUserUnitsD}));case"EVENING":return R(Object(r.a)({},O,{userPageDnmc:i.a.usersPageE,generalHeaderDnmc:i.a.generalHeaderE,pagBTNDnmc:i.a.pagBTN_E,paginationSelectedDnmc:i.a.paginationSelectedE,paginationDnmc:i.a.paginationE,searchInputDnmc:i.a.searchInputE,userAvaDnmc:i.a.userAvaE,followBTNDnmc:i.a.followBTN_E,followBTN_ERR_DNMC:i.a.followBTN_ERR_E,userNameDnmc:i.a.userNameE,mapWrapperDnmc:i.a.mapWrapperE,userUnitDnmc:i.a.userUnitE,userWriteModeDnmc:i.a.userWriteModeE,moreUserUnitsDnmc:i.a.moreUserUnitsE}))}}),[p]),O.userPageDnmc?s.a.createElement(u.a,{usersInfo:e,themes:O,usersFuncs:T,delayFlag:g}):null};a.default=g}}]);
//# sourceMappingURL=11.c727ca37.chunk.js.map