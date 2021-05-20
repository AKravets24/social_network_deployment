import axios from "axios";

const instance = axios.create({
  withCredentials: true,
  baseURL: 'https://social-network.samuraijs.com/api/1.0/',
  headers: { "API-KEY": "83df008c-c6eb-4d84-acd3-e62be0f407d9" },// kravArt24 acc
  // headers: { "API-KEY": "2209078f-8a88-4842-bf3c-feed239cd899" },//jKarver24 acc 
});

export const usersApi = {
  // INITIALISATION ------------------------------------------------------------------------------------------------------------ INITIALISATION
  setMeLogin(email: string, password: string, rememberMe: boolean = false, captcha: string = '') {
    return instance.post<SetMeLogin_Type>(`/auth/login`, { email, password, rememberMe, captcha })
  },
  // UNAUTHORISED -------------------------------------------------------------------------------------------------------------- UNAUTHORISED
  getLogIn() { return instance.get<GetLogIn_Type>(`/auth/me`) },
  setMeLogOut() { return instance.delete<SetMeLogOut_Type>(`/auth/login`) },
  getCaptcha() { return instance.get<GetCaptcha_Type>(`/security/get-captcha-url`) },
  // PROFILE ------------------------------------------------------------------------------------------------------------------- PROFILE
  getProfile(userId: null | number) { return instance.get<ProfileData_Type>(`profile/${userId}`) },
  getStatus(userId: null | number) { return instance.get<string>(`profile/status/${userId}`) },
  updateMyStatus(status: string) { return instance.put<string>(`profile/status`, { status: status }) },
  updateMyAvatar(file: string) {
    const formData = new FormData(); formData.append('image', file);
    return instance.put<UpdateMyAva_Type>(`profile/photo`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  // FRIENDS ------------------------------------------------------------------------------------------------------------------- FRIENDS
  getMyFriends(listPage: number) { return instance.get<UsersListData_Type>(`users?friend=true&count=50&page=${listPage}`) },
  // DIALOGS ------------------------------------------------------------------------------------------------------------------- DIALOGS
  getMyNegotiatorsList() { return instance.get<DialogsList_Type[]>(`dialogs`) },
  getTalkWithUser(userId: number, msgCount: number = 10 /* 20 */, pageNumber: number = 1) { return instance.get<CertainDialog_Type>(`dialogs/${userId}/messages?count=${msgCount}&page=${pageNumber}`) },
  sendMsgToTalker(userId: null | number, body: string) { return instance.post<SendMsgToTalker_Type>(`dialogs/${userId}/messages`, { body }) },
  getNewMessages() { return instance.get<number>(`dialogs/messages/new/count`) },
  deleteMessage(messageId: string) { return instance.delete<DeleteMSG_Type>(`dialogs/messages/${messageId}`) },
  setAsSpamMessage(messageId: string) { return instance.post<SetAsSpamMSG_Type>(`dialogs/messages/${messageId}/spam`) },
  // USERS --------------------------------------------------------------------------------------------------------------------- USERS
  getUsers(pageSize = 10, currentPage: number = 1) { return instance.get<UsersListData_Type>(`users?count=${pageSize}&page=${currentPage}`) },
  getCertainUser(pageSize: number | null, userName: string, pageOfEquals: number = 1) { return instance.get<UsersListData_Type>(`users?count=${pageSize}&term=${userName}&page=${pageOfEquals}`) },
  followRequest(userId: null | number) { return instance.post<Un_Follow_Type>(`follow/${userId}`) },
  unFollowRequest(userId: null | number) { return instance.delete<Un_Follow_Type>(`follow/${userId}`) },
};

export type SocketAPI_Type = {
  createChannel: () => WebSocket,
}

export let socketAPI: SocketAPI_Type = {
  // CHAT --------------------------------------------------------------------------------------------------------------------- CHAT
  createChannel: () => {
    let wsChannel = new WebSocket(`wss://social-network.samuraijs.com/handlers/ChatHandler.ashx`)
    return wsChannel
  }
}



type SetMeLogin_Type = { data: { id: number, login: string, email: string }, fieldsErrors: string[], messages: string[], resultCode: number };
type GetCaptcha_Type = { url: string };
type SetMeLogOut_Type = { data: {}, fieldsErrors: string[], messages: string[], resultCode: number };
type UpdateMyAva_Type = { data: { photos: { small: string, large: string } } };
export type ProfileData_Type = {
  aboutMe: null | string
  contacts: { facebook: string, github: string, instagram: string, mainLink: string, twitter: string, vk: string, website: string, youtube: string }
  fullName: string
  lookingForAJob: boolean
  lookingForAJobDescription: null | string
  photos: { small: null | string, large: null | string }
  userId: number
};
export type GetLogIn_Type = { data: { id: number, email: string, login: string }, resultCode: number, messages: Array<string>, message: string };
export type DialogsList_Type = {
  hasNewMessages: boolean
  id: number
  lastDialogActivityDate: string
  lastUserActivityDate: string
  newMessagesCount: number
  photos: { small: null | string, large: null | string }
  userName: string
};
// PseudoMsg_Type
export type MessageData_Type = { addedAt: string, body: string, id: string, recipientId: number, senderId: number, translatedBody: null | boolean, viewed: boolean, actionKey?: string | any } /* |
{ body: string, actionKey: string, senderId: number, isSending: boolean, addedAt: string, deletedByRecipient: boolean, deletedBySender: boolean, distributionId: null, id: string, isSpam: boolean, recipientId: number, recipientName: string, senderName: string, translatedBody: null, viewed: boolean } */

export type CertainDialog_Type = { error?: null | string, items: MessageData_Type[], totalCount?: number }
type SendMsgToTalker_Type = {
  data: {
    message: {
      addedAt: string
      body: string
      deletedByRecipient: boolean
      deletedBySender: boolean
      distributionId: null
      id: string
      isSpam: boolean
      recipientId: number
      recipientName: string
      senderId: number
      senderName: string
      translatedBody: null
      viewed: boolean
      actionKey?: string
    }
  }
}
export type UsersArr = {
  error: string
  followed: boolean
  id: number | any // в Users в jsx почему-то ругается при мапинге, если оставить number 
  name: string
  photos: { small: string | null, large: string | null }
  status: null | string
  uniqueUrlName: null
}
type UsersListData_Type = { error: null, items: UsersArr[], totalCount: number }
type DeleteMSG_Type = {}
type SetAsSpamMSG_Type = {}
type Un_Follow_Type = {}

// usersApi.getLogIn().then((asd:AxiosResponse<number>)=> asd.data.) 

//================================================================================================================



// import axios from "axios";  //- last version

// const instance = axios.create({
//     withCredentials: true,
//     baseURL: 'https://social-network.samuraijs.com/api/1.0/',
//     headers: { "API-KEY": "83df008c-c6eb-4d84-acd3-e62be0f407d9"}, });

// export const usersApi = {
//     // INITIALISATION ------------------------------------------------------------------------------------------------------------ INITIALISATION
//     setMeLogin (email:string,password:string,rememberMe:boolean=false,captcha:string='')
//             {return instance.post(`/auth/login`,{email,password,rememberMe,captcha})   .then(res=>res).catch(err=>err)},
//     // UNAUTHORISED -------------------------------------------------------------------------------------------------------------- UNAUTHORISED
//     setMeLogOut()                   { return instance.delete(`/auth/login`)                .then(res=>res.data)},
//     getLogIn()                      { return instance.get(`/auth/me`)                      .then(res=>res).catch(err=>err)},
//     getCaptcha()                    { return instance.get(`/security/get-captcha-url`)     .then(res=>res).catch(err=>err)},
//     // PROFILE ------------------------------------------------------------------------------------------------------------------- PROFILE
//     getProfile(userId:number)       { return instance.get(`profile/${userId}`)             .then(res=>res).catch(err=>err)},
//     getStatus(userId:number)        { return instance.get(`profile/status/${userId}`)      .then(res=>res).catch(err=>err)},
//     updateMyStatus(status:string)   { return instance.put(`profile/status`,{status: status})
//                                                                                            .then(res=>res).catch(err=>err)},
//     updateMyAvatar(file:string)     { const formData = new FormData(); formData.append('image', file);
//         return instance.put(`profile/photo`, formData, { headers: { 'Content-Type': 'multipart/form-data' }
//         })                                                                                  .then(res=>res).catch(err=>err)},
//     // FRIENDS ------------------------------------------------------------------------------------------------------------------- FRIENDS
//     getMyFriends()               { return instance.get(`users?friend=true&count=50`)        .then(res=>res).catch(err=>err)},
//     // DIALOGS ------------------------------------------------------------------------------------------------------------------- DIALOGS
//     getMyNegotiatorsList ()      { return instance.get(`dialogs`)                           .then(res=>res).catch(err=>err)},
//     getTalkWithUser (userId:number,msgCount:number=20,pageNumber:number=1)
//     { return instance.get(`dialogs/${userId}/messages?count=${msgCount}&page=${pageNumber}`)
//                                                                                             .then(res=>res).catch(err=>err)},
//     sendMsgToTalker(userId:number,body:string) { return instance.post(`dialogs/${userId}/messages`,{body})
//                                                                                             .then(res=>res).catch(err=>err)},
//     getNewMessages ()            { return instance.get(`dialogs/messages/new/count`)        .then(res=>res).catch(err=>err)},
//     deleteMessage  (messageId:string)   { return instance.delete(`dialogs/messages/${messageId}`)
//                                                                                             .then(response => response.data  )},
//     setAsSpamMessage(messageId:string)  { return instance.post(`dialogs/messages/${messageId}/spam`)
//                                                                                             .then(response => response.data  )},
//     // USERS --------------------------------------------------------------------------------------------------------------------- USERS
//     getUsers(pageSize =10,currentPage=1){
//         return instance.get(`users?count=${pageSize}&page=${currentPage}`)                 .then(res=>res).catch(err=>err)},
//     getCertainUser(pageSize:number|null, userName:string,pageOfEquals:number=1)
//     {return instance.get(`users?count=${pageSize}&term=${userName}&page=${pageOfEquals}`)  .then(res=>res).catch(err=>err)},
//     followRequest  (userId:number)      { return instance.post(`follow/${userId}`)         .then(res=>res).catch(err=>err)},
//     unFollowRequest(userId:number)      { return instance.delete(`follow/${userId}`)       .then(res=>res).catch(err=>err)},
// };

