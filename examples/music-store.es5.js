/*
* The MIT License (MIT)
*
* Product:      Paypal Basket
* Description:  A simple basket & product manager for the PayPal-node-SDK
*
* Copyright (c) 2017-2020 Steven Agyekum <agyekum@posteo.de>
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software
* and associated documentation files (the "Software"), to deal in the Software without restriction,
* including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
* and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
* subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies
* or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
* TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
* THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
* TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*
*/

var Paypal = require('@burnett01/paypal-basket').Paypal
  , Basket = require('@burnett01/paypal-basket').Basket
  , Product = require('@burnett01/paypal-basket').Product

/* Configure paypal sdk */
Paypal.configure({
  mode: 'sandbox',
  client_id: '',
  client_secret: ''
})

/* A JSON collection of music albums */
var albums = [
  {
    "sku": "davidguettalisten",
    "name": "David Guetta - Listen",
    "price": "5.00"
  },
  {
    "sku": "michaeljacksonworld",
    "name": "Michael Jackson - World",
    "price": "10.00"
  },
  {
    "sku": "simplyredthrillme",
    "name": "Simply Red - Thrill me",
    "price": "10.00"
  }
]

/* 
  A collection of music products
  to contain the actual album products
*/
var products = {}

/* 
  Create products from albums 
  and push to collection
*/
for( var index in albums ) {
  var album = albums[index]
  products[album.sku] = new Product(album)
}

/* 
  From here on you can access a product like:

  products['michaeljacksonworld']
  products['davidguettalisten']
*/

/* Create a basket (eg. for a customer) */
var sessionxyzBasket = new Basket({
  label: 'Basket of session xyz',
  urls: {
    return_url: 'http://return.url',
    cancel_url: 'http://cancel.url'
  }
})


/* 
  Now let the customer add/del 
  some products to/from their basket.
  Presumeble by a website
*/
sessionxyzBasket.add(products['davidguettalisten'])
.then(sessionxyzBasket.add(products['michaeljacksonworld']))
.then(sessionxyzBasket.add(products['simplyredthrillme']))
.then(sessionxyzBasket.del(products['davidguettalisten']))

/* Print current total */
console.log('Current total is: $' + sessionxyzBasket.total)

/*
  Now sell the basket (generate manifest)
  and request actual payment details
*/

/* Promise invocation */
sessionxyzBasket.sell( { 'currency': 'USD' } )
.then( function(manifest) {
  console.log("Payment Response:")
  console.log(manifest.payment)
})
.catch( function(err) { console.log(err) } )

/* Nodeback invocation */
sessionxyzBasket.sell( { 'currency': 'USD' }, function(err, manifest) {
  if( err ) { return console.log(err) }

  console.log("Payment Response:")
  console.log(manifest.payment)
})
