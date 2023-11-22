interface Observer {
    update(event: string, data?: any): void;
  }
  
  interface Subject {
    subscribe(observer: Observer): void;
    unsubscribe(observer: Observer): void;
    notify(event: string, data?: any): void;
  }
  
  class Editor implements Subject {
    private observers: Observer[] = [];
  
    subscribe(observer: Observer): void {
      this.observers.push(observer);
    }
  
    unsubscribe(observer: Observer): void {
      this.observers = this.observers.filter(obs => obs !== observer);
    }
  
    notify(event: string, data?: any): void {
      this.observers.forEach(observer => observer.update(event, data));
    }
  }
  
  class TextEditor extends Editor {
    private lines: string[] = [];
  
    insertLine(lineNumber: number, text: string): void {
      this.lines.splice(lineNumber - 1, 0, text);
      this.notify('lineInserted', { lineNumber, text });
    }
  
    removeLine(lineNumber: number): void {
      this.lines.splice(lineNumber - 1, 1);
      this.notify('lineRemoved', { lineNumber });
    }
  
    saveToFile(): void {
      this.notify('save', { lines: this.lines });
    }
  
    getLines(): string[] {
      return this.lines;
    }
  }
  
  class FileSaver implements Observer {
    update(event: string, data?: any): void {
      if (event === 'save') {
        console.log('Conteúdo do arquivo salvo:');
        const lines = data.lines as string[];
        lines.forEach((line, index) => {
          console.log(`${index + 1}: ${line}`);
        });
      }
    }
  }
  
  const textEditor = new TextEditor();
  const fileSaver = new FileSaver();
  
  textEditor.subscribe(fileSaver);
  textEditor.notify('open');
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  console.log('Digite o texto (Digite "EOF" para salvar e sair):');
  
  rl.on('line', (input: any) => {
    if (input.trim().toLowerCase() === 'eof') {
      textEditor.saveToFile();
      rl.close();
    } else {
      textEditor.insertLine(textEditor.getLines().length + 1, input);
    }
  });