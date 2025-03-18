/* Aula 25/02/2025 - Introdução ao TypeScript - Código Completo e Otimizado */

// 1. Definindo tipos básicos e variáveis
let message: string = 'Hello, TypeScript!';
let age: number = 25;
let isStudent: boolean = true;
let numbers: number[] = [10, 20, 30, 40, 50];
console.log(message, age, isStudent, numbers);

// 2. Função simples com tipos
function greet(name: string): string {
  return `Olá, ${name}! Seja bem-vindo!`;
}
console.log(greet('Rodrigo'));

// 3. Interface e objeto
interface Person {
  name: string;
  age: number;
  profession: string;
}

const person: Person = {
  name: 'Alice',
  age: 30,
  profession: 'Desenvolvedora',
};
console.log('Pessoa:', person);

// 4. Função com tipagem complexa
function calculateArea(width: number, height: number): number {
  return width * height;
}
console.log('Área:', calculateArea(5, 10));

// 5. Union types e type alias
type ID = number | string;
let userId: ID = 123;
userId = 'ABC123';
console.log('User ID:', userId);

// 6. Enum para cargos
enum Role {
  Admin = 'Admin',
  User = 'User',
  Guest = 'Guest',
}

const currentRole: Role = Role.Admin;
console.log('Role atual:', currentRole);

// 7. Função que retorna void
function logMessage(message: string): void {
  console.log(`Log: ${message}`);
}
logMessage('Teste de log');

// 8. Manipulação de arrays
const fruits: string[] = ['Maçã', 'Banana', 'Laranja'];
fruits.push('Abacaxi');
fruits.forEach((fruit) => console.log('Fruta:', fruit));

// 9. Tuplas
let personInfo: [string, number];
personInfo = ['Carlos', 35];
console.log('Informação da pessoa:', personInfo);

// 10. Função com parâmetros opcionais
function showDetails(name: string, age?: number): string {
  return age ? `${name} tem ${age} anos.` : `${name} não informou a idade.`;
}
console.log(showDetails('João'));
console.log(showDetails('Maria', 28));
