const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()

try {
    mongoose.connect(`mongodb://${process.env.db_user}:${process.env.db_pass}@ds119250.mlab.com:19250/antman`, {
      socketTimeoutMS: 0,
      keepAlive: true,
      reconnectTries: 30
    }) 
  } catch (err) {
    throw new Error(err) 
  }
  
const db = mongoose.connection 

const app = express()
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
      extended: false
    })
  ) 

const URI = require('./models/antURI.model')

const minify = require('./encodeDecode.service')

const port = process.env.port || 3000

app.post('/minify', function(req, res) {
    const longURI = req.body.longURI
    console.log(longURI)
    
    URI.findOne({longUrl: longURI}).exec()
        .then( doc => {
            if (doc) {
                antUrl = `${process.env.host}${port}/${minify.encode(doc._id)}`
                res.status(200).send({'antUrl':antUrl})
            } else {
                const newUrl = URI({
                    longUrl: longURI
                })
                  // save the new link
                  newUrl.save(function(err) {
                    if (err){
                      res.status(503).send(err);
                    }            
                    // construct the short URL
                    antUrl = `${process.env.host}${port}/${minify.encode(newUrl._id)}`            
                    res.status(201).send({'antUrl': antUrl})
                })
            }
        })
        .catch( e => {
            res.status(503).send(e)
        }) 
})

app.get('/:antUrl', function(req, res) {
    const antUrl = req.params.antUrl
    const id = minify.decode(antUrl)
    URI.findOne({_id: id}).exec()
        .then( doc => {
            if (doc) {
                res.status(200).send(doc.longUrl)                
            } else res.status(404).send(`URL not already minified.`)
        })
        .catch( e => {
            res.status(503).send(e)
        }) 
})

// Start Server
app.listen(port, function() {
    console.log(`Server spinning at port ${port}`)
})
