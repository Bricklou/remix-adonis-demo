import Post from '#models/post'
import { inject } from '@adonisjs/core'

@inject()
export default class PostService {
  async createPost(author: string, content: string): Promise<Post> {
    return await Post.create({ author, content })
  }

  async deletePost(post: Post): Promise<void> {
    await post.delete()
  }

  async findAll(): Promise<Post[]> {
    return await Post.query().orderBy('created_at')
  }
}
