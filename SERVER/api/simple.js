module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Content-Type', 'application/json')
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  
  try {
    const response = {
      message: "Simple API Working!",
      status: "success",
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      query: req.query || {},
      env: process.env.NODE_ENV || 'development'
    }
    
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    })
  }
}
