import prisma from '../../config/prisma';
import { AppError } from '../../utils/AppError';

export const createPost = async (userId: string, data: any) => {
  return await prisma.communityPost.create({
    data: {
      userId,
      postContent: data.postContent,
    },
  });
};

export const getPosts = async (skip: number, limit: number) => {
  const posts = await prisma.communityPost.findMany({
    skip,
    take: limit,
    include: {
      user: { select: { name: true, role: true } },
    },
    orderBy: { postDate: 'desc' },
  });

  const total = await prisma.communityPost.count();
  return { posts, total };
};

export const getPostById = async (id: string) => {
  const post = await prisma.communityPost.findUnique({
    where: { id },
    include: { user: { select: { name: true } } },
  });

  if (!post) throw new AppError(404, 'Post not found');
  return post;
};

export const updatePost = async (userId: string, role: string, id: string, data: any) => {
  const post = await prisma.communityPost.findUnique({ where: { id } });
  
  if (!post) throw new AppError(404, 'Post not found');
  if (post.userId !== userId && role !== 'ADMIN') throw new AppError(403, 'Not authorized');

  return await prisma.communityPost.update({
    where: { id },
    data: { postContent: data.postContent },
  });
};

export const deletePost = async (userId: string, role: string, id: string) => {
  const post = await prisma.communityPost.findUnique({ where: { id } });
  
  if (!post) throw new AppError(404, 'Post not found');
  if (post.userId !== userId && role !== 'ADMIN') throw new AppError(403, 'Not authorized');

  return await prisma.communityPost.delete({ where: { id } });
};
