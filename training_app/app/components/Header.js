import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <header>
        <h1>Treining header</h1>
        <nav>
            <Link href={"/"}>Home</Link>
            <Link href={"/loging"}>Login</Link>
            <Link href={"/registration"}>Sign in</Link>
        </nav>
    </header>
  )
}

export default Header