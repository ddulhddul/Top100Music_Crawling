/*
 * Reducer
 */
import { SET_VIDEO_ID, SET_VIDEO_INFO, SET_PLAY_TYPE } from '../actions'
import { combineReducers } from 'redux'

const initialState = {
    videoId: '',
    index: 0,
    result: [],
    totNunm: 0,
    yymmddhh: ''
};

const videoInfo = (state = initialState, action) => {
    switch(action.type) {
        case SET_VIDEO_ID:
            return Object.assign({}, state, {
                videoId: action.videoId,
                singer: action.singer,
                song: action.song,
                num: action.num
            });
        case SET_VIDEO_INFO:
            return Object.assign({}, state, {
                result: action.param.result,
                yymmddhh: action.param.yymmddhh                
            });
        case SET_PLAY_TYPE:
            return Object.assign({}, state, {
                playType: action.playType
            });
        default:
            return state;
    }
}

const videoReducer = combineReducers({
    videoInfo
})
export default videoReducer