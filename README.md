# eslint-plugin-beautiful-sort

eslint plugin for es6 imports sort by order like eslnt/sort-imports with fix option

## Working

From
```js
import './Test.css';
import {a,b,c} from 'a';
import C, {h} from 'j';
import A from 'g';
import * as Meme from 'meme';
import React from 'react';
```
To
```js
import React from 'react'; // special
import * as Meme from 'meme'; // namespace
import A from 'g'; // default
import C, {h} from 'j'; // defaultObj
import {a,b,c} from 'a'; // obj
import './Test.css'; // none
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
      "order": ["special", "namespace", "default", "defaultObj", "obj", "none"]
    }]
  }
}
```
