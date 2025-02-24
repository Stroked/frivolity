import { useState } from 'react'
import { supabase } from './supabaseClient'

import { Auth } from '@supabase/auth-ui-react'

// import {
//   // Import predefined theme
//   ThemeSupa,
// } from '@supabase/auth-ui-shared'

export default function LoginAuth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (email: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: import.meta.env.VITE_PUBLIC_URL,
        },
      })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row flex flex-center">
      <Auth
    supabaseClient={supabase}
    providers={['google']}
    // appearance={{ theme: ThemeSupa }}
  />
      <div className="col-6 form-widget">
        <h1 className="header">Supabase React</h1>
        <div>
          <input
            className="inputField"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault()
              handleLogin(email)
            }}
            className={'button block'}
            disabled={loading}
          >
            {loading ? <span>Loading</span> : <span>Send magic link</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
