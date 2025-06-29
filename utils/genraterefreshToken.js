import jwt from 'jsonwebtoken';
import UserModel from '../models/usermodel.js';

const genraterefReshToken =async (userid) => {
    try {
        const token = jwt.sign({ id: userid }, process.env.REFRESH_SECRET_KEY, {
            expiresIn: '30d',
        });
        // Update the refresh token in the database

        const updateRefreshToken = await UserModel.updateOne({ _id: userid }, { 
        refresh_token: token });
        return token;
    } catch (error) {
        return error.message || error;
    }
}

export default genraterefReshToken