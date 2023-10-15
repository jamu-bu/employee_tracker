const inquirer = require('inquirer');
const fs = require('fs');

inquirer
  .prompt([
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'starterPrompt',
        choices: 
        [
            'View all departments', 
            'View all roles',
            'View all employees', 
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role'
        ]
    }
  ])
  .then((data) => {
    const filename = `${data.name.toLowerCase().split(' ').join('')}.json`;

    fs.writeFile(filename, JSON.stringify(data, null, '\t'), (err) =>
      err ? console.log(err) : console.log('Success!')
    );
  });
