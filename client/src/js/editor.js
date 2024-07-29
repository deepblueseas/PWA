import { getDb, putDb } from './database';
import { header } from './header';

export default class App {
  constructor() {
    this.editor = null; // Initialize editor property

    this.initEditor(); // Initialize CodeMirror editor

    // Load editor content after initialization
    this.loadEditorContent();

    // Save content to localStorage on change
    this.editor.on('change', () => {
      localStorage.setItem('content', this.editor.getValue());
    });

    // Save content to IndexedDB on blur
    this.editor.on('blur', () => {
      console.log('The editor has lost focus');
      putDb(this.editor.getValue());
    });
  }

  initEditor() {
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    this.editor = CodeMirror(document.querySelector('#main'), {
      value: '', // Initialize with empty value
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });
  }

  async loadEditorContent() {
    try {
      const data = await getDb();
      console.info('Loaded data from IndexedDB:', data);

      if (!data || data.length === 0 || !data[0].content) {
        throw new Error('No valid content found in IndexedDB.');
      }

      // Join content entries with new lines and set in CodeMirror
      const content = data.map(entry => entry.content).join('\n');
      this.editor.setValue(content);
    } catch (error) {
      console.error('Error loading content:', error);

      // Fallback to localStorage or header if IndexedDB fails or returns unexpected data
      const fallbackContent = localStorage.getItem('content') || header;
      this.editor.setValue(fallbackContent);
    }
  }
}