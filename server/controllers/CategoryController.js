import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany()
        res.status(200).json({ categories })
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
}