import { connect } from 'react-redux';
import * as reader from 'ducks/reader';

const mapStateToProps = store => {
  return { ...store.readerState };
};

const mapDispatchToProps = dispatch => {
  return {
    setVoiceRate: rate => dispatch(reader.SetVoiceRate(rate)),
    setCommentsCount: rate => dispatch(reader.SetCommentCount(rate)),
    setThemeMode: theme => dispatch(reader.SetThemeMode(theme)),
    setPlayMode: playing => dispatch(reader.SetPlayMode(playing)),
    setShowVoicePane: show => dispatch(reader.ShowVoicePane(show))
  };
};

export default use => connect(mapStateToProps, mapDispatchToProps)(use);
