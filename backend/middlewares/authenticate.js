import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {

    try {

        // Get token from request header
        const authHeader = req.headers.authorization;


        if (!authHeader) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        // Expected format:
        // Authorization: Bearer TOKEN_HERE
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Invalid token format"
            });
        }
        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        // Attach user information to request
        req.user = decoded;
        // Continue to controller
        next();
    } catch (error) {

        console.error("Authentication error:", error);

        return res.status(401).json({
            message: "Unauthorized"
        });
    }
};

export default authenticate;