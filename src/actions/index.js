/*
 * Action
 */
export const SET_VIDEO_ID = 'SET_VIDEO_ID';
export const SET_VIDEO_INFO = 'SET_VIDEO_INFO';

export function setVideoId(videoId, singer, song, num) {
    return {
        type: SET_VIDEO_ID,
        videoId: videoId,
        singer: singer,
        song: song,
        num: num
    };
}
export function setVideoInfo(param) {
    return {
        type: SET_VIDEO_INFO,
        param: param
    };
}