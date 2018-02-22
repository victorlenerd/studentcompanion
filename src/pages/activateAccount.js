import React, { Component } from 'react';
import { View, Text, StatusBar, ScrollView, Linking } from 'react-native';


import users from 'containers/users';
import Loader from 'components/loader';
import { main, colors } from 'shared/styles';
import { Button } from 'components/buttons';

@users
class ActivateAccount extends Component {
  render() {
    const { currentUser: { email, name } } = this.props;

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
                  Linking.openURL(`https://paystack.com/pay/6n9b-1ng8g?email=${email}&name=${name}`);
                }}
                text="₦100 For A Month"
              />
              <Button
                onPress={() => {
                  Linking.openURL(`https://paystack.com/pay/2d28enjfhd?email=${email}&first name=${name}`);
                }}
                text="₦1000 For A Year"
              />
            </View>
          </View>
          <Loader />
        </View>
      </ScrollView>
    );
  }
}

export default ActivateAccount;