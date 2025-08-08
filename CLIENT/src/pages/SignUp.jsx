import React from 'react'
import { SignUp, SignedIn, SignedOut } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'

const SignUpPage = () => {
  return (
    <>
      <SignedIn>
        <Navigate to='/' replace />
      </SignedIn>
      <SignedOut>
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
          <SignUp path='/sign-up' routing='path' />
        </div>
      </SignedOut>
    </>
  )
}

export default SignUpPage
