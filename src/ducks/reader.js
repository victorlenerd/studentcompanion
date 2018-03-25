const SET_VOICE_RATE = 'SET_VOICE_RATE';
const SHOW_VOICE_PANE = 'SHOW_VOICE_PANE';
const SET_THEME_MODE = 'SET_THEME_MODE';
const SET_PLAY_MODE = 'SET_PLAY_MODE';
const SET_COMMENT_COUNT = 'SET_COMMENT_COUNT';
const SAVE = 'SAVE';
const EDIT = 'EDIT';
const SHOW_SAVE = 'SHOW_SAVE';
const SHOW_EDIT = 'SHOW_EDIT';

const initialState = {
  voiceRate: 0.5,
  save: false,
  edit: false,
  commentCount: 0,
  showVoicePane: false,
  playing: false,
  showSave: false,
  showEdit: false,
  themeMode: 'light',
};


export const ShowSave = showSave => ({
  type: SHOW_SAVE,
  showSave
});

export const ShowEdit = showEdit => ({
  type: SHOW_EDIT,
  showEdit
});

export const Save = save => ({
  type: SAVE,
  save
});

export const Edit = edit => ({
  type: EDIT,
  edit
});

export const SetVoiceRate = voiceRate => ({
  type: SET_VOICE_RATE,
  voiceRate
});

export const ShowVoicePane = showVoicePane => ({
  type: SHOW_VOICE_PANE,
  showVoicePane
});

export const SetThemeMode = theme => ({
  type: SET_THEME_MODE,
  theme
});

export const SetPlayMode = playing => ({
  type: SET_PLAY_MODE,
  playing
});

export const SetCommentCount = count => ({
  type: SET_COMMENT_COUNT,
  count
});

export const ReaderReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_SAVE:
      return Object.assign({}, state, {
        showSave: action.showSave
      });
    case SHOW_EDIT:
      return Object.assign({}, state, {
        showEdit: action.showEdit
      });
    case SAVE:
      return Object.assign({}, state, {
        save: action.save
      });
    case EDIT:
      return Object.assign({}, state, {
        edit: action.edit
      });
    case SET_VOICE_RATE:
      return Object.assign({}, state, {
        voiceRate: action.voiceRate
      });
    case SHOW_VOICE_PANE:
      return Object.assign({}, state, {
        showVoicePane: action.showVoicePane
      });
    case SET_THEME_MODE:
      return Object.assign({}, state, {
        themeMode: action.theme
      });
    case SET_PLAY_MODE:
      return Object.assign({}, state, {
        playing: action.playing
      });
    case SET_COMMENT_COUNT:
      return Object.assign({}, state, {
        commentCount: action.count
      });
    default:
      break;
  }

  return state;
};
