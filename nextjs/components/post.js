import Link from 'next/link'

export default function Post(props) {
  const { post, author } = props
  const { title,
    titleHash,
    summary,
    createdAt } = post
  const dispCreatedAt = new Date(createdAt).toUTCString()

return (
    <div className='row'>
      <div className='col col-1' /> 
      <div className='col col-10'>
        <Link href={{ pathname: '/post',
                      query: { titleHash }}} >
          <div className='card'>
            <div className='card-body'>
              <h5 className='card-title'>{ title }</h5>
              <em>created { dispCreatedAt }</em> 
              <p className='card-text'>{ summary }</p>
            </div>
          </div>
        </Link>
      </div>
      <div className='col col-1' /> 
    </div>
  )
}
