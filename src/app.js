import React, { Component } from 'react';
import { Provider } from 'react-redux';

import store from 'shared/store';
import Navigation from 'shared/Navigation';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  }
}

export default App;
