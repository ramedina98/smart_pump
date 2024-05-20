// importing necessary module for the server...
import express from 'express'; 
import bodyParser from 'body-parser'; 
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotevn from 'dotenv'; 
import logoutRoute from './routes/logout.js';

// Load environment variables from .env file
dotevn.config();

// importing the database setup and initialization...
import { db, initDB } from './db/db.js';

// creating an instance of express...
const app = express(); 
const PORT = process.env.PORT; // define the port number...

// middleware setup...
app.use(cors()); // enable cross-origin resource sharing...
app.use(bodyParser.json()); // parse incoming JSON requests...
app.use(cookieParser());

// set the view engine to ejs
app.set('view engine', 'ejs');
// we tell express that the static files are in the public folder
app.use(express.static('public'));

// importing routes with db instance...
import authRoutesFactory from './routes/auth.js'; 
import userRoutesFactory from './routes/user.js'; 

// initializing routes with the db instace...
const authRoutes = authRoutesFactory(db); 
const userRoutes = userRoutesFactory(db); 

// setting up routes...
// login
app.use('/auth', authRoutes); 
// routes...
app.use('/user', userRoutes); 
// logout
app.use('/auth', logoutRoute);

// Middleware for automatic redirection
app.use((req, res, next) => {
    const token = req.cookies.token;
    if (!token && req.originalUrl !== '/') {
        // If there is no token and the route is not '/', redirect to '/'
        return res.redirect('/');
    } else if (token && req.originalUrl === '/') {
        // If there is a token and the route is '/', redirect to '/user/'
        return res.redirect('/user/');
    }
    next();
});

//default routes if not yet logged in
app.get('/', (_req, res) => {
    res.render('pages/login');
})

// initialize the db and then start the server...
initDB().then(() => {
    // start the server and listen on the defined port...
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`); 
    });
}).catch(error => {
    // handle any error that occur during db initialization...
    console.log('Filed to initialize database', error); 
});