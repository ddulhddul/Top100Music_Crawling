/*
 * Action
 */
export const SET_VIDEO_ID = 'SET_VIDEO_ID';
export const SET_VIDEO_INFO = 'SET_VIDEO_INFO';

export function setVideoId(videoId) {
    return {
        type: SET_VIDEO_ID,
        videoId: videoId
    };
}
export function setVideoInfo(param) {
    return {
        type: SET_VIDEO_INFO,
        param: param
    };
}