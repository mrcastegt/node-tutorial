const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const url = require('url');
const path = require('path');


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/zodiacs',{ useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var Book;

function inserDataToDatabase(namePerson,datePerson)
{
    db.once('open', function() {
        console.log("Connection Successful!");
        // define Schema
        var BookSchema = mongoose.Schema({
        name: String,
        dateBorn: String
        });
    
        // compile schema to mode
        Book = mongoose.model('Book', BookSchema, 'zodiacperson');
    
        // a document instance
        var book1 = new Book({ name: namePerson, dateBorn: datePerson });
    
        // save model to database
        book1.save(function (err, book) {
        if (err) return console.error(err);
        console.log(book.name + " saved to bookstore collection.");
        });
    });
}



if(process.env.NODE_ENV !== 'production')
{
    require('electron-reload')(__dirname,{
        electron: path.join(__dirname,'node_modules','.bin','electron')
    });
}


let mainWindow;
let newZodiacWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'views/index.html'),
        protocol: 'file',
        slashes:true
    }));

    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed',() =>
    {
        app.quit();
    });
});

function createNewZodiacWindow()
{
    newZodiacWindow =  new BrowserWindow({
        width: 400,
        height: 450,
        title: 'Consulta tu signo zodiacal',
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true
        }
    });
    newZodiacWindow.setMenu(null);

    newZodiacWindow.loadURL(url.format({
        pathname: path.join(__dirname,'views/new-producto.html'),
        protocol: 'file',
        slashes:true
    }));
    newZodiacWindow.on('closed',() =>
    {
        newZodiacWindow = null;
    });
}

ipcMain.on('zodiac:new', (event,newZodiac) => {
     console.log(newZodiac);
    mainWindow.webContents.send('zodiac:new',newZodiac)
    // console.log(newZodiac);
    inserDataToDatabase(newZodiac.name,newZodiac.date);
    newZodiacWindow.close();
} );

const templateMenu = [
    {
        label: 'Archivo',
        submenu: [
            {
                label: 'Consulta Signo zodiacal',
                accelerator: 'Ctrl+N',
                click()
                {
                    createNewZodiacWindow();
                }
            }
            ,
            {
                label: 'Remover Todo',
                click()
                {
                    mainWindow.webContents.send('zodiac:remove-all');
                }
            }
            ,
            {
                label: 'Salir',
                accelerator: 'Ctrl+X',
                click()
                {
                    app.quit();
                }
            }
        ]
    }
    
];

if(process.env.NODE_ENV !==  'production')
{
    templateMenu.push({
        label: 'DevTools',
        submenu:[
            {
                label: 'Muestra/Oculta Opciones Desarrollo',
                click(item, focusedWindow)
                {
                    focusedWindow.toggleDevTools();
                }
            }
            ,
            {
                role: 'reload'
            }
        ]
    })
}