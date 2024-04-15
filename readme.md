# API Backend

A server in Express.js that handles requests for serving data for a Ecommerce website.
This is a addon to my other school project: React Ecommerce (https://github.com/jesperekerling/react-ecommerce).

# Live Demo
https://ecommerce.ekerling.com/ (Front End using this API)<br />
https://ecommerce-api.ekerling.com/ (Documentation + API URL)

### How to use (locally)

- Install [Node.js platform](https://nodejs.org/en/)
- Download the code from this Github repo
- Open terminal/command-line:
	- `cd backend-api`
	- `npm install`

__Run__:

```
npm run start
```

or directly using node executable (port is optional, default 7000)

```
node index.js <port>
```



# API Requests
(API URL / Functionality)<br /><br />

/products - GET all products<br />
/produtcs/:id - GET specific product from ID<br />
/products/:id - PUT update product<br />
/products/:id - DELETE delete product<br /><br />

/message - POST send message
/messages - GET all messages<br />
/messages/:id - GET specific message<br /><br />

/orders - POST create order (Bearer token required)<br />
/orders - GET all orders (Bearer token required)<br /><br />

/register - POST register user<br />
/login - POST login user
