let architect = {
  name: 'Joe',
  age: 34,
  occupation: 'Architect',

  setName: function (newName) {
    this.name = newName;
  },

  setAge: function (newAge) {
    this.age = newAge;
  },

  getName: function () {
    return this.name;
  },

  getAge: function () {
    return this.age;
  },
  
};

//Before
// outputNameDelay: function(){
//     let that = this;
//     setTimeout(function(){
//       console.log(that.name);
//     },1000);
// }
// // ...
// architect.outputNameDelay(); // outputs "Joe"


//Fix 
//The change is adding: architect.outputNameDelay = function () 
//                      ^^^^^^^^^
architect.outputNameDelay = function () {
  let that = this;
  setTimeout(function () {
    console.log(that.name);
  }, 1000);
};

architect.outputNameDelay(); 

console.log(architect.name); // "Joe"
// or
console.log(architect.getName()); // "Joe"