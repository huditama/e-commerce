## Usage
```javascript
$ npm install
$ node app.js
```
Access server via `http://localhost:3000`<br>
Access client via `http://localhost:8080`

##  Routes
|Routes|HTTP|Header(s)|Body|Response|Description| 
|:--:|:--:|:--:|:--:|:--:|:--:|
|/users/signUp  |POST  |none|email: String (**required**),  password: String (**required**)|**Success**: Register a user, **Error**: Internal server error (Validation)|Register a user|
|/users/signIn  |POST  |none|email: String (**required**), password: String (**required**) |**Success**: Login as a user, **Error**: Internal server error (Validation)|Login as a user|
|/products  |GET  |token|none |**Success**: Get all published products, **Error**: Internal server error (Validation)|Get all published products|
|/products  |POST  |token|name: String (**required**), price: Number (**required**), stock: Number (**required**), image: File (**optional**) |**Success**: Create a product, **Error**: Internal server error (Validation)|Create a product (**ADMIN ONLY**)|
|/products/:ProductId  |PATCH  |token|name: String (**optional**), price: Number (**optional**), stock: Number (**optional**), image: File (**optional**)|**Success**: Update a product, **Error**: Internal server error (Validation)|Update a product (**ADMIN ONLY**)|
|/products/:ProductId  |DELETE  |token|none|**Success**: Delete a product, **Error**: Internal server error (Validation)|Delete a product (**ADMIN ONLY**)|
|/carts  |GET  |token|none |**Success**: Get logged in user's cart, **Error**: Internal server error (Validation)|Get logged in user's cart|
|/carts  |POST  |token|ProductId: String (**required**)|**Success**: Create logged in user cart, **Error**: Internal server error (Validation)|Create logged in user cart|
|/carts/:CartId  |DELETE  |token|none|**Success**: Delete user's cart, **Error**: Internal server error (Validation)|Delete a user's cart|
|/carts/addToCart  |PATCH  |token|ProductId: String (**required**), quantity: Number (**required**)|**Success**: Add selected products to cart, **Error**: Internal server error (Validation)|Add selected products to cart|
|/carts/addQuantity  |PATCH  |token|ProductId: String (**required**)|**Success**: Add quantity of product in user's cart by 1, **Error**: Internal server error (Validation)|Add quantity of product in user's cart by 1|
|/carts/subtractQuantity  |PATCH  |token|ProductId: String (**required**)|**Success**: Subtract quantity of product in user's cart by 1, **Error**: Internal server error (Validation)|Subtract quantity of product in user's cart by 1|
|/carts/removeProduct  |PATCH  |token|ProductId: String (**required**)|**Success**: Remove a product in user's cart, **Error**: Internal server error (Validation)|Remove a product in user's cart|
|/carts/checkout|PATCH  |token|details: Array of object (cart details) (**required**)|**Success**: Clear a user's cart and add to transactions, **Error**: Internal server error (Validation)|Clear a user's cart and add to transactions|
|/transactions|POST  |token|details: Array of object (cart details) (**required**)|**Success**: Add user's cart details to transactions, **Error**: Internal server error (Validation)|Add user's cart details to transactions (**ADMIN ONLY**)|
|/transactions|GET  |token|none|**Success**: Get all user's transaction details, **Error**: Internal server error (Validation)|Get all user's transaction details (**ADMIN ONLY**)|
