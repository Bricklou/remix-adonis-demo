import { createPostValidator } from '#validators/create_post'
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Form, json, redirect, useActionData, useLoaderData } from '@remix-run/react'
import { errors } from '@vinejs/vine'
import { SendHorizonalIcon } from 'lucide-react'

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const postService = await context.make('post_service')

  const posts = await postService.findAll()

  return json({
    posts: posts.map((post) => ({
      id: post.id,
      author: post.author,
      content: post.content,
    })),
  })
}

export default function Index() {
  const { posts } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome to Remix</h1>

      <Form method="POST" className="max-w-screen-md w-full mx-auto flex flex-col gap-4">
        <div className="relative flex flex-col gap-1">
          <label htmlFor="author" className="text-sm uppercase text-gray-700">
            Author
          </label>
          <input
            name="author"
            id="author"
            type="text"
            className="p-2 rounded-md border border-gray-600"
            placeholder="Author"
          />
          {actionData?.errors?.author && (
            <span className="text-red-500">{actionData.errors.author}</span>
          )}
        </div>

        <div className="relative flex flex-col gap-1">
          <label htmlFor="message" className="text-sm uppercase text-gray-700">
            Message
          </label>
          <textarea
            className="p-2 rounded-md border border-gray-600"
            name="content"
            id="message"
            placeholder="Your content..."
          ></textarea>
          {actionData?.errors?.content && (
            <span className="text-red-500">{actionData.errors.content}</span>
          )}
        </div>

        <button className="bg-sky-600 hover:bg-sky-400 px-4 py-2 text-white rounded-md shadow-sm inline-flex gap-2 items-center justify-center">
          <SendHorizonalIcon className="size-5" />
          Send
        </button>
      </Form>

      <section>
        <ul className="list-disc">
          {posts.map((post) => (
            <li key={post.id}>
              <div className="flex flex-col">
                <span className="text-gray-700 font-semibold">{post.author}</span>
                <p>{post.content}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export const action = async ({ context }: ActionFunctionArgs) => {
  const { http } = context

  try {
    const data = await http.request.validateUsing(createPostValidator)
    const postService = await context.make('post_service')

    await postService.createPost(data.author, data.content)

    return redirect('/')
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      const errors: Record<string, string> = error.messages.reduce(
        (acc, current) => {
          acc[current.field] = current.message
          return acc
        },
        {} as Record<string, string>
      )
      return json({ errors })
    }
  }
}
