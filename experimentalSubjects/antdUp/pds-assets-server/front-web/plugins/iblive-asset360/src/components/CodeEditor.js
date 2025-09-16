/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2023-11-22 10:25:56
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-17 15:50:23
 * @Description: 代码编辑器，目前引用支持语言java、javascript、json、Sql、log、python
 */

import { useUpdateEffect } from 'ahooks';
import * as monaco from 'monaco-editor';
import { language as javaLanguage } from 'monaco-editor/esm/vs/basic-languages/java/java.js';
import { language as pythonLanguage } from 'monaco-editor/esm/vs/basic-languages/python/python.js';
import { language as sqlLanguage } from 'monaco-editor/esm/vs/basic-languages/sql/sql.js';
import PropTypes from 'prop-types';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

/**
 * @description: 获取自动补全配置内容
 * @param {*} keys
 * @param {*} language
 * @return {*}
 */
const getHinits = (keys, language) => {
  const suggestions = [];
  keys.forEach((v) => {
    language[v].forEach((item) => {
      suggestions.push({
        label: item,
        kind: monaco.languages.CompletionItemKind.Interface,
        insertText: item,
      });
    });
  });
  return suggestions;
};
/**
 * @description: 全局monaco editor配置，有且必定只能配置一次
 * @return {*}
 */
export const initGlobalEditorConfig = () => {
  // 自定义主题
  monaco.editor.defineTheme('myTheme', {
    base: 'vs',
    inherit: true,
    rules: [
      { background: '#f0f0f0' },
      { token: 'custom-info', foreground: '259253' },
      { token: 'custom-error', foreground: 'ff0000' },
      { token: 'custom-warning', foreground: 'FFA500' },
    ],
    colors: {
      'editorGutter.background': '#f0f0f0',
      'editor.lineHighlightBorder': '#0000FF20',
      'editor.lineHighlightBackground': '#0000FF20',
    },
  });
  // 自定义语言-日志
  monaco.languages.register({ id: 'log' });
  monaco.languages.setMonarchTokensProvider('log', {
    tokenizer: {
      root: [
        [/\[ERROR\]/, { token: 'custom-error' }],
        [/\[INFO\]/, { token: 'custom-info' }],
        [/\[WARNING\]/, { token: 'custom-warning' }],
      ],
    },
  });
  // java 语法补充
  monaco.languages.registerCompletionItemProvider('java', {
    provideCompletionItems() {
      const suggestions = getHinits(['keywords', 'operators'], javaLanguage);
      suggestions.push({
        label: 'Class',
        kind: monaco.languages.CompletionItemKind.Class,
        insertText: 'Class',
      });
      suggestions.push({
        label: 'Interface',
        kind: monaco.languages.CompletionItemKind.Interface,
        insertText: 'Interface',
      });
      return { suggestions };
    },
  });
  // sql 语法补充
  monaco.languages.registerCompletionItemProvider('sql', {
    provideCompletionItems() {
      const suggestions = getHinits(
        ['keywords', 'operators', 'builtinFunctions', 'builtinVariables'],
        sqlLanguage,
      );
      return { suggestions };
    },
  });
  // python 语法补充
  monaco.languages.registerCompletionItemProvider('python', {
    provideCompletionItems() {
      const suggestions = getHinits(['keywords'], pythonLanguage);
      return { suggestions };
    },
  });
};

// 代码编辑器，目前引用支持语言java、javascript、json
const CodeEditor = forwardRef(function _JavaEditor(
  { language, height = '100%', width = '100%', defaultValue, ...config },
  ref,
) {
  const containerRef = useRef();
  const editorRef = useRef();

  useEffect(() => {
    editorRef.current = monaco.editor.create(containerRef.current, {
      value: `${defaultValue ?? ''}`,
      language,
      contextmenu: false,
      automaticLayout: true,
      theme: 'myTheme',
      glyphMargin: false,
      ...config,
    });
    const messageContribution = editorRef.current.getContribution(
      'editor.contrib.messageController',
    );
    editorRef.current.onDidAttemptReadOnlyEdit(() => {
      messageContribution.showMessage(
        '只读模式不可编辑',
        editorRef.current.getPosition(),
      );
    });
    return () => {
      editorRef.current && editorRef.current.dispose();
    };
  }, []);

  useUpdateEffect(() => {
    // 实例化后的语言类型切换
    monaco.editor.setModelLanguage(editorRef.current.getModel(), language);
  }, [language]);

  const getCode = () =>
    editorRef.current ? editorRef.current.getValue() : defaultValue;
  const setCode = (code) => {
    editorRef.current && editorRef.current.setValue(`${code || ''}`);
  };
  // 向父组件暴露获取和设置代码的方法
  useImperativeHandle(ref, () => ({
    getCode,
    setCode,
    getEditor: () => editorRef.current,
  }));
  return <div style={{ height, width }} ref={containerRef} />;
});

CodeEditor.propTypes = {
  language: PropTypes.oneOf(['json', 'javascript', 'java', 'sql', 'log']),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.string,
};

export default CodeEditor;
