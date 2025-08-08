module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')
  
  res.status(200).json({
    message: "Hotel Booking API is working!",
    status: "success",
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  })
}
