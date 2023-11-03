import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token || token === null) return res.sendStatus(401)

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) return res.sendStatus(403)
        req.user = decoded
        // req.email = decoded.email,
        // req.userId = decoded.id
        next()
    })
    }