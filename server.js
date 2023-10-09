const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { faker } = require('@faker-js/faker');

const server = express();

const config = {
    port: 3000
};

server.use( cors() );
server.use(bodyParser.json());

const data = {
    categories: [],
    products: []
};
  
//  Fill in categories with fake data
for(let i=0; i < 3; i++) {
    data.categories.push({
      id: faker.string.uuid(),
      name: faker.commerce.department(),
    })
};

//  Fill in products with fake data
for(let i=0; i < 40; i++) {

    const randomCategoryIndex = Math.floor(Math.random() * data.categories.length);
    const cat = new String(data.categories[randomCategoryIndex].name);
    data.products.push({
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.lorem.lines(2),
      image: faker.image.urlLoremFlickr({height:400,category:cat}),//image.url(),
      price: faker.commerce.price(),
      category: data.categories[randomCategoryIndex],
      onSale: Math.random() > 0.5
    })
  
};

server.get('/categories', (req, res) => {
    res.send({
        success: true,
        data: data.categories
    });
});


server.get('/categories/:id', (req, res) => {
    const categoryId = req.params.id;
    const response = {}
  
    const category = data.categories.find(category => category.id === categoryId);
    if (category) {
        response.success = true;
        response.data = category;
    } else {
        response.success = false;
        response.err = 'Category not found'
    }
  
    res.send(response);
});

server.get('/products', (req, res) => {
    res.send({
        success: true,
        data: data.products
    });
});

server.get('/products-on-sale', (req, res) => {
    res.send({
        success: true,
        data: data.products.filter(product => product.onSale)
    });
});

server.get('/products/:categoryId', (req, res) => {
    const categoryId = req.params.categoryId;
    const response = {};
  
    if (categoryId !== undefined) {
        response.success = true;
        response.data = data.products.filter(product => product.category.id === categoryId);
    } else {
        response.success = false;
        response.err = 'categoryId is missing or invalid';
    }
  
    res.send(response);
  
});

console.log('Starting server ...');
server.listen(config.port, () => {
    console.log('Server started at port ' + config.port)
});