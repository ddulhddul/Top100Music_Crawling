/*
 * Reducer
 */
import { SET_VIDEO_ID,
         SET_VIDEO_INFO,
         SET_PLAY_TYPE,
         SET_VIDEO_PLAYER,
         SET_VIDEO_HIDDEN,
         SET_VIDEO_NUM } from '../actions'
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
                song: action.song
            });
        case SET_VIDEO_INFO:
            return Object.assign({}, state, {
                result: action.param.result,
                totNum: action.param.totNum,
                yymmddhh: action.param.yymmddhh                
            });
        case SET_PLAY_TYPE:
            return Object.assign({}, state, {
                playType: action.playType
            });
        case SET_VIDEO_NUM:
            return Object.assign({}, state, {
                num: action.num
            });
        case SET_VIDEO_PLAYER:
            return Object.assign({}, state, {
                player: action.player
            });
        case SET_VIDEO_HIDDEN:
            return Object.assign({}, state, {
                videoHidden: action.videoHidden
            });
        default:
            return state;
    }
}

const videoReducer = combineReducers({
    videoInfo
})
export default videoReducer