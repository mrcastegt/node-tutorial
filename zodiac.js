var mongoose = require('mongoose');
const Express = require('express');
const BodyParser = require('body-parser');
var cors = require('cors');

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(cors());


app.listen(3000, () => {
    console.log("Listening at :3000...");
});

var express = require('express');

var app2 = express();
app2.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.delete("/person/:id", async (request, res) => {
  if(deleteRegisterInServer(request.params.id))
    res.json("ok");
  else
    res.json("error");
});

//THIS API RETURN ALL THE API
app.get('/getall', function (req, res) {
  getDataFromDatabase();
  res.json(dataSavedFromDatabase);
});

//THIS API MAKE ALL THE INSERT ON THE DATABASE
app.get('/', function (req, res) {
  inserDataToDatabase(req.headers.name, req.headers.datepicker);
  res.json(req.headers);
});

  var Book;
  // define Schema
  var BookSchema = mongoose.Schema({
    name: String,
    dateBorn: String
  }, {collection: 'Book'});
  // compila el esquema a un modelo
  Book = mongoose.model('Book', BookSchema, 'zodiacperson');

function inserDataToDatabase(namePerson,datePerson)
{
  if(!db)
  {
    console.log("_____________________________")
    mongoose.connect('mongodb://localhost:27017/zodiacs',{ useNewUrlParser: true });
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
  }
    db.once('open', function() {
        console.log("Connection Successful!");
        // instancia
        var book1 = new Book({ name: namePerson, dateBorn: datePerson });
        // guarda el modelo en la base de datos
        book1.save(function (err, book) {
        if (err) return console.error(err);
        console.log(book.name + " saved to bookstore collection.");
        });
    });
}

var dataSavedFromDatabase = {};
getDataFromDatabase();
function getDataFromDatabase()
{
  mongoose.connect('mongodb://localhost:27017/zodiacs',{ useNewUrlParser: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function() {

    Book.find({}, function(err, data){
      if (err) return handleError(err);
      dataSavedFromDatabase = data;
      
    });
  });
}

var responseToDeleteRegister = "";

function deleteRegisterInServer(id)
{
  mongoose.connect('mongodb://localhost:27017/zodiacs',{ useNewUrlParser: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function() {

    Book.findOneAndDelete({_id: id}, function(err){
      if (err) 
        responseToDeleteRegister = "error";
      else
        responseToDeleteRegister = "ok";
    });
  });
}