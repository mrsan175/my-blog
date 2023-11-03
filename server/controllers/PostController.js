import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export const getPosts = async (req, res) => {
    try {
        const data = await prisma.post.findMany({
            include: {
                comment: true,
                user: {
                    select: {
                        username: true,
                        img: true,
                    }
                }
            }
        })
        res.status(200).json({ data })
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
}

export const getPostByCat = async (req, res) => {
    try {
        const cat  = req.query.cat;
        const data = await prisma.post.findMany({
            where: {
                cat: String(cat),
            },
            include: {
                comment: true,
                user: {
                    select: {
                        username: true,
                        img: true,
                    }
                }
            }
        })
        res.status(200).json({ data })
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
}

export const getPostBySlug = async (req, res) => {
    try {
        const {slug} = req.params;

        if (!slug) {
            return res.status(400).json({ error: 'Slug tidak valid' });
        }

        const data = await prisma.post.findUnique({
            where: {
                slug: String(slug),
            },
            include: {
                comment: true,
                user: {
                    select: {
                        username: true,
                        img: true,
                    }
                }
            }
        });

        if (!data) {
            return res.status(404).json({ error: 'Postingan tidak ditemukan' });
        }

        res.status(200).json({data: [data]});
    } catch (error) {
        res.status(500).json(error);
    }
}

export const getPostById = async (req, res) => {
    try {
        const {id} = req.params;
        const data = await prisma.post.findUnique({
            where: {
                id: String(id),
            },
            include: {
                comment: true,
                user: {
                    select: {
                        username: true,
                        img: true,
                    }
                }
            }
        });
        res.status(200).json({data: [data]});
    } catch (error) {
        res.status(500).json(error);
    }
}

export const createPost = async (req, res) => {
    try {
        const { title, content, published, cat, slug, mainImg, tags } = req.body;
        // const tags = tag.split(',')
        const refreshToken = req.cookies._XYZabc123

        if (!refreshToken) return res.sendStatus(401);
        const user = await prisma.user.findUnique({
            where: {
                refreshToken: refreshToken
            }
        })

        if (!user) return res.sendStatus(403);

        if (user.roleId !== 1) return res.sendStatus(401);

        const existingSlug = await prisma.post.findUnique({
            where: {
                slug: String(slug)
            }
        })

        if (existingSlug) return res.status(400).json({ error: 'Slug sudah digunakan' })

        const post = await prisma.post.create({
            data: {
                mainImg,
                title,
                content,
                published,
                slug,
                cat,
                tags,
                user: {
                    connect: {
                        id: String(user.id)
                    },
                }
            },
        });

        res.status(201).json({ message: 'Posting berhasil dibuat', post });
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan saat membuat posting' });
    }
}

export const updatePost = async (req, res) => {
    try {
        const { title, content, published, cat, slug, mainImg, tags } = req.body;
        const { id } = req.params;
        const refreshToken = req.cookies._XYZabc123

        if (!refreshToken) return res.sendStatus(401);
        const user = await prisma.user.findUnique({
            where: {
                refreshToken: refreshToken
            }
        })

        if (!user) return res.sendStatus(403);

        if (user.roleId !== 1) return res.sendStatus(401);

        const post = await prisma.post.update({
            where: {
                id: String(id),
            },
            data: {
                mainImg,
                title,
                content,
                published,
                slug,
                cat,
                tags
            }
        });
        

        res.json({ message: 'Posting berhasil diupdate', post });
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan saat update posting' });
    }
}

export const deletePost = async (req, res) => {
    try {
        const { id, slug } = req.params;
        const refreshToken = req.cookies._XYZabc123

        if (!refreshToken) return res.sendStatus(401);
        const user = await prisma.user.findUnique({
            where: {
                refreshToken: refreshToken
            }
        })

        if (!user) return res.sendStatus(403);

        if (user.roleId !== 1) return res.sendStatus(401);

        await prisma.comment.deleteMany({
            where: {
                postId: String(id)
            }
        })
        
        await prisma.post.delete({
            where: {
                id: String(id),
            },
        });

        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan saat hapus posting' });
    }
}