import {profileReducer, followingTogglerAC} from './profileReducer'

it ("follow action must be acted", ()=>{
    // 1) some test data
    let action = followingTogglerAC(true)
    let state = {
        isFollowing: false,
    };
    // 2) some action
    let newState = profileReducer(state,action)
    // 3) some expectation
    expect (newState.isFollowing).toBe(true)
})
// in terminal comand 'npm test'