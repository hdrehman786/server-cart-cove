import jwt from "jsonwebtoken";


const auth = async (req, res, next) => {
    try {
        const token = req.  cookies.accesstoken;
        console.log("acess token",token);
        if (!token) {
            return res.status(401).json({ message: "Unauthorized", error: true, success: false });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized", error: true, success: false });
        }
        console.log("decoded",decoded);
        req.id = decoded.id;

    next();
    }catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

export default auth;