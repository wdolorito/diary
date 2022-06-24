import Link from 'next/link'

export default function Post(props) {
  const { post, author } = props
  const { title,
    friendlyURL,
    summary,
    createdAt } = post
  const dispCreatedAt = new Date(createdAt).toUTCString()

return (
    <div className='row'>
      <Link href={{ pathname: '/post',
                    query: { title: friendlyURL,
                             post: JSON.stringify(post),
                             author: author }}} >
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{ title }</h5>
            <em>{ dispCreatedAt }</em> 
            <p class="card-text">{ summary }</p>
          </div>
        </div>
      </Link>
    </div>
  )
}
