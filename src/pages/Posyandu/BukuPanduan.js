import React from 'react'
import { forwardRef } from 'react'

const BukuPanduan = forwardRef((props, ref) => {
  return (
    <>
        <div ref={ref}>
            <h1>Buku Panduan</h1>
        </div>
    </>
  )
})

export default BukuPanduan
