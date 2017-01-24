import React, { Component } from 'react';

import styles from './SearchForm.module.css';
import Suggestions from './Suggestions';
import Direction from './Direction';


export default class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  handleKeyUp(event) {
    const { value } = event.target;
    if (value) {
      this.props.onSearch(value);
    }
  }

  render() {
    const { suggestions, results, direction, onSwap } = this.props;
    const [source, target] = direction;
    return (
      <div className={ styles.container }>
        <Direction
          source={ source }
          target={ target }
          onSwap={ onSwap }
        />
        <input
          className={ styles.searchInput }
          onKeyUp={ this.handleKeyUp }
          placeholder={ 'Type something here' }
        />
        <Suggestions
          suggestions={ suggestions }
          results={ results }
        />
      </div>
    );
  }
}
