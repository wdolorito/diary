import dbConnect from './dbConnect'
import Static from './models/Static'

const getStatics = () => {
  return new Promise(async (res, rej) => {
    await dbConnect()

    try {
      const results = await Static.find({})
                                  .select('section -_id')
      res(results)
    } catch(err) {
      rej(err)
    }
  })
}

const createStatic = (section, body) => {
  return new Promise(async (res, rej) => {
    await dbConnect()

    const page = new Static({
      section,
      body
    })
  
    try {
      await page.save()
      res(section + ' saved')
    } catch(err) {
      rej('unable to post ' + err)
    }
  })
}

const getStatic = section => {
  return new Promise(async (res, rej) => {
    await dbConnect()

    try {
      const result = await Static.findOne({ section })
                                  .select('-_id')
      res(result)
    } catch(err) {
      rej(err)
    }
  })
}

const updateStatic = (section, set) => {
  return new Promise(async (res, rej) => {
    await dbConnect()

    try {
      await Static.findOneAndUpdate({ section }, { $set: set })
      res(true)
    } catch(err) {
      rej('Unable to update ' + section + ' section ' + err)
    }
  })
}

const deleteStatic = section => {
  return new Promise(async (res, rej) => {
    await dbConnect()

    try {
      await Static.findOneAndDelete({ section })
      res(true)
    } catch(err) {
      rej('Unable to delete section ' + section + ' ' + err)
    }
  })
}

const staticutils = {
                      getStatics,
                      createStatic,
                      getStatic,
                      updateStatic,
                      deleteStatic
                    }

export default staticutils
