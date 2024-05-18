// importing neccesary modules...
import express from 'express'; 
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 
import dotnev from 'dotenv';

dotnev.config();

// secret key for JWT...
const SECRET_KEY = process.env.SECRET_KEY;

// exporting the router as a function that takes the database instance as a parameter
const authRoutes = (db) => {
    const router = express.Router();
    
    // route for user login...
    router.post('/login', async (req, res) => {
        const { email, password } = req.body; 

        // read data from the db...
        await db.read(); 

        // find user by emal...
        const user = db.data.users.find(u => u.email === email); 

        // if user does not exist, return an error response...
        if(!user){
            return res.status(400).json({
                message: 'Account does not exist',
            });
        }

        // compare hashed password with the provided password...
        const isMatch = await bcrypt.compare(password, user.password); 

        // if password do not match, return an error response...
        if(!isMatch){
            return res.status(400).json({
                message: 'Incorrect password',
            });
        }

        // generate JWT token with user ID...
        const token = jwt.sign({ userId: user.id}, SECRET_KEY, { expiresIn: '1h'}); 

        // send token in response...
        res.json({ token }); 
    }); 

    return router; 
}

export default authRoutes; 