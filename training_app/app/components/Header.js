import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <header>
      <div className="header_box">
      <Link href={"/user"}>User</Link>
        <h1>Task managment sistem</h1>
      </div>
        <nav>
            <Link href={"/"}>Home</Link>
            <Link href={"/loging"}>Login</Link>
            <Link href={"/registration"}>Sign in</Link>
        </nav>
    </header>
  )
}

export default Header