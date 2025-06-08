class Architect {
  #name;
  #age;
  #occupation = 'architect'; // default value of "architect" for occupation

  constructor(setName = '', setAge = 0) { // handle missing parameters with '' and 0
    this.#name = setName;
    this.#age = setAge;
  }

  #privateMethod() {
    console.log("I'm a private method");
  }

//OLD WAY 
//   setName(newName) {
//     this.name = newName;
//   }

//   setAge(newAge) {
//     this.age = newAge;
//   }

//   getName() {
//     return this.name;
//   }

//   getAge() {
//     return this.age;
//   }

    set name (newName) {
        this.#name = newName; //The private has the public members. It updates the values inside the private variables 
    }

    set age (newAge) {
        this.#age = newAge;
    }

    get name() {
        return this.#name;
    }

    get age() {
        return this.#age;
    }
}

// define new "architect objects using the "new" keyword with the "architect" class

let architect1 = new Architect('Joe', 34);
console.log(architect1.name); // Joe

let architect2 = new Architect('Mary', 49);

// samples of accessing properties and methods on both objects

//console.log(architect1.name); // "Joe"

//console.log(architect1.getName()); // "Joe"
//console.log(architect2.getName()); // "Mary"

//Test for using private method
//console.log(architect1.#name); // SyntaxError
