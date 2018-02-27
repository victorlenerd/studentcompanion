import React, { Component } from 'react';
import { View, Text, StatusBar, ScrollView, Picker, Alert, StyleSheet } from 'react-native';

import { main, colors } from 'shared/styles';
import { Button } from 'components/buttons';
import Loader from 'components/loader';

import users from 'containers/users';
import universities from 'containers/universities';
import faculties from 'containers/faculties';
import departments from 'containers/departments';
import levels from 'containers/levels';

@users
@universities
@faculties
@departments
@levels
class AcademicInfo extends Component {
  state = {
    universityId: null,
    facultyId: null,
    departmentId: null,
    levelId: null,
    universities: [],
    faculties: [],
    departments: [],
    levels: []
  }

  componentWillMount() {
    const { getUniversities } = this.props;
    getUniversities();
  }

  componentWillReceiveProps(nextProps) {
    const { universities, faculties, departments, levels } = nextProps;

    this.setState({
      universities: [{ $id: null, name: '' }].concat(universities),
      faculties: [{ $id: null, name: '' }].concat(faculties),
      departments: [{ $id: null, name: '' }].concat(departments),
      levels: [{ $id: null, name: '' }].concat(levels)
    });
  }

  skip = () => {
    const { navigation: { replace } } = this.props;
    return replace('Main');
  }

  done = async () => {
    const { navigation: { replace }, setAcademicInfo, currentUser: { $id } } = this.props;
    const { universityId, facultyId, departmentId, levelId } = this.state;
    if (universityId !== null && facultyId && departmentId && levelId) {
      await setAcademicInfo($id, { universityId, facultyId, departmentId, levelId });
      return replace('Main');
    }

    Alert.alert('Error', 'You have to select all the fields.', [{ text: 'Cancel', style: 'cancel' }]);
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
            <View style={{ marginTop: 50, marginBottom: 100 }}>
              <Text style={{ color: colors.white, fontSize: 32, textAlign: 'center', fontWeight: '200' }}>
                Academic Info.
              </Text>
              <Text style={{ color: colors.white, fontSize: 18, textAlign: 'center', marginBottom: 95, marginTop: 25 }}>
                Please set your academic information, so you can get courses.
              </Text>
              <Button
                onPress={this.skip}
                text="Skip For Now"
              />
              <View>
                <Text style={style.pickerLabels}>Choose University</Text>
                <Picker
                  style={style.picker}
                  selectedValue={this.state.universityId}
                  onValueChange={val => {
                    if (val !== null) {
                      this.setState({ universityId: val });
                      this.props.getFacultiesByUniversityId(val);
                    }
                  }}
                >
                  {this.state.universities.map(university => {
                    return (
                      <Picker.Item style={{ color: colors.white }} key={university.$id} label={university.name} value={university.$id} />
                    );
                  })}
                </Picker>
              </View>
              <View>
                <Text style={style.pickerLabels}>Choose Faculty</Text>
                <Picker
                  style={style.picker}
                  selectedValue={this.state.facultyId}
                  onValueChange={val => {
                    if (val !== null) {
                    this.setState({ facultyId: val });
                    this.props.getDepartmentsByFacultyId(val);
                   }
                  }}
                >
                  {this.state.faculties.map(faculty => {
                    return (
                      <Picker.Item style={{ color: colors.white }} key={faculty.$id} label={faculty.name} value={faculty.$id} />
                    );
                  })}
                </Picker>
              </View>
              <View>
                <Text style={style.pickerLabels}>Choose Department</Text>
                <Picker
                  style={style.picker}
                  selectedValue={this.state.departmentId}
                  onValueChange={val => {
                    if (val !== null) {
                     this.setState({ departmentId: val });
                     this.props.getLevelsByDepartmentId(val);
                    }
                  }}
                >
                  {this.state.departments.map(department => {
                    return (
                      <Picker.Item style={{ color: colors.white }} key={department.$id} label={department.name} value={department.$id} />
                    );
                  })}
                </Picker>
              </View>
              <View>
                <Text style={style.pickerLabels}>Choose Level</Text>
                <Picker
                  style={style.picker}
                  selectedValue={this.state.levelId}
                  onValueChange={val => {
                    if (val !== null) {
                     this.setState({ levelId: val });
                    }
                  }}
                >
                  {this.state.levels.map(level => {
                    return (
                      <Picker.Item style={{ color: colors.white }} key={level.$id} label={level.name} value={level.$id} />
                    );
                  })}
                </Picker>
              </View>
              <Button
                onPress={this.done}
                text="DONE"
              />
            </View>
          </View>
        </View>
        <Loader />
      </ScrollView>
    );
  }
}

const style = StyleSheet.create({
  picker: {
    color: '#fff',
    marginBottom: 15
  },
  pickerLabels: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '200'
  }
});

export default AcademicInfo;
