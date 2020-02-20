import 'react-native';
import React from 'react';
import App from '../App';
import * as views from '../views'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<App />);
});

it('can render with useState', () => {
  renderer.create(<views.Signin />)
})

