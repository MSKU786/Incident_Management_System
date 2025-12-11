import React from 'react'

export default function Navbar({setPage, token}) {
  if (!token) {
    return null;
  }

  return (
    <div className='mb-3'>
      <button className='btn btn-primary' onClick={() => setPage("create")}>
        Create Incident
      </button>
      <button className='btn btn-secondary' onClick={() => setPage("list")}>
        Incident List
      </button>
    </div>
  )
}