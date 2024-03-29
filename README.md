# eslint-plugin-beautiful-sort

[![npm](https://img.shields.io/npm/v/eslint-plugin-beautiful-sort)](https://www.npmjs.com/package/eslint-plugin-beautiful-sort)
![build](https://github.com/allohamora/config-manager/actions/workflows/build.yml/badge.svg)
![test](https://github.com/allohamora/config-manager/actions/workflows/test.yml/badge.svg)
![release](https://github.com/allohamora/config-manager/actions/workflows/release.yml/badge.svg)

eslint plugin to sort imports by their type

## Example

From:

```js
import './styles.css';
import { compose, pipe, curry } from 'src/utils/fp';
import ApiService, { Options } from './api.service';
import Link from '../Link';
import * as utils from 'src/utils';
import React from 'react';
```

To:

```js
import React from 'react'; // special
import * as utils from 'src/utils'; // namespace
import Link from '../Link'; // default
import ApiService, { Options } from './api.service'; // defaultObj
import { compose, pipe, curry } from 'src/utils/fp'; // obj
import './styles.css'; // none
```

Disable sorting:

```js
/* eslint-disable beautiful-sort/import */
import './styles.css';
import { compose, pipe, curry } from 'src/utils/fp';
import ApiService, { Options } from './api.service';
import Link from '../Link';
import * as utils from 'src/utils';
import React from 'react';
```

## Plugin tested on

```json
{
  "node": "^18.14.0",
  "npm": "^9.3.1",
  "eslint": "^8.38.0"
}
```

## Usage

```bash
npm i -D eslint-plugin-beautiful-sort
```

```json
{
  "plugins": ["beautiful-sort"],
  "rules": {
    "beautiful-sort/import": [
      "error",
      {
        "special": ["react"],
        "order": ["special", "namespace", "default", "defaultObj", "obj", "none"]
      }
    ]
  }
}
```

## API

### Special

special is an array of module paths or a string regexp such as `"/^src/utils/string$/"`

### Order

order is an array of [import types](#import-type);

### Import type

import type is a string that specifies one of the following imports:

```js
import React from 'react'; // special
import * as utils from 'src/utils'; // namespace
import Link from '../Link'; // default
import ApiService, { Options } from './api.service'; // defaultObj
import { compose, pipe, curry } from 'src/utils/fp'; // obj
import './styles.css'; // none
```
