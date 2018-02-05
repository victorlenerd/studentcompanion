import React, { Component } from 'react';
import { View, Text, StatusBar, ActivityIndicator, ScrollView, Alert } from 'react-native';

import { main, colors } from '../shared/styles';
import { navigator } from '../shared/Navigation';

import { Button, ButtonInActive } from './Buttons';

class AcademinInfo extends Component {
  constructor(props) {
    super(props);
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
                Academic Info.
              </Text>
              <Text style={{ color: colors.white, fontSize: 18, textAlign: 'center', marginBottom: 25, marginTop: 25 }}>
                Please set your academic information, so you can get courses.
              </Text>
              <Button
                onPress={() => {
                  navigator.searchCourses({
                    settingAcademicInfo: true,
                  });
                }}
                text="Ok, Got It!"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default AcademinInfo;
