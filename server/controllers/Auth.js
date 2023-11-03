import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
dotenv.config()
const prisma = new PrismaClient()

function generateToken(user) {
    return jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_SECRET_EXPIRES_IN })
}

function generateRefreshToken(user) {
    return jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_KEY, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN })
}

export const Login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body

        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            return res.status(404).json({ msg: "Email tidak ditemukan" })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return res.status(401).json({ msg: "Password salah" })
        }

        // const accessToken = generateToken(user)
        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_SECRET_EXPIRES_IN })

        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_KEY, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN })

        // const refreshToken = generateRefreshToken(user)



        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                refreshToken: refreshToken
            }
        })


        res
            .cookie("_XYZabc123", refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            })
            .status(200).json({ accessToken, refreshToken, id: user.id, email: user.email, username: user.username, roleId: user.roleId })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Terjadi kesalahan saat proses login" })
    }
}

export const Logout = async (req, res) => {
    try {
        const refreshToken = req.cookies._XYZabc123
        if (!refreshToken) return res.sendStatus(401);
        const user = await prisma.user.findUnique({
            where: {
                refreshToken: refreshToken
            }
        })
        if (!user) return res.sendStatus(204)
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                refreshToken: null
            }
        })
        res.clearCookie('refreshToken')
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
    }
}