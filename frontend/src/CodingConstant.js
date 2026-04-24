// ⚠️ NOTE: Judge0 me version use nahi hota, but structure maintain karne ke liye rakh rahe hain
export const LanguageVersion = {
  javascript: "18.15.0",
  python: "3.10.0",
  java: "15.0.2",
  typescript: "5.0.3",
  csharp: "6.12.0",
  php: "8.2.3",
  c: "9.2.0",
  cpp: "9.2.0",
  sql: "3.27.2"
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

  php: `function greet($name) {
  return "Hello, $name!";
}

echo greet("World!");`,

  // ➕ added languages

  c: `#include <stdio.h>
int main() {
  printf("Hello, World!");
  return 0;
}`,

  cpp: `#include <iostream>
using namespace std;

int main() {
  cout << "Hello, World!";
  return 0;
}`,

  sql: `SELECT 'Hello, World!';`
};