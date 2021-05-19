import * as vscode from 'vscode';
import { Range, Position } from 'vscode';

interface MapData {
  class: string;
  parameters?: number;
}
interface Keymap {
  [key: string]: MapData;
}

const defaultKeymaps : Keymap = {
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
};

export default class ClassCompletionItemProvider implements vscode.CompletionItemProvider {
  constructor() { }

  public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position):
    vscode.CompletionItem[] | Thenable<vscode.CompletionItem[]> {
    const lineText = document.lineAt(position.line).text;
    const textBefore = lineText.substring(0, position.character);
    const docTextBefore = document.getText(new Range(new Position(0, 0), position));
    const currentWord = textBefore.replace(/\W/g, ' ').split(/[\s]+/).pop();
    if (currentWord === undefined || currentWord === "") {
      return [];
    }

    const leastNumOfChars = vscode.workspace.getConfiguration('cppClassCompletion').get<number>('leastNumOfChars') || 0;
    if (currentWord.length < leastNumOfChars) { return []; }

    const enableInStringAndComment = vscode.workspace.getConfiguration('cppClassCompletion').get<boolean>('enableInStringAndComment');

    // Multiline comment
    if (/\/\*((?!\*\/)[\W\w])*$/.test(docTextBefore) &&
      !enableInStringAndComment) {
      return [];
    }

    // Inline comment or string
    const tmpTextBefore = textBefore.replace(/(?<!\\)('|").*?(?<!\\)\1/g, '');
    if ((
      /\/{2,}/.test(tmpTextBefore) // inline comment
      ||
      (
        /(?<!\\)['"]/.test(tmpTextBefore) // inline string
        && !/(import)/.test(tmpTextBefore.split(/['"]/)[0]) // reject if in import clauses
      )
    ) && !enableInStringAndComment) {
      return [];
    }

    const followingChar = lineText.charAt(position.character);
    const addSpaceAfterCompletion = vscode.workspace.getConfiguration('cppClassCompletion').get<boolean>('addSpaceAfterCompletion') && !followingChar.match(/[ ]/);

    return this.completeByCurrentWord(currentWord, addSpaceAfterCompletion);
  }

  private isDigit(character: string) {
    return !Number.isNaN(parseInt(character, 10));
  }

  private parseNumberFromIndex(index: number, currentWord: string) {
    let number = 0;
    while (index < currentWord.length) {
      const c = currentWord.charAt(index);
      if (!this.isDigit(c)) { break; }
      index++;
      number = 10 * number + parseInt(c, 10);
    }
    return {index, number};
  }

  private completeByCurrentWord(currentWord: string, addSpaceAfterCompletion = false): Thenable<vscode.CompletionItem[]> {
    const keymaps : Keymap = vscode.workspace.getConfiguration('cppClassCompletion').get<Keymap>('keymaps') || defaultKeymaps;
    const parametersStack : number[] = [];
    let completion = "";

    for (let atIndex = 0; atIndex < currentWord.length; ) {
      const c = currentWord.charAt(atIndex);

      let className, parameters;

      if (keymaps.hasOwnProperty(c)) {
        className = keymaps[c].class;
        parameters = keymaps[c].parameters;
        atIndex++;

        if (parameters === undefined) {
          const {index: nextIndex, number} = this.parseNumberFromIndex(atIndex, currentWord);
          if (nextIndex > atIndex) {
            atIndex = nextIndex;
            parameters = number;
          }
          else { completion = ""; break; };
        }
      }
      else if (atIndex > 0) {
        const {index: nextIndex, number} = this.parseNumberFromIndex(atIndex, currentWord);
        if (nextIndex > atIndex) {
          atIndex = nextIndex;
          className = number.toString(10);
          parameters = 0;
        }
        else { completion = ""; break; }
      }
      else { completion = ""; break; }

      // console.log(className, parameters, completion, atIndex);

      completion += className;
      if (parameters > 0) {
        completion += "<";
        parametersStack.push(parameters);
      }
      else {
        let length = parametersStack.length;
        while (length > 0 && parametersStack[length - 1] === 1) {
          completion += ">";
          parametersStack.pop();
          length--;
        }
        if (length > 0) {
          parametersStack[length - 1]--;
          completion += ", ";
        }
      }

      if (atIndex < currentWord.length) {
        if (parametersStack.length === 0) { completion = ""; break; }
      }
      else {
        if (parametersStack.length !== 0) { completion = ""; break; }
      }
    }

    const completions: vscode.CompletionItem[] = [];
    if (completion !== "") {
      const completionItem = new vscode.CompletionItem(completion, vscode.CompletionItemKind.Snippet);
      completionItem.filterText = currentWord;
      completions.push(completionItem);
    }
    if (addSpaceAfterCompletion) {
      completions.forEach(item => item.insertText = item.label + ' ');
    }
    return new Promise((resolve) => resolve(completions));
  }
}