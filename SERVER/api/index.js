// Simple Vercel serverless function for testing
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    // Simple response for testing
    if (req.url === '/' || req.url === '') {
      return res.status(200).json({
        message: "Hotel Booking API is working!",
        status: "success",
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url
      })
    }

    if (req.url === '/api' || req.url === '/api/') {
      return res.status(200).json({
        message: "API Test Endpoint",
        status: "success",
        endpoints: ['/api/user', '/api/hotels', '/api/rooms', '/api/bookings']
      })
    }

    // 404 for other routes for now
    return res.status(404).json({
      success: false,
      message: `Route ${req.url} not found`,
      availableRoutes: ['/', '/api']
    })

  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
}
