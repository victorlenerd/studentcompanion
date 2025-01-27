/* eslint-disable react/sort-comp */
import React, { Component, Fragment } from 'react';
import { Alert, View, ScrollView, Text, Image, StatusBar, TouchableOpacity, Dimensions, StyleSheet, BackHandler } from 'react-native';
import { colors } from 'shared/styles';
import Tracking from 'shared/tracking';
import drawerIcon from 'containers/drawerIcon';
import notes from 'containers/notes';
import withBackHandler from '../helpers/withBackHandler';


const { width, height } = Dimensions.get('window');

@notes
@drawerIcon
class Home extends Component {
  constructor() {
    super();
    this.state = {
      rencentReads: []
    };
  }

  async componentWillMount() {
    Tracking.setCurrentScreen('Page_Home');
    const { getReadNotes } = this.props;

    try {
      const rencentReads = await getReadNotes();
      this.setState({ rencentReads });
    } catch (err) {
      Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
    }

    // BackHandler.addEventListener('hardwareBackPress', () => {
    //   this.handleBackButton();
    //   return true;
    // });
    this.props.setMenu(true, null);
  }

  // eslint-disable-next-line react/sort-comp


  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
  }

  openNote(note) {
    const { setMenu, navigation: { navigate }, setCurrentNote } = this.props;
    setCurrentNote(note);
    setMenu(false, 'Home');
    navigate('Note');
  }

  render() {
    const { navigation: { navigate } } = this.props;
    return (
      <View style={style.container}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <ScrollView style={{ flex: 1 }}>
          {this.state.rencentReads.length > 0 &&
            <View style={{ padding: 15 }}>
              <Text style={style.homeTitle}>Continue Reading</Text>
              {this.state.rencentReads.filter(note => note !== null).map((rr, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => this.openNote(rr)}
                    style={[style.homeMenu, { height: 80, paddingHorizontal: 10 }]}
                  >
                    {rr &&
                    <Fragment>
                      <View style={style.number}>
                        <Text style={{ color: '#fff' }}>{i + 1}</Text>
                      </View>
                      <View style={{ marginLeft: 20 }}>
                        <Text style={style.homeSubtitle}>{rr.title}</Text>
                      </View>
                    </Fragment>
                      }
                  </TouchableOpacity>
                );
              })}
            </View>
          }
          <TouchableOpacity
            onPress={() => { navigate('SearchTyped'); }}
            style={style.homeMenu}
          >
            <Image
              resizeMode="contain"
              source={require('../assets/search-accent.png')}
              style={style.homeIcon}
            />
            <View style={{ marginLeft: 20 }}>
              <Text style={style.homeTitle}>Search</Text>
              <Text style={style.homeSubtitle}>
                Search resources by topic or titles.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { navigate('TextExtractor'); }}
            style={style.homeMenu}
          >
            <Image
              resizeMode="contain"
              source={require('../assets/eye-accent.png')}
              style={style.homeIcon}
            />
            <View style={{ marginLeft: 20 }}>
              <Text style={style.homeTitle}>Extract Text</Text>
              <Text style={style.homeSubtitle}>
                Extract Text From Notes and Documents.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { navigate('SavedCourses'); }}
            style={style.homeMenu}
          >
            <Image
              resizeMode="contain"
              source={require('../assets/books-accent.png')}
              style={style.homeIcon}
            />
            <View style={{ marginLeft: 20 }}>
              <Text style={style.homeTitle}>Library</Text>
              <Text style={style.homeSubtitle}>
                Offline resources available on your phone.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { navigate('Feedback'); }}
            style={[style.homeMenu, { marginBottom: 100 }]}
          >
            <Image
              resizeMode="contain"
              source={require('../assets/bubble-orange.png')}
              style={style.homeIcon}
            />
            <View style={{ marginLeft: 20 }}>
              <Text style={style.homeTitle}>Feedback</Text>
              <Text style={style.homeSubtitle}>
                We would love to hear from you.
              </Text>
            </View>
          </TouchableOpacity>

        </ScrollView>
      </View>
    );
  }
}

const style = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  container: {
    width,
    height,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.lightBlue,
    borderTopColor: colors.accent,
    borderTopWidth: 2,
  },
  recentReadsMain: {
    flex: 1,
    height: 150,
    padding: 20,
    backgroundColor: colors.accent
  },
  recentReadsTitle: {
    fontSize: 18,
    color: '#fff'
  },
  recentReadBox: {
    flex: 1,
    height: 100,
    marginTop: 10,
    backgroundColor: '#fff'
  },
  homeMenu: {
    flex: 1,
    height: 100,
    borderBottomWidth: 2,
    paddingHorizontal: 20,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  homeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  homeIcon: {
    width: 26,
    height: 26
  },
  homeSubtitle: {
    fontSize: 16,
    fontWeight: '200',
    color: colors.black,
    marginTop: 10,
    paddingRight: 10
  },
  number: {
    backgroundColor: colors.accent,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default withBackHandler(Home, 'exit', true);
