


import './index.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import LoginAuth from './Auth'
import Account from './Account'





function App() {
  const [count, setCount] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))

    supabase.auth.onAuthStateChange((_event, session) => setSession(session))

  }, [])

 



  return (
    <div>
        <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session ? <LoginAuth /> : <Account key={session.user.id} session={session} />}
    </div>
      <div>
        <a href="https://vite.dev" target="_blank">
        </a>
        <a href="https://react.dev" target="_blank">
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
