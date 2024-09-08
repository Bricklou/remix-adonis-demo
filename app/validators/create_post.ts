import vine from '@vinejs/vine'

export const createPostValidator = vine.compile(
  vine.object({
    author: vine.string().trim().minLength(4),
    content: vine.string().trim().escape(),
  })
)
