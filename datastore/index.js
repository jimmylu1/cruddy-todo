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
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
  // let link = path.join(exports.dataDir, `/${id}.txt`);
  // fs.readFile(link, 'utf8', (err, msg) => {
  //   if (err) {
  //     callback(err, 0);
  //   } else {
  //     fs.writeFile(link, text, (err) => {
  //       console.log(`${id}.txt`);
  //       if (err) {
  //         callback(err, 0);
  //       }
  //     });
  //   }
  // });
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

// var result = data.replace(/string to be replaced/g, 'replacement');
//read file, change text inside
//callback


exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
