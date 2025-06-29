import jwt from 'jsonwebtoken';

const genrateAccessToken = async (userid) => {
    try {
        const token = jwt.sign({ id: userid }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        return token;
    } catch (error) {
        return error.message || error;
    }
}

export default genrateAccessToken