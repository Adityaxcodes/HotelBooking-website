module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  
  if (req.method === 'GET') {
    res.status(200).json({
      message: "Hotel Booking API is working!",
      status: "success",
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url
    })
  } else {
    res.status(405).json({
      success: false,
      message: "Method not allowed"
    })
  }
}
