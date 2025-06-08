/*********************************************************************************
*  WEB322 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Leo Atienza Student ID: 121941249 Date: 5/19/2025 Section: WEB322 NDDL 
*
********************************************************************************/ 

//  Added a program loop to make debugging easier for me. 

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Main menu function to allow looping
function mainMenu() {
  rl.question('Do you wish to process a File (f) or Directory (d): ', function(choice) {
    const action = choice.trim().toLowerCase();

    if (action === 'f') {
      rl.question('File (or q to quit): ', function(fileName) {
        if (fileName.trim().toLowerCase() === 'q') {
          console.log("Ending program...");
          rl.close();
          return;
        }
        readFile(fileName.trim());
      });

    } else if (action === 'd') {
      rl.question('Directory (or q to quit): ', function(dirName) {
        if (dirName.trim().toLowerCase() === 'q') {
          console.log("Ending program...");
          rl.close();
          return;
        }
        fileList(dirName.trim());
      });

    } else {
      console.log('Invalid Selection');
      mainMenu();
    }
  });
}

// Processing file
function readFile(fileName) {
  if (!fileName.startsWith('data/') && fileName.endsWith('.txt')) {
    fileName = 'data/' + fileName;
  }

  console.log("Processing file: " + fileName);
  console.log(""); 

  fs.readFile(fileName, 'utf8', function(err, data) {
    if (err) {
      console.log(err.message);
      console.log(""); 
      mainMenu();
      return;
    }

    const file_data = data.replace(/\s+/g, ' ').trim();
    const words = file_data.replace(/[^\w\s']/g, '').split(' ').filter(Boolean);

    const charNum = data.length;
    const wordNum = words.length;
    let longestWord = '';
    
    for (let i = 0; i < words.length; i++) {
      if (words[i].length > longestWord.length) {
        longestWord = words[i];
      }
    }

    console.log('Number of Characters (including spaces): ' + charNum);
    console.log('Number of Words: ' + wordNum);
    console.log('Longest Word: ' + longestWord);

    rl.close();
  });
}

// Processing Directory 
function fileList(dirName) {
  console.log("Processing directory: " + dirName);
  console.log(""); 

  fs.readdir(dirName, function(err, files) {
    if (err) {
      console.log(err.message);
      mainMenu();
      return;
    }

    const txtFiles = files.filter(function(file) {
      return file.endsWith('.txt');
    }).sort().reverse();

    console.log('Files (reverse alphabetical order): ' + txtFiles.join(', '));
    rl.close();
  });
}

// Start the program loop
mainMenu();
