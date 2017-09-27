/**
 * Entry Point, and dependencies
 */

'use strict'
 
const Hapi = require('hapi');
const Request = require('request');
const Vision = require('vision');
const Handlebars = require('handlebars');
const LodashFilter = require('lodash.filter');
const LodashTake = require('lodash.take');
 
const server = new Hapi.Server();
 
server.connection({
    host: process.env.BASE_URL,
    port: process.env.PORT
});
 
// Register vision for our views
server.register(Vision, (err) => {
    server.views({
        engines: {
            html: Handlebars
        },
        relativeTo: __dirname,
        path: './views',
    });
});
 
server.start((err) => {
    if (err) {
        throw err;
    }
 
    console.log(`Server running at: ${server.info.uri}`);
});

// index
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        Request.get('https://store-api-andrescanales.herokuapp.com/products', function (error, response, body) {
            if (error) {
                throw error;
            }
 
            const data = JSON.parse(body);
            console.error(data[0].name);
            reply.view('index', { result: data });
        });
    }
});
 
// Handler helpers:

Handlebars.registerHelper("showColumn", function(index,block) {

    if(parseInt(index)%3 === 0){
        return block.fn(this);
    }
});
Handlebars.registerHelper("closeColumn", function(index,block) {
    if(parseInt(index) != 0){
        if(parseInt(index)%2 === 0){
            return block.fn(this);
        }
    }
});