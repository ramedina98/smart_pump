import express from 'express';

const router = express.Router();

router.post('/logout', (_req, res) => {
    // Set the token cookie with an expiration date in the past to delete it
    res.cookie('token', '', { expires: new Date(0), path: '/' });
    // Respond with a message indicating the token has been deleted
    res.status(200).json({ message: 'Token deleted' });
});

export default router;