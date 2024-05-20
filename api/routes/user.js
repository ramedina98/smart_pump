// importing necessary modules...
import express from 'express'; 
import jwt from 'jsonwebtoken'; 
import dotnev from 'dotenv';
import bcrypt from 'bcryptjs';

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

    // route to the main...
    router.get('/', authenticate, async (req, res) => {
        await db.read(); 
        // finding the user based on user ID extracted from token...
        const user = db.data.users.find(u => u.id === req.user.userId);
        res.render('pages/index', {
            name: user.name.first + ' ' + user.name.last, 
            photo: user.picture,
        }); 
    }); 

    // route to update user details...
    router.put('/me', authenticate, async (req, res) => {
        // Get all form fields submitted in the request
        const { name, last, age, eyeColor, phone, email, address, company } = req.body;

        try {
            // read the db
            await db.read();

            // Find the user based on the user ID extracted from the token
            const user = db.data.users.find(u => u.id === req.user.userId);

            // Update user details with the values received from the form
            user.name = name;
            user.lastN = last;
            user.age = age;
            user.eyeColor = eyeColor;
            user.phone = phone;
            user.email = email;
            user.address = address;
            user.company = company;

            // Write changes to the database
            await db.write();

            // Send a JSON response with the user's updated details
            res.json({ message: 'Successful update' });

        } catch (error) {
            // Handle any errors that occur during the process.
            res.status(500).json({ message: 'Internal server error' });
        }
    }); 

    // route to change the password...
    router.put('/password', authenticate, async (req, res) => {
        const { oldPassword, newPassword } = req.body;
        await db.read();
        // finding the user based on user ID extracted from token...
        const user = db.data.users.find(u => u.id === req.user.userId);

        // compare the old password with the stored hashed password...
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            // if passwords don't match, return an error response...
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        // hash the new password...
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // update the user's password...
        user.password = hashedNewPassword;
        await db.write(); // writing changes to db...
        res.json({ message: 'Password updated successfully' });
    });

    // route to get user balance...
    router.get('/balance', authenticate, async (req, res) => {
        await db.read();
        // finding the user based on user ID extracted from token...
        const user = db.data.users.find(u => u.id === req.user.userId); 
        res.render('pages/balance', { 
            name: user.name.first + ' ' + user.name.last, 
            photo: user.picture,
            balance: user.balance 
        }); // sending user balance in response...
    });

    // route to get user details...
    router.get('/details', authenticate, async (req, res) => {
        await db.read();
        // finding the user based on user ID extracted from token...
        const user = db.data.users.find(u => u.id === req.user.userId);
        res.render('pages/details', {
            name: user.name.first + ' ' + user.name.last, 
            photo: user.picture,
            user: {
                name: user.name.first, 
                lastN: user.name.last,
                age: user.age, 
                eyesColor: user.eyeColor, 
                phone: user.phone, 
                company: user.company, 
                email:user.email, 
                address: user.address
            }
        }); 
    }); 

    return router; 
}

export default userRoutes; 