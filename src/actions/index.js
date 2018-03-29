/*
 * Action
 */
export const SET_VIDEO_ID = 'SET_VIDEO_ID';
export const SET_VIDEO_INFO = 'SET_VIDEO_INFO';
export const SET_PLAY_TYPE = 'SET_PLAY_TYPE';
export const SET_VIDEO_NUM = 'SET_VIDEO_NUM';

export function setVideoId(videoId, singer, song) {
    return {
        type: SET_VIDEO_ID,
        videoId: videoId,
        singer: singer,
        song: song
    };
}
export function setVideoInfo(param) {
    return {
        type: SET_VIDEO_INFO,
        param: param
    };
}
export function setPlayType(playType) {
    return {
        type: SET_PLAY_TYPE,
        playType: playType
    };
}
export function setVideoNum(num) {
    return {
        type: SET_VIDEO_NUM,
        num: num
    };
}