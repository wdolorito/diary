export default function Delete(props) {
  const { action, name } = props

  return (
    <button className='btn btn-danger' name='delete' onClick={ action }>{ 'delete ' + name}</button>
  )
}
