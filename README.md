# VSCode C++ Class Completion

C++ class autocompletion suggestions based on custom predefined keymaps for classes.

If you have found an issue or would like to request a new feature, kindly open a new issue. Pull requests are most welcome. **Enjoy!**

## Features

![Demo](https://github.com/DrSwad/vscode-cpp-class-completion/blob/main/assets/demo.gif?raw=true)

1. Get suggestions for long and complex nested class names based on a few typed keys.
2. Customize the keymaps for each class according to your own preference.
3. Support for variable number of template parameters. Just exclude the parameter key from the keymap in settings, and you can then define the number of parameters everytime after pressing that key. For example, if the character `t` is mapped in the following way - `{"t": {"class": "tuple"}}`, then typing `t3iii` will show `tuple<int, int, int>` as a suggestion.
4. Support for numbers as template parameters. For example, in the default settings, typing `ai2` will show `array<int, 2>` as a suggestion.

## Requirements

In order make sure that the class completions are prioritized before all other suggestions, set the `editor.snippetSuggestions` to `top` in your editor's `settings.json` file.

## Extension Settings

You can customize the extension by modifying the following fields in settings:

* `cppClassCompletion.keymaps`: Keymaps for most of the common STL classes are defined by default. But you can have your own through this setting. It needs to be an object with each key being the character that is being mapped. The corresponding value for each key needs to be an object with following fields:
  * class (required): The class name corresponding to that character
  * parameters (optional): Number of parameters for that class (Ignore if the number is not fixed)

  Default:
  ```
  {
    "i": {
      "class": "int",
      "parameters": 0
    },
    "l": {
      "class": "long long",
      "parameters": 0
    },
    "f": {
      "class": "float",
      "parameters": 0
    },
    "d": {
      "class": "double",
      "parameters": 0
    },
    "D": {
      "class": "long double",
      "parameters": 0
    },
    "c": {
      "class": "char",
      "parameters": 0
    },
    "s": {
      "class": "string",
      "parameters": 0
    },
    "p": {
      "class": "pair",
      "parameters": 2
    },
    "t": {
      "class": "tuple"
    },
    "m": {
      "class": "map",
      "parameters": 2
    },
    "u": {
      "class": "unordered_map",
      "parameters": 2
    },
    "a": {
      "class": "array",
      "parameters": 2
    },
    "v": {
      "class": "vector",
      "parameters": 1
    },
    "q": {
      "class": "queue",
      "parameters": 1
    },
    "S": {
      "class": "set",
      "parameters": 1
    },
    "P": {
      "class": "priority_queue",
      "parameters": 1
    },
    "T": {
      "class": "stack",
      "parameters": 1
    },
    "L": {
      "class": "list",
      "parameters": 1
    }
  }
  ```
* `cppClassCompletion.leastNumOfChars`: Least number of characters to be typed before completion list will be shown. Default `1`.
* `cppClassCompletion.addSpaceAfterCompletion`: Add a space after completion. Default `true`.
* `cppClassCompletion.enableInStringAndComment`: Whether to enable completion in string and comment. Default `false`.

## Known Issues

None so far 🤠

## Contributing

1. Clone the repository in your preferred directory: `git clone https://github.com/DrSwad/vscode-cpp-class-completion.git [directory name]`
2. Install the npm dependencies: `yarn` or `npm install`
3. Run the build script in watch mode: `yarn watch` or `npm run watch`

## Release Notes

### 1.0.1

* Fixed a bug in settings configuration.
* Removed an unnecessary warning on settings update.
* Fixed broken demo URL in extension readme in VSCode Marketplace.
* Minor documentation updates.

### 1.0.0

Initial release.

# Acknowledgements

1. Icon made by [https://www.freepik.com](Freepik) from [https://www.flaticon.com/](Flaticon).

2. Inspired from the sublime text extension [https://github.com/Jatana/FastOlympicCoding](FastOlympicCoding) by Jatana.

-----------------------------------------------------------------------------------------------------------