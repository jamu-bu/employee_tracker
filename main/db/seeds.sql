USE company;
INSERT INTO departments (name)
VALUES
 ("Legal"),
 ("Sales"),
 ("Engineering"),
 ("Finance");


INSERT INTO roles (title, salary, department_id)
VALUES 
("Lawyer", 190000, 6);
("Sales Lead", 100000, 3), 
("Salesperson", 80000, 2), 
("Software Engineer", 120000, 1), 
("Lead Engineer", 150000, 1), 
("Accountant", 125000, 2), 
("Legal Team Lead", 250000, 2), 


INSERT INTO employees (first_name, last_name, role_id)
VALUES 
("Chaewon", "Kim", 1), 
("Sakura", "Miyawaki", 2), 
("Jennifer", "Huh", 3),
("Kazuha", "Nakamura", 4), 
("Eunchae", "Hong", 5), 
("Rick", "Astley", 6), 
("Garam", "Kim", 7), 
