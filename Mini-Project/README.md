
# Mini-Project
Uses MS SQL server

## Running The App
- Configure the `.env` using the `.env.template` template provided.
- Install the node packages required
- `nodemon` - To start the application in dev environment.
 
## Routes
### Location
**Add a location**
- Request Type: POST
- Parameters: city, country
- Example: To insert *Delhi, India*
    ```
    http://localhost:9000/location?city=Hyderabad&country=India
    ```
**Get all added locations**
- Request Type: GET
- Parameters: None
- Example: 
    ```
    http://localhost:9000/location
    ```

**Delete a location**
- Request Type: DELETE
- Parameters: city, country
- Example: To delete *Delhi, India*
    ```
    http://localhost:9000/location?city=Hyderabad&country=India
    ```
### Employee
**Add an Employee**
- Request Type: POST
- Parameters: name, experience, city, country and salary
- Example: To insert *Ename, Eexperience, Ecity, Ecountry and Esalary*
    ```
    name :Ename
    experience :10
    city :Delhi
    country :India
    salary :1000
    ```
    ```
    http://localhost:9000/employee/?name=Ename&experience=10&city=Delhi&country=India&salary=1000
    ```

**Get all added employees**
- Request Type: GET
- Parameters: None
- Example: 
    ```
    http://localhost:9000/employee
    ```

**Get all added employees whose salary is in between the specified range**
- Request Type: GET
- Parameters: lower_bound, upper_bound
- Example:  Get employees with salary between 0 and 2000
    ```
    http://localhost:9000/employee/salary?upper_bound=2000&lower_bound=0
    ```

**Update an Employee**
- Request Type: PUT
- Parameters: eid, change_experience, change_city and change_country
    **Note**: 
    - Except eid, every other parameter is optional
    - But if you wish to update location, change_city and change_country both are required.

- Example: To update  `eids` *experience, city, country and salary*
    ```
    http://localhost:9000/employee/?eid=1&change_experience=11&change_city=Hyderabad&change_country=India&change_salary=1001
    ```

**Delete an Employee**
- Request Type: DELETE
- Parameters: eid
- Example: To delete an Employee with eid=1
    ```
    http://localhost:9000/employee/?eid=1
    ```

### Project
**Add a project**
- Request Type: POST
- Parameters: project_name
- Example: To insert a project with name *pName*
	```
	http://localhost:9000/project/?project_name=pName
	```
**List all projects**
- Request Type: GET
- Parameters: None
- Example: 
    ```
    http://localhost:9000/project/
    ```

**List the locations of the employees working on a project**
- Request Type: GET
- Parameters: pid
- Example:  Locations of the employees working on a project with pid=1
    ```
    http://localhost:9000/project/locations?pid=1
    ```
**Add an Employee to a project**
- Request Type: PUT
- Parameters: eid, pid
- Example: Add an employee with eid=1 to project whose pid=2
    ```
    http://localhost:9000/project/addemp?pid=2&eid=1
    ```
**Remove an Employee from a project**
- Request Type: PUT
- Parameters: eid, pid
- Example: Delete an employee with eid=1 from project whose pid=2
    ```
    http://localhost:9000/project/delemp?pid=2&eid=1
    ```

**Delete a project**
- Request Type: DELETE
- Parameters: pid
- Example: To delete a project with pid=1
    ```
    http://localhost:9000/project/?pid=1
    ```

## TypeORM Migration commands
```bash
npm run migration:generate
npm run migration:run
npm run migration:revert
```
