import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getComments = async (req, res) => {
    try {
        const comments = await prisma.comment.findMany()
        res.status(200).json({ comments })
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
}

export const getCommentById = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await prisma.comment.findUnique({
            where: {
                id: String(id),
            },
        });
        res.status(200).json({ comment });
    } catch (error) {
        res.status(500).json(error);
    }
}

export const createComment = async (req, res) => {
    try {
        const { text, postId } = req.body;
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) return res.sendStatus(401);
        const user = await prisma.user.findUnique({
            where: {
                refreshToken: refreshToken
            }
        })

        if (!user) return res.sendStatus(403);

        const comment = await prisma.comment.create({
            data: {
                text,
                user: {
                    connect: {
                        id: user.id,
                    },
                },
                post: {
                    connect: {
                        id: postId,
                    },
                },
            },
        });

        res.status(201).json({ message: 'Komentar berhasil dibuat', comment });
    } catch (error) {
        res.status(500).json(error);
    }
}

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) return res.sendStatus(401);
        const user = await prisma.user.findUnique({
            where: {
                refreshToken: refreshToken
            }
        })

        if (!user) return res.sendStatus(403);

        const commentId = await prisma.comment.findUnique({
            where: {
                id: String(id),
            },
        });

        if (user.id !== commentId.userId || user.roleId !== 1 ) return res.sendStatus(401)

        const comment = await prisma.comment.update({
            where: {
                id: String(id),
            },
            data: {
                text,
            },
        });

        res.json({ message: 'Komentar berhasil diupdate', comment });
    } catch (error) {
        res.status(500).json(error);
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) return res.sendStatus(401);
        const user = await prisma.user.findUnique({
            where: {
                refreshToken: refreshToken
            }
        })

        if (!user) return res.sendStatus(403);

        const commentId = await prisma.comment.findUnique({
            where: {
                id: String(id),
            },
        });

        if (user.id !== commentId.userId || user.roleId !== 1 ) return res.sendStatus(401)

        await prisma.comment.delete({
            where: {
                id: String(id),
            },
        });

        res.sendStatus(200);
    } catch (error) {
        res.status(500).json(error);
    }
}