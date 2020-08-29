# Camunda+React+Node.js

This is an example app to demonstrate how a full-stack application using React and Express can be orchestrated using a BPM software like [Camunda](https://camunda.com/). It's a simple and minimalist application where the user can perform simple tasks like Sign Up or Login, View their Profile and Upload Documents against their Profile. The appliation architecture is laid out as such,

## Camunda BPM

The Camunda BPM is where all the user behavior/activity is tracked and orchestrated. All the data pertaining to the user sits here. This layer communicates what page the user must be Redirected to on the front-end based on what task the user has pending at any given moment.

That being said, the BP model is quite simple and linear and doesn't have any branches, decisions and non-user activities. 

## Express

The Express application acts as the intermediate layer between the React application and Camunda, exposing key API endpoints to both fetch user data and other static content like Dropdown items. It communicates to Camunda via REST API. Each endpoint like `/api/login` and `/api/signup/` orchestrates multiple Camunda operations under the hood, communicating only the most crucial data to the front-end.

For validation, [`express-validator`](https://express-validator.github.io/docs/) was used. Future plans include using [`swagger`](https://swagger.io/) to document the API. This plan might also include unit tests in the near-future.

## Redux

Redux acts as the mediator between the React and Express applications, taking care of every API call internally through the use of a custom middleware and populating the state accordingly. I've used [`@reduxjs/toolkit`](https://redux-toolkit.js.org/) as it really simplifies and speeds up the development process.

## React 

Finally, I've used React as the front-end library for this project. Except for form validation, all of the front-end logic is tighly-coupled with the Redux layer like Routing. I've used custom helper functions for performing form validations.

## Semantic UI

This was my UI library of choice for this project as it has a [pretty well documented integration library with react](https://react.semantic-ui.com/). It allows you to use React-like components and build websites quickly without using a lot of CSS-styling. The scope of the components are extensive and a lot of customaization can be achieved using props alone.

Quite lazily, my UI was ~copied from~ heavily inpired by this [example](https://react.semantic-ui.com/layouts/login) on their website too. 😇

### Important Note

This app is still a WIP and I'm yet to write unit tests, document and refactor a lot of the code. I haven't implemented document storage after the user uploads them to the server to focus more on the integration alone without going down the file management rabbit hole. React application, instead, validates the file based on the mime-type only accepting JPEG, PNG and PDF files. Once validated, it makes an API call via Redux to mark the files as "uploaded" (even though they aren't. The files get discarded once the application restarts) 
