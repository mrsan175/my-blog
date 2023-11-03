import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import bcrpyt from "bcrypt"
import dotenv from "dotenv"
dotenv.config()
const prisma = new PrismaClient()

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany(
        //     {
        //     select: {
        //         id: true,
        //         username: true,
        //         email: true,
        //         roleId: true,
        //     }
        // }
        )
        res.status(200).json({ users })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Terjadi kesalahan saat proses login" })
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await prisma.user.findUnique({
            where: {
                id: String(id)
            },
            select: {
                id: true,
                username: true,
                email: true,
                roleId: true,
            }
        })
        res.status(200).json({ user })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Terjadi kesalahan saat proses login" })
    }
}

export const createUser = async (req, res) => {
    try {
        const { username, email, password, bio, id } = req.body
        const hashedPassword = await bcrpyt.hash(password, 10)
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                bio
            }
        })
        const accessToken = jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_SECRET_EXPIRES_IN })
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        })
        res.json({newUser, accessToken})
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error creating user.' })
    }
}

export const editUser = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            id: String(req.params.id)
        }
    })

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }
    const { username, email, roleId, password, bio } = req.body

    let hashedPassword

    if (password === "" || password === null) {
        hashedPassword = user.password
    } else {
        hashedPassword = await bcrpyt.hash(password, 10)
    }

    try {
        await prisma.user.update({
            where: {
                id: String(req.params.id)
            },
            data: {
                username: username,
                email: email,
                password: hashedPassword,
                bio: bio,
                role: {
                    connect: {
                        id: roleId
                    }
                }
            }
        })
        res.status(200).json({ message: "User updated" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        await prisma.user.delete({
            where: {
                id: String(id)
            }
        })
        res.status(200).json({ message: "User deleted" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}