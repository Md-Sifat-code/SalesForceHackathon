import React from 'react'
import { Outlet } from 'react-router-dom'

function Auth_Layout() {
  return (
    <section>
        <div>
            <Outlet/>
        </div>
    </section>
  )
}

export default Auth_Layout