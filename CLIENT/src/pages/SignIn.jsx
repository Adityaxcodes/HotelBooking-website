import React from 'react'
import { SignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'

const SignInPage = () => {
  return (
    <>
      <SignedIn>
        <Navigate to='/' replace />
      </SignedIn>
      <SignedOut>
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
          <SignIn path='/sign-in' routing='path' />
        </div>
      </SignedOut>
    </>
  )
}

export default SignInPage
