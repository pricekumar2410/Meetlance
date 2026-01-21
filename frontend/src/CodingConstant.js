export const LanguageVersion = {
    javascript: "18.15.0",
    python: "3.10.0",
    java: "15.0.2",
    typescript: "5.0.3",
    csharp: "6.12.0",
    php: "8.2.3",
};

export const codeSnippets = {
    javascript: `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World!"));`,

    python: `def greet(name):
    return f"Hello, {name}!"

print(greet("Coders"))`,

    java: `class Main {
  public static void main(String[] args) {
    System.out.println("Hello, Programmer!");
  }
}`,

    typescript: `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("Developer!"));`,

    csharp: `using System;

class Program {
  static void Main() {
    Console.WriteLine("Welcome, Coding World!");
  }
}`,

    php: `<?php
function greet($name) {
  return "Hello, $name!";
}

echo greet("Worlds!");
?>`,
};
