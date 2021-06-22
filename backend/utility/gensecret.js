// App secret generator
//  from https://stackoverflow.com/questions/27977525/how-do-i-write-a-named-arrow-function-in-es2015
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

console.log(uuidv4())
