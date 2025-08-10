import { useState } from 'react'
import '../styles/Header.css'

function Header() {
  const [count, setCount] = useState(0)

  return (
      <div className='header'>
        <header>
            <h1>Note maker</h1>
        </header>
      </div>
  )
}

export default Header;

