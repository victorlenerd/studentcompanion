import React, { Component } from 'react';
import { View, Text, ScrollView, Picker, Dimensions, TouchableOpacity, Alert } from 'react-native';

import { connect } from 'react-redux';

import { navigator } from '../shared/Navigation';
import { main, colors } from '../shared/styles';

import { ButtonInActive, Button } from './Buttons';

// import RNCalendarEvents from 'react-native-calendar-events';

import { AddReminder } from '../ducks/Reminders';

var { width } = Dimensions.get('window');

class ReminderModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      repeats: ['Daily', 'Weekly', 'Monthly'],
      hours: [],
      mins: [],
      meridians: ['AM', 'PM'],
      hour: 'Hour',
      min: 'Minute',
      repeatType: 'Daily',
      meridian: 'Am',
      repeatReminder: false,
    };
  }

  componentDidMount(event) {
    let mins = [],
      hours = [];

    let zeroPrefix = num => {
      return num < 10 ? `0${num}` : `${num}`;
    };

    for (let i = 0; i < 60; i++) {
      mins.push(zeroPrefix(i));
    }

    for (let i = 0; i < 12; i++) {
      hours.push(zeroPrefix(i));
    }

    hours.unshift('Hour');
    mins.unshift('Minute');

    this.setState({ mins, hours });
  }

  _cancel() {
    navigator.studyTime();
  }

  _done() {
    RNCalendarEvents.authorizeEventStore()
      .then(status => {
        if (status === 'authorized') {
          let date = new Date();

          if (this.state.hour === 'Hour' || this.state.minute === 'Minute') {
            Alert.alert('Error', 'Please select a valid time!', [{ text: 'Cancel', style: 'cancel' }]);
          } else {
            let h = Number(this.state.hour);
            let m = Number(this.state.min);
            if (this.state.meridian === 'PM') h = 12 + h;
            date.setHours(h, m, 0, 0);

            RNCalendarEvents.saveEvent('Student Companion Reminder', {
              notes: `Hello! It's Time To Study`,
              startDate: date.toISOString(),
              endDate: date.toISOString(),
              recurrence: this.state.repeatType.toLowerCase(),
              alarms: [
                {
                  title: "Hello! It's Time To Study",
                  date: date.toISOString(),
                },
              ],
            })
              .then(id => {
                this.props
                  .addReminder({
                    id,
                    startDate: date,
                    endDate: date,
                    recurrence: this.state.repeatType.toLowerCase(),
                  })
                  .then(() => {
                    navigator.studyTime();
                  })
                  .catch(err => {
                    Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
                  });
              })
              .catch(error => {
                Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
              });
          }
        }
      })
      .catch(error => {
        Alert.alert('Error', err.message, [{ text: 'Cancel', style: 'cancel' }]);
      });
  }

  _addDay(day) {
    let newRepeatDays = this.state.repeatDays;
    let index = this.state.repeatDays.indexOf(day);
    if (index === -1) {
      newRepeatDays.push(day);
    } else {
      newRepeatDays.splice(index, 1);
    }

    this.setState({ repeatDays: newRepeatDays });
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          width,
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderTopColor: colors.accent,
          borderTopWidth: 2,
        }}
      >
        <ScrollView style={{ flex: 0.8, flexDirection: 'column' }}>
          <Text style={{ fontSize: 18, textAlign: 'center', fontWeight: 'bold', marginBottom: 50, marginTop: 50 }}>
            Choose Time
          </Text>
          <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 20, paddingRight: 20 }}>
            <View style={{ flex: 0.3 }}>
              <Picker
                selectedValue={this.state.hour}
                onValueChange={(hour, index) => {
                  this.setState({ hour });
                }}
              >
                {this.state.hours.map((hour, index) => {
                  return <Picker.Item key={index} value={hour} label={hour} />;
                })}
              </Picker>
            </View>
            <View style={{ flex: 0.3 }}>
              <Picker
                selectedValue={this.state.min}
                onValueChange={(min, index) => {
                  this.setState({ min });
                }}
              >
                {this.state.mins.map((min, index) => {
                  return <Picker.Item key={index} value={min} label={min} />;
                })}
              </Picker>
            </View>
            <View style={{ flex: 0.3 }}>
              <Picker
                selectedValue={this.state.meridian}
                onValueChange={meridian => {
                  this.setState({ meridian });
                }}
              >
                {this.state.meridians.map((m, index) => {
                  return <Picker.Item key={index} value={m} label={m} />;
                })}
              </Picker>
            </View>
          </View>

          <Text style={{ fontSize: 18, textAlign: 'center', fontWeight: 'bold', marginBottom: 50, marginTop: 50 }}>
            Repeat
          </Text>
          {this.state.repeats.map((repeatType, i) => {
            return (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  this.setState({ repeatType });
                }}
                style={{
                  flex: 1,
                  paddingLeft: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  width,
                  height: 60,
                  borderTopColor: colors.gray,
                  borderTopWidth: 1,
                }}
              >
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: this.state.repeatType === repeatType ? colors.accent : colors.gray,
                  }}
                />
                <Text style={{ fontSize: 18, marginLeft: 20 }}>{repeatType}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={{ width, flex: 0.2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <ButtonInActive text="Cancel" onPress={this._cancel.bind(this)} />
          <Button text="Done" onPress={this._done.bind(this)} />
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addReminder: reminder => {
      return dispatch(AddReminder(reminder));
    },
  };
};

const mapStateToProps = store => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ReminderModal);
