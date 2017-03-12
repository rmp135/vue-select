# vue-select

## Selecting made simple

[![Build Status](https://travis-ci.org/rmp135/vue-select.svg?branch=master)](https://travis-ci.org/rmp135/vue-select)

Provides a simple Vue component for providing suggestions from a dropdown.

### [Demo](https://rmp135.github.io/vue-select/)

### Installing

Install via npm

`npm install -d @rmp135/vue-select`

Or via Yarn

`yarn add dev @rmp135/vue-select`

### Usage

Add as a Vue component.

```javascript
require VueSelect from '@rmp135/vue-select'

...
data: {
  value: 'item2',
  suggestions: ['item1', 'item2', 'item3']
},
components: {
  VueSelect
}
...
```

Add to the template and provide the relevant props.
```html
<vue-select :suggestions="suggestions" v-model="value"></vue-select>
````
