import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image, Text } from 'react-native';
import { main } from 'shared/styles';

class MenuItem extends Component {
  render() {
    const { navigation, label, path } = this.props;
    return (
      <TouchableOpacity
        style={main.nav}
        onPress={() => {
          navigation.toggleDrawer();
          navigation.navigate(path);
        }}
      >
        {path === 'Home' && <Image source={require('../assets/home.png')} style={main.nav_image} />}
        {path === 'SearchTyped' && <Image source={require('../assets/search.png')} style={main.nav_image} />}
        {path === 'Search' && <Image source={require('../assets/stack.png')} style={main.nav_image} />}
        {path === 'TextExtractor' && <Image source={require('../assets/eye.png')} style={main.nav_image} />}
        {path === 'SavedCourses' && <Image source={require('../assets/books.png')} style={main.nav_image} />}
        {path === 'Feedback' && <Image source={require('../assets/bubble.png')} style={main.nav_image} />}
        {path === 'UploadPhotos' && <Image source={require('../assets/file-picture.png')} style={main.nav_image} />}
        <Text style={main.nav_item}>{label}</Text>
      </TouchableOpacity>
    );
  }
}

MenuItem.propTypes = {
  navigation: PropTypes.object,
  label: PropTypes.string,
  path: PropTypes.string,
};

export default MenuItem;
