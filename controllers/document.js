const express = require('express');
const Document = require('../models/document');

function show(req, res, next){
   Document.find({owner: req.user._id}).exec(function (err, document) {
      if (err) {
        res.render('/', { error: 'Ocurrio un error inesperado' })
      } else {
        res.render('document/show', { document })
      }
})
}

function newDocument(req, res, next) {
    Document.register(new Document({ name : req.body.name }), (err, document) => {
        if (err) {
          return res.render('/', { error : err.message });
        } else {
          return res.render('/', { document });
        }
    });
}

module.exports = {
  show,
  newSubject
};