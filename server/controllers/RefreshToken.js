import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"
dotenv.config()
const prisma = new PrismaClient()

function generateToken(user) {
    return jwt.sign({ userId: user.id, username: user.username , email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_SECRET_EXPIRES_IN })
}

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.sendStatus(401);
        const user = await prisma.user.findUnique({
            where: {
                refreshToken: refreshToken
            }
        })
        if (!user) return res.status(403).json({ msg: "Token tidak valid" })
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, decoded) => {
            if (err) return res.sendStatus(403)
            const accessToken = generateToken(user)
            res.json({ accessToken, 
                // user: { id: user.id, username: user.username, email: user.email, role: user.roleId } 
            })
        })
    } catch (error) {
        console.log(error)
    }
}