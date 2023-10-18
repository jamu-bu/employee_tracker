const inquirer = require('inquirer');
const fs = require('fs');
const db = require("../db/connection");
const cTable = require('console.table');

const runInquirer = () => {
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
                'Add employee',
                'Update an employee role',
                'View employees by manager',
                'View employee by department',
                'Remove a department',
                'Remove a role',
                'Remove an employee'

            ]
        }
    ])
    .then((answers) => {
        const nextPrompt = answers.starterPrompt; 
        if (nextPrompt === 'View all departments') {
            viewDepartments();
        };
        if (nextPrompt === 'View all roles') {
            viewRoles();
        }
        if (nextPrompt === 'View all employees') {
            viewEmployees();
        }
        if (nextPrompt === 'Add a department') {
            addDepartment();
        }
        if (nextPrompt === 'Add a role') {
            addRole();
        }
        if (nextPrompt === 'Add an employee') {
            addEmployee();
        }
        if (nextPrompt === 'Update an employee role') {
            updateEmployeeRole()
        }
        if (nextPrompt === 'View employees by manager') {
            viewByManager();
        }
        if (nextPrompt === 'View employees by department') {
            viewbyDepartment();
        }
        if (nextPrompt === 'Remove a department') {
            removeDepartment();
        }
        if (nextPrompt === 'Remove a role') {
            removeRole();
        }
        if (nextPrompt === 'Remove an employee') {
            removeEmployee();
        }
        if (nextPrompt ==='Exit') {
            process.exit();
            };
    });
};
    const viewDepartments = () => {
        const sql = `SELECT * FROM departments`;
        db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
            console.table(rows);
            return runInquirer();
        });
        };
    
    const viewRoles = () => {
        const sql = `SELECT roles.id,
                            roles.title,
                            roles.salary,
                            departments.name AS department
                    FROM roles
                    LEFT JOIN departments ON roles.department_id = departments.id`;
        db.query(sql, (err, rows) => {
            if (err) {
            throw err;
        }
        console.table(rows);
        return runInquirer();
        });
    };
    const viewEmployees = () => {
        const sql = `SELECT employees.id,
                            employees.firstName,
                            employees.lastName,
                            roles.title AS title,
                            roles.salary AS salary,
                            departments.name AS department,
                            CONCAT (manager.firstName," ", managerlastName) AS manager
                    FROM employees
                    LEFT JOIN roles ON employees.role_id = roles.id
                    LEFT JOIN departments ON roles.department_id = departments.id
                    LEFT JOIN employees manager ON employees.manager_id = manager.id`;
        db.query(sql, (err, rows) => {
            if (err) {
                throw err;
            }
            console.table(rows);
            return runInquirer();
        });
    };

    const addDepartment = () => {
        return inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "Enter new Department name",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    }else {
                        console.log("Must enter a department name");
                        return false;
                    };
                }

            }
        ])
        .then(answer => {
            const sql = `INSERT INTO departments (name)
                VALUES (?)`;
            const params = answer.name;
            db.query(sql, params, (err) => {
                if (err) {
                    throw err;
                }
                console.log('New Department created');
                return viewDepartments();
            });
        });
    };

    const addRole = () => {
        return inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "What role would you like to create?",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log("Must enter Role name");
                        return false;
                    };
                }
            },
            {
                type: "input",
                name: "salary",
                message: "What salary does this role have?",
                validate: salaryInput => {
                    if (salaryInput) {
                        return true;
                    } else {
                        console.log("Must enter salary");
                        return false;
                    };
                }
            }
        ])
        .then (answer => {
            const params = [answer.title, answer.salary];
            const sql = `SELECT * FROM departments`;
            db.query(sql, (err, rows) => {
                if (err) {
                    throw err;
                }
                const departments = rows.map(({name, id}) => ({name: name, value: id}));
                inquirer.prompt([
                    {
                        type: "list",
                        name: "department",
                        message: "What department is this role in?",
                        choices: departments
                    }
                ])
                .then(departmentAnswer => {
                    const department = departmentAnswer.department;
                    params.push(department);
                    const sql = `INSERT INTO roles (title, salary, department_id)
                        VALUES (?, ?, ?)`;
                    db.query(sql, params, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log("New role added");
                        return viewRoles();
                    });
                });
            });
        });
    };
    const addEmployee = () => {
        return inquirer.prompt([
            {
                type: "input",
                name: "firstName",
                message: "Please enter employee first name:",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                    console.log("Please enter name");
                    return false; 
                    };
                }
                },
            {
                type: "input",
                name: "lastName",
                messaage:"Please enter employee last name:",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                    console.log("Please enter last name");
                    return false;    
                        };
                    }
                }
            ])
            .then (answer => {
                const params = [answer.firstName, answer.lastName];
                const sql = `SELECT * FROM roles`;
                db.query(sql, (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    const roles = rows.map(({title, id}) => ({name: title, value: id}));
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "role",
                            message: "What is the employee's role?",
                            choices: roles
                        }
                    ])
                    .then(roleAnswer => {
                        const role = roleAnswer.role;
                        params.push(role);
                        const sql = `SELECT * FROM employees`;
                        db.query(sql, (err, rows) => {
                            if (err) {
                                throw err;
                            }
                            const managers = rows.map(({firstName, lastName, id})=> ({name: `${firstName} ${lastName}`, value: id}));
                            managers.push({name: "No manager", value: null});
                            inquirer.prompt([
                                {
                                    type: "list",
                                    name: "manager",
                                    message: "Enter employee's manager:",
                                    choices: managers
                                }
                            ])
                            .then(managerAnswer => {
                                const manager = managerAnswer.manager;
                                params.push(manager);
                                const sql = `INSERT INTO employees (firstName, lastName, role_id, manager_id)
                                    VALUES (?,?,?,?)`;
                                db.query(sql, params, (err) => {
                                    if (err) {
                                        throw err;
                                    }
                                    console.log("Added employee");
                                    return viewEmployees(); 
                                });
                            });
                        });
                    });
                });
            });
        };
    const updateEmployeeRole= () => {
        const sql = `SELECT firstName, lastName, id FROM employees`
        db.query(sql, (err, rows) => {
            if (err) {
                throw err;
            }
            const employees = rows.map(({firstName, lastName, id}) => ({name: `${firstName} ${lastName}`, value: id}));
            inquirer.prompt([
                {
                    type: "list",
                    name: "employee",
                    message: "Update employee role?",
                    choices: employees
                }
            ])
            .then(employeeAnswer => {
                const employee = employeeAnswer.employee;
                const params = [employee];
                const sql = `SELECT title, id FROM roles`;
                db.query(sql, (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    const roles = rows.map (({title, id}) => ({name: title, value: id}));
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "role",
                            message: "Enter new role for employee:",
                            choices: roles
                        }
                    ])
                    .then(rolesAnswer => {
                        const role = rolesAnswer.role;
                        params.unshift(role);
                        const sql = `UPDATE employees
                                    SET role_id = ?
                                    WHERE id = ?`
                        db.query(sql, params, (err) =>{
                            if (err) {
                                throw err;
                            }
                            console.log("Employee updated");
                            return viewEmployees();
                        });
                    });
                });
            });
        });
    };
    const viewByManager = () =>{
        const sql = `SELECT firstName, lastName, id FROM employees`;
        db.query(sql, (err, rows) => {
            if (err) {
                throw err;
            }
            const employees = rows.map(({firstName, lastName, id}) =>({name: `${firstName} ${lastName}`, value: id}));
            inquirer.prompt([
                {
                    type: "list",
                    name: "employee",
                    message: "View manager's employees:",
                    choices: employees
                }
            ])
            .then(employeeAnswer => {
                const manager = employeeAnswer.employee;
                const params = [manager];
                const sql = `SELECT id, firstName, lastName FROM employees
                            WHERE manager_id = ?`
                db.query(sql, params, (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    if (rows.length === 0) {
                        console.log("This employee does not a manage others");
                        return runInquirer();
                    }
                    console.table(rows);
                    return runInquirer();
                });
            });
        });
    };
    const viewbyDepartment = () => {
        const sql = `SELECT * FROM departments`;
        db.query(sql, (err, rows) => {
            if (err) {
                throw err; 
            }
            const departments = rows.map(({name, id}) => ({name: name, value: id}));
            inquirer.prompt([
                {
                    type: "list",
                    name: "employee",
                    message: "View employees of department:",
                    choices: departments
                }
            ])
            .then(employeeAnswer => {
                const department = employeeAnswer.employees;
                const params = [department];
                const sql = `SELECT employees.id, firstName, lastName, departments.name AS department
                            FROM employees
                            LEFT JOIN roles ON employees.role_id =roles.id
                            LEFT JOIN departments ON roles.department_id = departments.id
                            WHERE departments.id = ?`;
                db.query(sql, params, (err, rows)=> {
                    if (err) {
                        throw err;
                    }
                    console.table(rows);
                    return runInquirer();
                });
            });
        });
    };
    const removeDepartment = () => {
        const sql = `DELETE FROM departments
                    WHERE id = ?`
        db.query(sql, params, (err) => {
            if (err) {
                throw err;
            }
            console.log("Department removed");
            return viewDepartments();
        });
    };
    const removeRole = () => {
        const sql = `SELECT id, title FROm roles`
        db.query(sql, (err, rows) => {
            if (err) {
                throw err;
            }
            const roles = rows.map(({title, id}) => ({name: title, value:id}));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'Remove role:',
                    choices: roles
                }
            ])
            .then(roleAnswer=>{
                const role = roleAnswer.role;
                const params = role; 
                const sql = `DELETE FROM roles
                            WHERE id = ?`
                db.query(sql, (err, rows)=> {
                    if (err) {
                        throw err;
                    }
                    console.log("Role deleted");
                    return viewRoles();
                });
            });
        });
    };
    const removeEmployee = () => {
        const sql = `SELECT firstName, lastName, id FROM employees`
        db.query(sql, (err, rows) => {
            if (err) {
                throw err;
            }
            const employeees = rows.map(({firstName, lastName, id})=> ({name: `${firstName} ${lastName}`, value:id}));
            inquirer.prompt([
                        {
                            type: "list",
                            name: "employee",
                            message: "Remove employees:",
                            choices: employees 
                        }
                    ])
                    .then(employeeAnswer => {
                        const employee = employeeAnswer.employee
                        const params = employee;
                        const sql = `DELETE FROM employees
                                    WHERE id = ?`
                        db.query(sql, params, (err)=> {
                            if (err) {
                                throw err;
                            }
                            console.log("Employee removed");
                            return viewEmployees();
                        });
                    });
                });
            };                



    module.exports = runInquirer;