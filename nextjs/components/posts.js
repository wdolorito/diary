import Post from './post'

export default function Posts(props) {
  const { data } = props
  const posts = data.slice(1)

  return (
    <div className='container'>
      {
        posts.map((post, index) => (
          <Post
            key={ index }
            post={ post }
            author={ data[0] }
          />
        ))
      }
    </div>
  )
}
