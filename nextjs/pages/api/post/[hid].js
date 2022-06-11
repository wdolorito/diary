export default function handler(req, res) {
  const { hid } = req.query
  res.status(200).json({ slug: hid })
}
