module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')
  
  res.status(200).json({
    message: "Root API Working!",
    status: "success",
    timestamp: new Date().toISOString(),
    vercel: true
  })
}
