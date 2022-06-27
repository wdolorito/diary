export default function Avatar(props) {
  const { avatar, handle } = props

  return (
    <div className='container'>
      <div className='row'>
        <img id='avatar' className='text-center' src={ avatar } alt='avatar'/>
      </div>
      <div className='row'>
        <span className='text-center'>{ handle }</span>
      </div>
    </div>
  )
}
