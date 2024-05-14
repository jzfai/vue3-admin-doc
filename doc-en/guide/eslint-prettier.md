# Introduction

In this section, we will mainly introduce the use of ESLint and Prettier for code formatting, as well as the use of Husky.

ESLint: responsible for code quality checks, such as disallowing the use of console.log and alert.

Prettier: responsible for code formatting.

Husky: provides lifecycle hooks for Git, allowing us to perform some validation work before committing code.

##### Some may wonder, since ESLint can also be used for code formatting, why do we need Prettier?

The formatted code by ESLint may be different on different systems and editors. This leads to synchronization problems when collaborating on code with different people, resulting in issues such as code conflicts. Prettier can solve this problem.

## Prettier Integration

Related dependencies:

```json
pnpm  add  prettier@2.2.1 -D
```

Explanation of the configuration file .prettierrc:

```javascript
{
    "useTabs": false,
    "tabWidth": 2,
    "printWidth": 120,
    "singleQuote": true,
    "trailingComma": "none",
    "bracketSpacing": true,
    "semi": false,
    "htmlWhitespaceSensitivity": "ignore"
}
```



Prettier ignore file: `.prettierignore`.

```javascript
.history 
.idea
node_modules
# System
.DS_Store
dist
*.local
yarn*
pnpm*
.vscode
```

>Prettier will ignore the directories specified in the configuration above during formatting.

With that, the explanation of Prettier-related configurations is now complete.



#### IntelliJ IDEA or WebStorm: How to set up automatic formatting with Prettier.

VSCode: You can format documents with Prettier by using the shortcut Ctrl+Shift+P, selecting the formatting method.

WebStorm: Go to settings, search for Prettier settings, check "on save", and then save to enable automatic formatting.



Configuring the Prettier configuration file .prettierrc: Explanation

```json
{
    //Using tab indentation, default is false.
    "useTabs": false,
    // Tab indentation size, default is 2.
    "tabWidth": 2,
    // Line length for line breaks, default is 80.
    "printWidth": 120,
    // Strings use single quotes.
    "singleQuote": true,
    // Whether to add a trailing comma after the last element in an object or array (adds a trailing comma in ES5).
    "trailingComma": "none",
    // Whether to print spaces inside brackets in objects. Default is true.
    // true: { foo: bar }
    // false: {foo: bar}
    "bracketSpacing": true,
    // Whether to automatically add a semicolon at the end of each line. false means not to add.
    "semi": false,
    // Resolves an issue in the Prettier formatting plugin where the closing tag ">" moves to the next line after formatting.
    "htmlWhitespaceSensitivity": "ignore"
}
```

>Automatically formatting code using Prettier upon saving in VSCode or WebStorm (please search if you're unsure).
>
>You'll notice a different development experience after configuring this.

Attached: Full configuration and field explanation for Prettier.

```json
// Enable default formatting rules for each language
"[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[less]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},

/* Prettier configuration */
"prettier.printWidth": 100, // Wrap lines that exceed the specified line length
"prettier.tabWidth": 4, // Number of spaces per indentation level
"prettier.useTabs": false, // Use spaces for indentation instead of tabs
"prettier.semi": true, // Add a semicolon at the end of each statement
"prettier.singleQuote": true, // Use single quotes instead of double quotes
"prettier.proseWrap": "preserve", // Default value. Maintain the original line wrapping style because of some wrap-sensitive renderers like GitHub comments, preserving markdown text style.
"prettier.arrowParens": "avoid", // Omit parentheses when possible in arrow function parameters, e.g., (x) => {} => x => {}
"prettier.bracketSpacing": true, // Add spaces between brackets in objects and arrays, e.g., "{ foo: bar }"
"prettier.disableLanguages": ["vue"], // Do not format Vue files; formatting for Vue files is configured separately
"prettier.endOfLine": "auto", // Use the line ending specified in the file, auto-detecting if unspecified
"prettier.eslintIntegration": false, // Do not use eslint formatting rules with Prettier
"prettier.htmlWhitespaceSensitivity": "ignore", // Ignore HTML whitespace sensitivity
"prettier.ignorePath": ".prettierignore", // Specify a file containing patterns of files to ignore for formatting
"prettier.jsxBracketSameLine": false, // Place the closing bracket '>' on a new line in JSX
"prettier.jsxSingleQuote": false, // Use double quotes instead of single quotes in JSX
"prettier.parser": "babylon", // Specify the parser for formatting; default is babylon
"prettier.requireConfig": false, // Do not require a separate prettier config file for formatting
"prettier.stylelintIntegration": false, // Do not use stylelint formatting rules with Prettier
"prettier.trailingComma": "es5", // Add a trailing comma after the last element in arrays and objects (ES5-style)
"prettier.tslintIntegration": false // Do not use tslint formatting rules with Prettier
```

```





## Eslint

[Doc](https://eslint.bootcss.com/docs/user-guide/configuring)

#### Dependencies

```json
"devDependencies": {
        "eslint": "8.18.0",
        "eslint-define-config": "1.5.1",
        "eslint-config-prettier": "8.5.0",
        "eslint-plugin-eslint-comments": "3.2.0",
        "eslint-plugin-import": "2.26.0",
        "eslint-plugin-prettier": "4.1.0",
        "eslint-plugin-vue": "9.1.1",
        "@typescript-eslint/eslint-plugin": "5.30.0",
        "@typescript-eslint/parser": "5.30.0",
        "eslint-plugin-unicorn": "^43.0.2",
        "jsonc-eslint-parser": "^2.1.0",
        "eslint-plugin-jsonc": "^2.3.0",
        "eslint-plugin-markdown": "^3.0.0"
    }
```

>Note: Some ESLint configurations are based on Element Plus.



#### Dependency Explanation

eslint-plugin-import: This plugin aims to support linting for ES2015+ (ES6+) import/export syntax and prevent issues with misspelled file paths and import names. It marks all the advantages of ES2015+ static module syntax in your editor.

eslint-plugin-prettier: Essentially, this tool disables unnecessary ESLint rules and those conflicting with Prettier.

eslint-plugin-vue: Provides rules for validating .vue, .js, .jsx, .ts, and .tsx files.

eslint-define-config: Provides the defineConfig function for .eslintrc.js files.

eslint-plugin-eslint-comments: Additional ESLint rules for ESLint directive comments.

@typescript-eslint/eslint-plugin: An ESLint plugin that provides lint rules for TypeScript codebases.

@typescript-eslint/parser: An ESLint parser that utilizes TypeScript ESTree to allow ESLint to check TypeScript source code.

eslint-plugin-jsonc: ESLint plugin for JSON, JSONC, and JSON5 files.

eslint-plugin-unicorn: Various excellent ESLint rules.



## Configuration Explanation

ESLint main configuration file: .eslintrc.json

```json
{
  "root": true,
  "extends": ["./eslint-config.js"]
}
```

>Note: .eslintrc.json will be automatically detected by ESLint.

ESLint base configuration file: eslint-config.js

```json
const { defineConfig } = require('eslint-define-config')
module.exports = defineConfig({
  // Plugins
  plugins: ['@typescript-eslint', 'prettier', 'unicorn'],
  // Plugin extensions
  extends: [
     /**/
  ],
  overrides: [
    rules: {
        'no-undef': 'off',
         // Disable rule for defining unused variables
        '@typescript-eslint/no-unused-vars': 'off',
         // Disable rule for empty functions
        '@typescript-eslint/no-empty-function': 'off'
      }
    }
  ],
  // ESLint rules configuration
  rules: {
     /**/
  }
})
```

>VSCode or WebStorm settings to automatically format code using Prettier upon saving will provide a different development experience.

## ESLint Ignore File (.eslintignore) Explanation

```json
public
node_modules
.history
.husky
dist
*.d.ts
```

Once ESLint integration is complete, you may encounter an ESLint error **[ERR_REQUIRE_ESM]: require() of ES Module]**. To resolve this, remove `"type": "module"` from package.json, delete the node_modules folder, reinstall dependencies, and consider restarting your editor.

### Integrating lint command into package.json

```json
{
  "scripts": {
     "lint": "eslint --ext .js,.jsx,.vue,.ts,.tsx src --fix"
  }
}
```

## Husky Integration

> Git lifecycle hooks

### Dependency Explanation

```json
pnpm add husky@8.0.1 -D
```

### Configuration Explanation

Add the **prepare** command to the package.json scripts.

```shell
  "scripts": {
    "prepare": "husky install"
  },
```

> Running **npm run prepaer** will generate a .husky directory in the project root.

Create a pre-commit file in the .husky directory.

```shell
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run eslint check before pushing
npm run lint
## Run unit test check before pushing
#npm run test:unit
```

> The pre-commit file will execute before git commit. If there are any errors, it will block the commit, ensuring code validation.

**You can now run git commit -m "Test Husky" and observe the console output.**

## Conclusion

Using ESLint, Prettier, and Husky can greatly improve development efficiency and collaboration standardization. It's recommended for enhancing development practices.
