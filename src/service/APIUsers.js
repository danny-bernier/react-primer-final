import { IllegalArgumentException } from "../errors/APIErrors";

const { REACT_APP_API_URL, REACT_APP_API_AUTHORITY } = process.env;

/**
 * Makes a GET request to fetch all users
 * @param {pageable} param0 Optional object containing pageable information: {page: number, offset: number, sort: string, order: string}
 */
export async function getAllUsers({page, offset, sort, order}) {
    if(page && offset && sort && order) {
        if(typeof page === 'number' && typeof offset === 'number' 
            && (typeof sort === 'string' || sort instanceof String) 
            && (typeof order === 'string' || order instanceof String)) {
            
            fetch(REACT_APP_API_URL.concat(`/users?page=${page}&offset=${offset}&sort=${sort}&order=${order}`))
            .then((response) => {
                return response.json()
            });
            
        } else {
            throw new IllegalArgumentException("Optional parameters 'page' and 'offset' must be numbers and 'sort' and 'order' must be strings in function createUser()");
        }
    } else {
        fetch(REACT_APP_API_URL.concat('/users'))
        .then((response) => {
            return response.json()
        });
    }
}


/**
 * Makes a GET request to fetch user by their user id
 * @param {number} id 
 * @return {Promise} Promise with the requested user
 */
export async function getUserByID(id) {
    if(typeof id === 'number') {

        fetch(REACT_APP_API_URL.concat(`/users/${ id }`))
        .then((response) => {
            return response.json()
        });

    } else {
        throw new IllegalArgumentException("Parameter 'id' in function getUserByID() must be a number.");
    }
}


/**
 * Makes a POST request to create a new user
 * @param {string} username 
 * @param {string} password 
 * @param {string} email 
 * @param {string} firstName 
 * @param {string} lastName 
 * @param {string} authority 
 * @return {Promise} Promise with the newly created user
 */
export async function createUser(username, password, email, firstName, lastName, authority) {
    let requestOptions;

    //validating minimum input parameters
    if((typeof username === 'string' || username instanceof String) 
        && (typeof password === 'string' || password instanceof String) 
        && (typeof email === 'string' || email instanceof String) 
        && username.length > 0 && password.length > 0 && email.length > 0) {
            
            //validating optional additional input parameters
            if(firstName && lastName && authority
                && (typeof firstName === 'string' || firstName instanceof String)
                && (typeof lastName === 'string' || lastName instanceof String)) {

                    //determining authority
                    switch (authority) {
                        case REACT_APP_API_AUTHORITY.MANAGER:
                        case REACT_APP_API_AUTHORITY.ADMIN:
                        case REACT_APP_API_AUTHORITY.LOCKED:
                            requestOptions = {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ 
                                    username: username,
                                    password: password,
                                    email: email,
                                    firstName: firstName,
                                    lastName: lastName,
                                    authority: authority
                                })
                            }
                            break;

                        default:
                            requestOptions = {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ 
                                    username: username,
                                    password: password,
                                    email: email,
                                    firstName: firstName,
                                    lastName: lastName,
                                    authority: REACT_APP_API_AUTHORITY.EMPLOYEE
                                })
                            }
                    }
            
            //if no optional additional input paramters are provided
            } else {
                requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        username: username,
                        password: password,
                        email: email
                    })
            }
        }

        //Making the create POST request
        fetch(REACT_APP_API_URL.concat('/users'), requestOptions)
        .then((response) => {
            return response.json()
        });

    //if valid minimum input parameters not provided
    } else {
        throw new IllegalArgumentException("Parameters 'username', 'password', and 'email' in function createUser() must be strings with length greater than 0.");
    }
}


/**
 * Makes a POST request to authenticate a user based on their username and password
 * @param {string} username 
 * @param {string} password 
 * @return {Promise} Promise for the user's authentication JWT
 */
export function authenticateUser(username, password){

    //validating parameters
    if((typeof username === 'string' || username instanceof String) 
        && (typeof password === 'string' || password instanceof String) 
        && username.length > 0 && password.length > 0) {

        //setting request options
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: username,
                password: password
            })
        }

        //Making the authentication POST request
        fetch(REACT_APP_API_URL.concat('/users/authenticate'), requestOptions)
        .then((response) => {
            return response.json()
        });

    //if invalid parameters
    } else {
        throw new IllegalArgumentException("Parameters 'username' and 'password' in function authenticateUser() must be strings with length greater than 0.");
    }
}