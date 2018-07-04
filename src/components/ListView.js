import React, { Component } from 'react';
import { Keyboard, View, Text, TouchableOpacity, Image, FlatList, Dimensions, StyleSheet, StatusBar } from 'react-native';
import { main, colors } from 'shared/styles';
import Loader from 'components/loader';

import connection from 'containers/connection';

const { width } = Dimensions.get('window');

@connection
class ListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isConnected: null
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data, isConnected } = nextProps;
    this.setState({ data, isConnected });
  }

  _keyExtractor = (item, index) => index;

  _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index.toString()}
        onPress={() => this.props.openItem(item)}
        style={style.listItem}
      >
        <Text style={style.listName}>{item.name}</Text>
        <Image resizeMode="contain" source={require('../assets/chevron-right.png')} style={style.chevronIcon} />
      </TouchableOpacity>
    );
  }

  _renderListHeader = () => {
    if (this.props.hideHeader) return null;
    if (!this.state.isConnected && this.state.isConnected !== null) {
      return (
        <View style={[style.listHeader, { backgroundColor: colors.red }]}>
          <Text style={style.listHeaderText}>You are offline</Text>
        </View>
      );
    }

    return (
      <View style={[style.listHeader, { backgroundColor: colors.accent }]}>
        <Text style={style.listHeaderText}>{this.props.title}</Text>
      </View>
    );
  }

  _renderEmpty = () => {
    if (this.props.hideEmptyState) return null;
    return (
      <View style={style.emptyContainer}>
        <View style={[main.emptyState, { margin: 20 }]}>
          <Text style={main.emptyStateText}>No Resource Available Yet!</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={style.container}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <FlatList
          data={this.state.data}
          keyExtractor={this._keyExtractor}
          onScrollBeginDrag={() => Keyboard.dismiss()}
          ListHeaderComponent={this._renderListHeader}
          ListEmptyComponent={this._renderEmpty}
          renderItem={this._renderItem}
        />
        {!this.props.hideLoader && <Loader />}
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBlue,
    borderTopColor: colors.accent,
    borderTopWidth: 2
  },
  emptyContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listHeader: {
    width,
    height: 80,
    paddingLeft: 20,
    justifyContent: 'center',
    backgroundColor: colors.red
  },
  listHeaderText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '300'
  },
  chevronIcon: {
    width: 18,
    height: 18
  },
  listName: {
    flex: 0.8,
    fontSize: 18,
    color: colors.black
  },
  listItem: {
    width,
    backgroundColor: colors.white,
    flexDirection: 'row',
    height: 60,
    marginBottom: 1,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  }
});

export default ListView;
