import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getRoles = async (req, res) => {
    try {
        const roles = await prisma.role.findMany()
        res.status(200).json({ roles })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Terjadi kesalahan saat proses login" })
    }
}