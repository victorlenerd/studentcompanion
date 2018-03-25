import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';

import reader from 'containers/reader';

import { colors } from 'shared/styles';

@reader
class NoteToolbarOptions extends Component {
  state = {
    themeMode: 'light',
    showVoicePane: false,
    playing: false,
    showEdit: false,
    showSave: false,
    commentCount: 0
  }

  componentWillMount() {
    const { showEdit, showSave } = this.props;
    if (this.state.showEdit !== showEdit) this.setState({ showEdit });
    if (this.state.showSave !== showSave) this.setState({ showSave });
  }

  componentWillReceiveProps(nextProps) {
    const { showEdit, showSave, themeMode, showVoicePane, playing, commentCount } = nextProps;
    if (this.state.themeMode !== themeMode) this.setState({ themeMode });
    if (this.state.showVoicePane !== showVoicePane) this.setState({ showVoicePane });
    if (this.state.playing !== playing) this.setState({ playing });
    if (this.state.showEdit !== showEdit) this.setState({ showEdit });
    if (this.state.showSave !== showSave) this.setState({ showSave });
    this.setState({ commentCount });
  }

  setPlayMode = () => {
    this.props.setPlayMode(!this.state.playing);
    this.setState({
      playing: !this.state.playing
    });
  }

  setTheme = () => {
    const newMode = (this.state.themeMode === 'light') ? 'dark' : 'light';
    this.setState({ themeMode: newMode });
    this.props.setThemeMode(newMode);
  }

  showVoiceRatePane = () => {
    this.props.setShowVoicePane(!this.state.showVoicePane);
  }

  openComments = () => {
    this.props.navigation.navigate('Comments');
  }

  save = () => {
    this.props.setSave(true);
  }

  edit = () => {
    this.props.setEdit(true);
  }

  renderCommentsCount = () => {
    const kDNum = num => {
      const numStr = String(num);

      if (num > 999 && num < 9999) {
        numStr.substring(0, 1).concat('K');
      }

      if (num > 9999 && num < 99999) {
        numStr.substring(0, 2).concat('K');
      }

      if (num > 99999) {
        numStr.substring(0, 3).concat('K');
      }

      return num;
    };

    if (this.state.commentCount > 0) {
      return (
        <View style={style.commentCountBubble}>
          <Text style={{ fontSize: 8, color: colors.white }}>{kDNum(this.props.commentCount)}</Text>
        </View>
      );
    }
  }

  renderPlayButton = () => {
    if (this.state.playing) {
      return (
        <Image source={require('../assets/pause.png')} style={style.menuIcon} resizeMode="contain" />
      );
    }

    return (
      <Image source={require('../assets/play.png')} style={style.menuIcon} resizeMode="contain" />
    );
  }

  renderNightButton() {
    if (this.state.themeMode === 'light') {
      return (<Image source={require('../assets/moon.png')} style={style.menuIcon} resizeMode="contain" />);
    }

    return (<Image source={require('../assets/sun.png')} style={style.menuIcon} resizeMode="contain" />);
  }

  render() {
    const { extracted } = this.props;

    return (
      <View style={style.container}>
        <TouchableOpacity onPress={this.setTheme}>
          {this.renderNightButton()}
        </TouchableOpacity>

        <TouchableOpacity onPress={this.setPlayMode}>
          {this.renderPlayButton()}
        </TouchableOpacity>

        {!extracted &&
          <TouchableOpacity onPress={this.openComments}>
            <View>
              {this.renderCommentsCount()}
              <Image resizeMode="contain" style={style.menuIcon} source={require('../assets/bubble-white.png')} />
            </View>
          </TouchableOpacity>}

        {extracted && this.state.showEdit &&
          <TouchableOpacity onPress={this.edit}>
            <Text style={style.menuTxt}>EDIT</Text>
          </TouchableOpacity>}

        {extracted && this.state.showSave &&
          <TouchableOpacity onPress={this.save}>
            <Text style={style.menuTxt}>SAVE</Text>
          </TouchableOpacity>}
      </View>
    );
  }
}


NoteToolbarOptions.propTypes = {
  showVoicePane: PropTypes.bool,
  playing: PropTypes.bool,
  commentCount: PropTypes.number,
  themeMode: PropTypes.string,
  navigation: PropTypes.object,
  extracted: PropTypes.bool,
  showEdit: PropTypes.bool,
  showSave: PropTypes.bool,
  setPlayMode: PropTypes.func,
  setShowVoicePane: PropTypes.func,
  setThemeMode: PropTypes.func,
  setSave: PropTypes.func,
  setEdit: PropTypes.func
};

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  menuTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 20
  },
  menuIcon: {
    width: 22,
    height: 22,
    marginRight: 20
  },
  commentCountBubble: {
    paddingHorizontal: 5,
    paddingVertical: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12.5,
    backgroundColor: '#e74c3c',
    position: 'absolute',
    right: 10,
    zIndex: 100
  }
});

export default NoteToolbarOptions;
