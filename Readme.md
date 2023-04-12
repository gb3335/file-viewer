# Node.js server with JWT authentication for serving PDF files
This API allows users to authenticate and retrieve a PDF file.

## Requirements
- Node.js v10 or later
- npm (Node.js package manager)

## Installation
- Clone the repository or download the code.
- Open a terminal window and navigate to the project directory.
- Run the command npm install to install the necessary packages.
- Setup local mysql Database 'testdb'

## API Documentation:

### Authentication API:
#### Endpoint: /auth
#### Method: POST
#### Authentication Required: No
#### Request Parameters:
#### {
####   "username": "string",
####   "password": "string"
#### }

#### Response:
#### Upon successful authentication, the API will return a JWT token that can be used to access the PDF file.
#### {
####   "token": "string"
#### }

#### Error Response:
#### {
####   "message": "string"
#### }

### PDF Retrieval API:
#### Endpoint: /pdf
#### Method: GET
#### Authentication Required: Yes (JWT Token)
#### Request Headers:
#### {
####   "Authorization": "{JWT Token}"
#### }

#### Response:
#### Upon successful authentication, the API will return the PDF file that has been previously saved by the user.

#### Error Response:
#### {
####   "message": "string"
#### }

### Note: 
#### The PDF file should be saved by the user in the server and the file location should be referenced in the API endpoint /pdf. The API will then return the file based on the user's authentication.