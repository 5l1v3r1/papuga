import React, { Component } from 'react';
import { debounce, uniq } from 'lodash';
import fetch from 'isomorphic-fetch';

import Layout from '../components/Layout.js';
import SearchForm from '../components/SearchForm.js';

const store = {
  trie: {
    en: {},
    pl: {},
  },
};

function buildTrie(url, prefix) {
  fetch(
    url
  ).then(
    response => response.text()
  ).then(
    text => {
      text.split('\n').forEach(
        word => {
          let cursor = store.trie[prefix];
          Array.prototype.forEach.call(
            word.toLowerCase(),
            char => {
              if (!cursor.hasOwnProperty(char)) {
                cursor[char] = {};
              }
              cursor = cursor[char];
            }
          );
        }
      )
    }
  );
}

function suggestions(cursor, word, count = 0) {
  if (count >= 30) {
    return [];
  }

  let stack = [];

  for (var key in cursor) {
    stack = stack.concat(
      word + key,
      suggestions(cursor[key], word + key, stack.length) 
    )
  }

  return stack;
}


export default class Dictionary extends Component {
  constructor(props) {
    super(props);

    this.handleSwap = this.handleSwap.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.doSearchRequest = debounce(this.doSearchRequest, 300, {
      trailing: true
    });

    this.state = {
      direction: ['en', 'pl'],
      suggestions: [],
      results: {},
    };
  }

  componentDidMount() {
    buildTrie('dist/words-pl.txt', 'pl');
    buildTrie('dist/words-pl.txt', 'en');
  }

  doSearchRequest() {
    const key = 'AIzaSyCFxWDzf1o3au7ciaDxeeUn9zeJb5InpQ0';
    const [source, target] = this.state.direction;
    const base = 'https://www.googleapis.com/language/translate/v2';
    const { suggestions } = this.state;
    const value = suggestions.join(', ');

    fetch(
      `${base}?q=${value}&target=${target}&source=${source}&key=${key}`
    ).then(
      response => response.json()
    ).then(
      ({ data: { translations }}) => {
        const [first] = translations;
        const results = {};

        first.translatedText.split(', ').map(
          (translated, index) => {
            results[suggestions[index]] = translated;
          }
        )

        this.setState({
          results: {
            ...this.state.results,
            ...results,
          }
        });
      }
    );
  }

  handleSwap() {
    const [source, target] = this.state.direction;
    this.setState({
      direction: [target, source],
    });
  }

  handleSearch(value) {
    const [language] = this.state.direction;
    let cursor = store.trie[language];

    Array.prototype.forEach.call(value, char => (
      cursor = cursor ? cursor[char] : null
    ));

    this.setState({
      suggestions: uniq([
        value,
        ...suggestions(cursor, value),
      ].map(
        word => word.trim()
      )),
      keyword: value,
    });

    this.doSearchRequest(value);
  }

  render() {
    return (
      <Layout style={{ backgroundColor: this.state.keyword }}>
        <SearchForm
          direction={ this.state.direction }
          onSearch={ this.handleSearch }
          suggestions={ this.state.suggestions }
          results={ this.state.results }
          onSwap={ this.handleSwap }
        />
      </Layout>
    );
  }
}
