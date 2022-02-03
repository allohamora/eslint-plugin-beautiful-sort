# eslint-plugin-beautiful-sort

eslint plugin for imports sort by their type

## Example

From:
```js
import './Test.css';
import {a,b,c} from 'a';
import C, {h} from 'j';
import A from 'g';
import * as Meme from 'meme';
import React from 'react';
```
To:
```js
import React from 'react'; // special
import * as Meme from 'meme'; // namespace
import A from 'g'; // default
import C, {h} from 'j'; // defaultObj
import {a,b,c} from 'a'; // obj
import './Test.css'; // none
```

## Plugin tested on 
```json
{
  "node": "^16.13.2",
  "npm": "^8.1.2",
  "eslint": "^8.8.0"
}
```

## Usage

```bash 
npm i -D eslint-plugin-beautiful-sort
```

```json
{
  "plugins": [
    "beautiful-sort"
  ],
  "rules": {
    "beautiful-sort/import": ["error", {
      "special": ["react"],
      "order": ["special", "namespace", "default", "defaultObj", "obj", "none"]
    }]
  }
}
```
