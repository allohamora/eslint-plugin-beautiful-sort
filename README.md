# eslint-plugin-beautiful-sort

eslint plugin for es6 imports sort by order like eslnt/sort-imports with fix option

## Working

From
```js
import './Test.css';
import {a,b,c} from 'a';
import A from 'g';
import React from 'react';
```
To
```js
import React from 'react';
import A from 'g';
import {a,b,c} from 'a';
import './Test.css';
```

## Usage

`npm i -D eslint-plugin-beautiful-sort`

```json
{
  "plugins": [
    "beautiful-sort"
  ],
  "rules": {
    "beautiful-sort/import": [2, {
      "special": ["react"], 
      "order": ["special", "default", "defaultObj", "obj", "none"]
    }]
  }
}
```
