import { useEffect, useState } from "react"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"

export default function Editor(props) {
  const initData = '' || props.data
  const { getData } = props
  const [ loaded, setLoaded ] = useState(false)
  const [ data, setData ] = useState(initData)

  const updateEditor = (event, editor) => {
    const data = editor.getData()
    setData(data)
    getData(data)
  }

  useEffect(() => {
    setLoaded(true)
    return () => {
      setLoaded(false)
    }
  }, [])

  if (loaded) {
    return (
      <CKEditor
        editor={ClassicEditor}
        data={ data }
        onChange={ updateEditor }
      />
    )
  }

  return <h3 className='text-center text-danger'> Editor is loading </h3>
}
