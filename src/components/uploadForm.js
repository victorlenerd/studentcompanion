import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, TextInput, Picker, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { Button, ButtonInActive } from 'components/buttons';
import { colors, main } from 'shared/styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

const { width } = Dimensions.get('window');

class UploadForm extends Component {
  state = {
    type: ['Note', 'Past Questions'],
    selectedType: 'Note',
    submitted: false,
    school: '',
    faculty: '',
    department: '',
    level: '',
    courseName: '',
    courseCode: '',
  }

  isFormValid = () => {
    if (
      this.state.school.length < 1 ||
      this.state.faculty.length < 1 ||
      this.state.department.length < 1 ||
      this.state.level.length < 1 ||
      this.state.courseName.length < 1 ||
      this.state.courseCode.length < 1
    ) {
      Alert.alert('Err!', 'Some fields are empty', [{ text: 'Cancel', style: 'cancel' }]);
      return false;
    }

    return true;
  };

  submit = () => {
    const { selectedType, school, faculty, department, level, courseName, courseCode } = this.state;
    if (this.isFormValid()) {
      this.props.next({ type: selectedType, school, faculty, department, level, courseName, courseCode });
    }
  }

  render() {
    return (
      <View style={style.container}>
        <KeyboardAwareScrollView style={style.keyboard}>
          <View style={style.inner}>
            <Text style={style.title}>New Uploads</Text>
            <View style={style.formRow}>
              <Text style={{ color: colors.black, fontSize: 18 }}>Upload Type</Text>
              <Picker
                selectedValue={this.state.selectedType}
                onValueChange={type => this.setState({ selectedType: type })}
              >
                {this.state.type.map((type, index) => {
                  return <Picker.Item key={() => `${type}${index}`} value={type} label={type} />;
                })}
              </Picker>
            </View>
            <View style={style.formRow}>
              <TextInput
                autoCapitalize="none"
                placeholder="School"
                onChange={e => this.setState({ school: e.nativeEvent.text })}
                style={[main.textInput, style.input, (this.state.submitted && this.state.school.length < 1) ? { backgroundColor: colors.red } : {}]}
              />
            </View>
            <View style={style.formRow}>
              <TextInput
                autoCapitalize="none"
                placeholder="Faculty"
                onChange={e => this.setState({ faculty: e.nativeEvent.text })}
                style={[main.textInput, style.input, (this.state.submitted && this.state.faculty.length < 1) ? { backgroundColor: colors.red } :  {}]}
              />
            </View>
            <View style={style.formRow}>
              <TextInput
                autoCapitalize="none"
                placeholder="Department"
                onChange={e => this.setState({ department: e.nativeEvent.text })}
                style={[main.textInput, style.input, (this.state.submitted && this.state.department.length < 1) ? { backgroundColor: colors.red } : {}]}
              />
            </View>
            <View style={style.formRow}>
              <TextInput
                autoCapitalize="none"
                placeholder="Level"
                onChange={e => this.setState({ level: e.nativeEvent.text })}
                style={[main.textInput, style.input, (this.state.submitted && this.state.level.length < 1) ? { backgroundColor: colors.red } : {}]}
              />
            </View>
            <View style={style.formRow}>
              <TextInput
                autoCapitalize="none"
                placeholder="Course Name"
                onChange={e => this.setState({ courseName: e.nativeEvent.text })}
                style={[main.textInput, style.input, (this.state.submitted && this.state.courseName.length < 1) ? { backgroundColor: colors.red } : {}]}
              />
            </View>
            <View style={style.formRow}>
              <TextInput
                autoCapitalize="none"
                placeholder="Course Code"
                onChange={e => this.setState({ courseCode: e.nativeEvent.text })}
                style={[main.textInput, style.input, (this.state.submitted && this.state.courseCode.length < 1) ? { backgroundColor: colors.red } : {}]}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={style.bottom}>
          <ButtonInActive text="Cancel" onPress={this.props.cancel} />
          <Button text="Next" onPress={this.submit} />
        </View>
      </View>
    );
  }
}

UploadForm.propTypes = {
  next: PropTypes.func,
  cancel: PropTypes.func,
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBlue
  },
  bottom: {
    width,
    paddingLeft: 25,
    paddingRight: 25,
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  keyboard: {
    flex: 0.8,
    flexDirection: 'column',
    paddingTop: 50
  },
  inner: {
    padding: 20
  },
  title: {
    color: colors.black,
    fontSize: 22
  },
  formRow: {
    marginTop: 30
  },
  input: {
    paddingLeft: 10
  }
});

export default UploadForm;
