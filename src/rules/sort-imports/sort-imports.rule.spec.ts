import { RuleTester } from 'eslint';
import { sortImportsRule } from './sort-imports.rule';

const tester = new RuleTester({ parserOptions: { ecmaVersion: 2020, sourceType: 'module' } });

const combineCodeArr = (arr: string[]) => arr.join('\n');

tester.run('sort-imports', sortImportsRule, {
  valid: [
    {
      code: combineCodeArr([
        "import A from 'a';",
        "import B, {b} from 'b';",
        "import {c,d,f} from 'c';",
        "import 'Test.scss';",
      ]),
    },
  ],
  invalid: [
    {
      code: combineCodeArr([
        "import React from 'react';",
        "import 'Test.scss';",
        "import {c,d,f} from 'c';",
        "import B, {b} from 'b';",
        "import A from 'a';",
      ]),
      output: combineCodeArr([
        "import React from 'react';",
        "import A from 'a';",
        "import B, {b} from 'b';",
        "import {c,d,f} from 'c';",
        "import 'Test.scss';",
      ]),
      errors: 4,
    },
    {
      code: combineCodeArr([
        "import ReactDOM from 'react-dom';",
        "import React from 'react';",
        "import 'Test.scss';",
        "import {c,d,f} from 'c';",
        "import B, {b, k, g} from 'b';",
        "import A from 'a';",
      ]),
      options: [
        {
          special: ['react', 'react-dom'],
        },
      ],
      output: combineCodeArr([
        "import React from 'react';",
        "import ReactDOM from 'react-dom';",
        "import A from 'a';",
        "import B, {b, k, g} from 'b';",
        "import {c,d,f} from 'c';",
        "import 'Test.scss';",
      ]),
      errors: 6,
    },
    {
      code: combineCodeArr([
        "import ReactDOM from 'react-dom';",
        "import React from 'react';",
        "import 'Test.scss';",
        "import A from 'a';",
        "import B, {b} from 'b';",
      ]),
      options: [
        {
          special: ['react', 'react-dom'],
          order: ['none', 'default', 'special'],
        },
      ],
      output: combineCodeArr([
        "import 'Test.scss';",
        "import A from 'a';",
        "import React from 'react';",
        "import ReactDOM from 'react-dom';",
        "import B, {b} from 'b';",
      ]),
      errors: 4,
    },
    {
      code: combineCodeArr([
        "import 'Test.scss';",
        "import A from 'a';",
        "import * as Kek from 'kek';",
        "import React from 'react';",
      ]),
      output: combineCodeArr([
        "import React from 'react';",
        "import * as Kek from 'kek';",
        "import A from 'a';",
        "import 'Test.scss';",
      ]),
      errors: 4,
    },
    {
      code: combineCodeArr([
        "import 'Test.scss';",
        "import A from 'a';",
        "import * as Kek from 'kek';",
        "import * as Kek2 from 'kek2';",
        "import React from 'react';",
      ]),
      options: [
        {
          order: ['special', 'default', 'none'],
        },
      ],
      output: combineCodeArr([
        "import React from 'react';",
        "import A from 'a';",
        "import 'Test.scss';",
        "import * as Kek from 'kek';",
        "import * as Kek2 from 'kek2';",
      ]),
      errors: 4,
    },
    {
      code: combineCodeArr([
        "import 'Test.scss';",
        "import A from 'a';",
        "import * as Kek from 'kek';",
        "import * as Kek2 from 'kek2';",
        "import React from 'react';",
        "import BModule from '../../../b.module';",
        "import * as helpers from 'src/help/helpers';",
      ]),
      options: [
        {
          special: ['react', '/^src/help/', '/b.module$/'],
          order: ['special', 'default', 'none'],
        },
      ],
      output: combineCodeArr([
        "import React from 'react';",
        "import * as helpers from 'src/help/helpers';",
        "import BModule from '../../../b.module';",
        "import A from 'a';",
        "import 'Test.scss';",
        "import * as Kek from 'kek';",
        "import * as Kek2 from 'kek2';",
      ]),
      errors: 7,
    },
  ],
});
