import React, { Component } from 'react';

import styles from './Suggestions.module.css';

export function Line({ suggestion, translation }) {
  return (
    <li className={ styles.line }>
      { suggestion }
      { translation && (
        <span className={ styles.translation }>
          { translation }
        </span>
      )}
    </li>
  );
}

export default function Suggestions({ suggestions, results }) {
  return (
    <ul className={ styles.container }>
      { suggestions.map((suggestion, index) => (
        <Line key={ index }
          translation={ results[suggestion] }
          suggestion={ suggestion }
        />
      )) }
    </ul>
  );
}
