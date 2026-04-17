import { Router } from 'express';
import * as postController from '../modules/communityPost/communityPost.controller';
import { auth } from '../middlewares/auth';
import { z } from 'zod';
import { validate } from '../middlewares/validate';

const router = Router();

const postSchema = z.object({
  body: z.object({
    postContent: z.string().min(1, 'Post content cannot be empty'),
  }),
});

/**
 * @swagger
 * /community-posts:
 *   get:
 *     summary: Get all posts
 *     tags: [CommunityPosts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of posts
 */
router.get('/', postController.getPosts);

/**
 * @swagger
 * /community-posts:
 *   post:
 *     summary: Create a post
 *     tags: [CommunityPosts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postContent:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created
 */
router.post('/', auth('CUSTOMER', 'VENDOR', 'ADMIN'), validate(postSchema), postController.createPost);

/**
 * @swagger
 * /community-posts/{id}:
 *   get:
 *     summary: Get a post
 *     tags: [CommunityPosts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Post retrieved
 */
router.get('/:id', auth('CUSTOMER', 'VENDOR', 'ADMIN'), postController.getPost);

/**
 * @swagger
 * /community-posts/{id}:
 *   patch:
 *     summary: Update a post
 *     tags: [CommunityPosts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postContent:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated
 */
router.patch('/:id', auth('CUSTOMER', 'VENDOR', 'ADMIN'), validate(postSchema), postController.updatePost);

/**
 * @swagger
 * /community-posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [CommunityPosts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Post deleted
 */
router.delete('/:id', auth('CUSTOMER', 'VENDOR', 'ADMIN'), postController.deletePost);

export default router;
