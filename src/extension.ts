import * as vscode from 'vscode';
import ClassCompletionItemProvider from './ClassCompletionItemProvider';

export function activate(context: vscode.ExtensionContext) {
  const cppDocSelector = [{ language: 'cpp', scheme: 'file' }, { language: 'cpp', scheme: 'untitled' }];
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(cppDocSelector, new ClassCompletionItemProvider())
  );

  // Feature: enable completion in string and comment
  if (vscode.workspace.getConfiguration('cppClassCompletion').get<boolean>('enableInStringAndComment')) {
    // Make sure `quickSuggestions` for string/comment is enabled
    const cfgQuickSuggestions = vscode.workspace.getConfiguration('editor').get<{other: boolean, comments: boolean, strings: boolean}>('quickSuggestions');
    const cppObject = vscode.workspace.getConfiguration("[cpp]");
    const somehowSet: boolean = (cfgQuickSuggestions?.['comments'] && cfgQuickSuggestions?.['strings'])
      || cppObject?.['editor.quickSuggestions'];
    if (!somehowSet && !context.globalState.get<boolean>('cppClassCompl.enableInStringAndComment.userDisabled', false)) {
      const option1 = 'Do it';
      const option2 = 'Disable';
      const option3 = 'Remind me later';
      vscode.window.showInformationMessage(
        'To enable class completion for inside comments and strings, we need to enable `quickSuggestions` for string/comment in user settings.',
        option1,
        option2,
        option3
      ).then(option => {
        switch (option) {
          case option1:
            vscode.workspace.getConfiguration('editor').update('quickSuggestions', {
              "other": true,
              "comments": true,
              "strings": true
            }, vscode.ConfigurationTarget.Global);
            break;
          case option2:
            context.globalState.update('cppClassCompl.enableInStringAndComment.userDisabled', true);
            vscode.workspace.getConfiguration('cppClassCompletion').update('enableInStringAndComment', false, vscode.ConfigurationTarget.Global);
            break;
          case option3:
            break;
        }
      });
    }
  }
}

export function deactivate() {}
