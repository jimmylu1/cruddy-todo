const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
      if (err) {
        callback(null, 0);
      } else {
        callback(null, {id, text});
      }
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, data) => {
    if (err) {
      callback(null, 0);
    } else {
      let arr = [];
      data.forEach(id => {
        let newId = id.slice(0, -4);
        arr.push({id: newId, text: newId});
      });
      callback(null, arr);
    }
  });
};

exports.readOne = (id, callback) => {
  let link = path.join(exports.dataDir, `/${id}.txt`);
  fs.readFile(link, 'utf8', (err, msg) =>{
    if (err) {
      callback(err, 0);
    } else {
      callback(null, {id, text: msg});
    }
  });
};

exports.update = (id, text, callback) => {
  exports.readOne(id, (err, data) => {
    if (err) {
      callback(err, 0);
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          callback(err, 0);
        } else {
          callback(null, text);
        }
      });
    }
  });
};

exports.delete = (id, callback) => {

  fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
    if(err) {
      callback(err, 0);
    } else {
      callback(null);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
