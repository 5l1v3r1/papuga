import React, { Component } from 'react';

import styles from './Direction.module.css';


export default function Direction({ source, target, onSwap }) {
  return (
    <div className={ styles.container }>
      <div className={ styles.logo }>
        <i style={{ color: '#ff8e9f' }}>PA</i>
        <i style={{ color: '#8ed5ff' }}>PU</i>
        <i style={{ color: '#a3ff8e' }}>GA</i>
      </div>
      <div className={ styles.switcher }>
        <a
          href="#swap"
          className={ styles.swapLink }
          onClick={ onSwap }
        >swap</a>
        { source.toUpperCase() } to { target.toUpperCase() }
      </div>
    </div>
  );
}
