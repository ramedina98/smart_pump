// importing necessary modules...
import express from 'express'; 
import jwt from 'jsonwebtoken'; 
import dotnev from 'dotenv';

dotnev.config();

// secret key for jwt...
const SECRET_KEY = process.env.SECRET_KEY; // TODO: convertir en variable de entorno...

// exporting the router as a function that takes the db instance as a parameter...
const userRoutes = (db) => {
    const router = express.Router(); 

    // middleware function to authenticate user requests...
    const authenticate = (req, res, next) => {
        // extracting the token from the request header...
        const token = req.cookies.token; 
        if(!token) return res.status(401).json({ message: 'No token, authorization denied' }); 

        try{
            // verifying the token... 
            const decoded = jwt.verify(token, SECRET_KEY); 
            req.user = decoded; 
            next(); // proced to the next middleware fucntion if token is valid...
        } catch(error){
            // handling invalid token error...
            res.status(401).json({ message: 'Token is not valid' }); 
        }
    }; 

    // route to get user details...
    router.get('/', authenticate, async (req, res) => {
        await db.read(); 
        // finding the user based on user ID extracted from token...
        const user = db.data.users.find(u => u.id === req.user.userId);
        res.render('pages/index', {user: user}); 
    }); 

    // route to update users details...
    router.put('/me', authenticate, async (req, res) => {
        const { name, address } = req.body; 
        await db.read(); 
        // finding the user based on user ID extracted from token...
        const user = db.data.users.find(u => u.id === req.user.userId); 
        user.details = { name, address }; // updating user details...
        await db.write(); // writting changes to db...
        res.json(user); // sending update user details in response...
    }); 

    // route to get user balance...
    router.get('/balance', authenticate, async (req, res) => {
        await db.read();
        // finding the user based on user ID extracted from token...
        const user = db.data.users.find(u => u.id === req.user.userId); 
        res.render('pages/balance', { 
            user: user, 
            balance: user.balance 
        }); // sending user balance in response...
    });

    return router; 
}

export default userRoutes; 