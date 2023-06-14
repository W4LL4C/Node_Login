const {MongoClient} = require('mongodb')

//const fs = require('fs');

//substituir para valores da sua base
const uri = 'mongodb+srv://Wallace:Atlas@cluster0.jbuw8ob.mongodb.net/?retryWrites=true&w=majority'

const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

//nome coleção
const COLLECTION_NAME = 'bicicleta';

async function withMongoDb(callback) {
  const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
  try {
    await client.connect();
    const db = client.db('Wallace');
    const collection = db.collection(COLLECTION_NAME);
    
    return await callback(collection);
  } catch (error) {
    console.error('Erro ao trabalhar com mongo', error);
    throw error;
  }finally{
    await client.close();
  }
}

async function lerData() {
  return withMongoDb(async (collection) => {
    const data = await collection.find({}).toArray();
    return data;
  });
}

async function escreverData(data) {
  return withMongoDb(async (collection) => {
    await collection.insertMany(data);
  });
}
/*
async function findUserByEmail(email) {
  return await withMongoDb(async (collection) => {
    return await collection.findOne({email: email});
  });
}

async function findUserById(id) {
   return await withMongoDb(async (collection) => {
    return await collection.findOne({id: id});
  });
}

async function deleteData(user) {
  return withMongoDb(async (collection) => {
    await collection.deleteOne({ email: user.email });
  });
}
*/
module.exports = { lerData, escreverData};