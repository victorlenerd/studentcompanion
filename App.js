import React, { Component } from 'react';
import { navigator, registerComponents } from './shared/Navigation';

export default ()=> {
    registerComponents();
    navigator.welcome();
}