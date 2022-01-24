const mongoose = require('mongoose');

const Connection = async (url)=> {
     try{
       await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true});
       console.log('database Connection is established');
     }catch(err) {
         throw new Error(err);
     }
}

module.exports = Connection;