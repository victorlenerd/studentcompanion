import React, { Component } from 'react';
import { View, Text, ActivityIndicator, StatusBar, ScrollView, Linking, Alert, TouchableHighlight } from 'react-native';

import { connect } from 'react-redux';

import { main, colors } from '../shared/styles';
import { navigator } from '../shared/Navigation';
import { Button, ButtonInActive } from './Buttons';

import { GetCurrentUser } from '../ducks/User';
import { GetPrice } from '../ducks/Price';

class ActivateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: 0,
      email: '',
      name: '',
    };
  }

  componentDidMount() {
    this.props
      .getCurrentUser()
      .then(user => {
        this.setState({
          email: user.email,
          name: user.name,
        });
      })
      .catch(err => {
        Alert.alert('An Error Occured', err.message, [{ text: 'Cancel', style: 'cancel' }]);
      });
  }

  renderIndicator() {
    if (this.props.isLoading) {
      return (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator
            color="#fff"
            size="large"
            style={{
              width: 60,
              height: 60,
              backgroundColor: colors.black,
              borderRadius: 6,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </View>
      );
    }
  }

  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.black }}>
        <View style={[main.container, { backgroundColor: colors.black }]}>
          <StatusBar backgroundColor={colors.black} barStyle="light-content" />
          <View
            style={[
              main.content,
              {
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: colors.black,
                flexDirection: 'column',
              },
            ]}
          >
            <View style={{ marginTop: 100, marginBottom: 100 }}>
              <Text style={{ color: colors.white, fontSize: 32, textAlign: 'center', fontWeight: '200' }}>
                Renew Your Subscription.
              </Text>

              <Text style={{ color: colors.white, fontSize: 18, textAlign: 'center', marginTop: 50, marginBottom: 50 }}>
                Sorry your subscription has expired. Renew your subscription and get unlimited acces to resources.
              </Text>

              <Button
                onPress={() => {
                  //https://paystack.com/pay/09a7m9phd3
                  Linking.openURL(
                    `https://paystack.com/pay/6n9b-1ng8g?email=${this.state.email}&name=${this.state.name}`
                  );
                }}
                text="₦100 For A Month"
              />
              <Button
                onPress={() => {
                  Linking.openURL(
                    `https://paystack.com/pay/2d28enjfhd?email=${this.state.email}&first name=${
                      this.state.firstName
                    }&last name=${this.state.lastName}`
                  );
                }}
                text="₦1000 For A Year"
              />
            </View>
          </View>
          {this.renderIndicator()}
        </View>
      </ScrollView>
    );
  }
}

let mapDispatchToProps = dispatch => {
  return {
    getPrice: () => {
      dispatch(GetPrice());
    },
    getCurrentUser: () => {
      return dispatch(GetCurrentUser());
    },
  };
};

let mapStateToProps = store => {
  return {
    isLoading: store.requestState.status,
    price: store.priceState.price,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivateAccount);
