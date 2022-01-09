# Backend Onboarding Project

In this project, you'll be implementing the required backend functions to make a merchandise store function. This will be consumed by the completed version of the [Frontend Onboarding Project](linknotmadeyet).

## How to Run

This project uses Node.js with Typescript, and uses the ExpressJS framework + Docker to run the Postgres DB.

```bash
# after cloning
yarn install
yarn watch # this will run the server and auto recompile/re-run it anytime you make a change
# navigate to localhost:3000 to see the server!
```

## TODOS

We've detailed the required routes for the project here. We highly recommend that you use something like [Postman](https://www.postman.com/) to test out your routes (although the final version of the server should work with the provided frontend).

- [ ] `GET /items` - returns a list of all the items
  - Response
    - an array of objects of the following shape
      - `uuid`: the uuid of the item
      - `name`: the name of the item
      - `price`: the price of the item
      - `createdAt`: the time the item was created
- [ ] `POST /item` - creates an item
  - Input (Body, in json or form data)
    - `name`: the name of the item
    - `description`: the description of the item
    - `price`: the price of the item
  - Response:
    - `uuid`: the newly created item's uuid
- [ ] `POST /order` - creates an order
  - Input (Body, in json or form data)
    - `itemId`: the uuid corresponding with the item
  - Note: to simplify things, we're going to assume that a call to this request assumes the user is going to buy *one* item at a time
  - Response:
    - `uuid`: the newly created order's uuid
- [ ] `GET /orders/:uuid`: returns the information associated with an item. To simplify things, we're not going to ask you to add any auth (though adding auth would be cool!)
  - Input (Body, in json or form data)
    - `user`: the uuid of the current user
  - Response
    - `uuid`: the order's uuid
    - `item`: the item that was purchased with this order
    - `price`: the price of the item that was purchased
    - `createdAt` the time the order was placed
- [ ] `POST /user`: creates a new user
  - Input (Body, in json or form data)
    - `name`: the user's name
  - Response:
    - `uuid`: the uuid of the user (used as an id for other methods)
- [ ] `GET /users`: gets all users (we're not worried about security for the scope of this project)
  - Response:
    - an array of objects of the following shape
      - `uuid`: a user's uuid
      - `name`: a user's name
- [ ] `GET /user/:uuid`: gets information about a user
  - Response:
    - `uuid`: the user's uuid
    - `name`: a user's name
    - `orders`: an array of all the orders associated with a user, each object in this array should have the following shape
      - `uuid`: the order's uuid
      - `item`: the item that was purchased with this order
      - `price`: the price of the item that was purchased
      - `createdAt` the time the order was placed
