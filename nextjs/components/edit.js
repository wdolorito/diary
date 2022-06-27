export default function Edit(props) {
  const { action, name } = props

  return (
    <button className='btn btn-info' name='edit' onClick={ action }>{ 'edit ' + name }</button>
  )
}
