import React from 'react'
import { Outlet } from 'react-router-dom'

function Main_Layout() {
  return (
    <div>
        <Outlet/>
    </div>
  )
}

export default Main_Layout