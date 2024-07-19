import { FC } from 'react'

const BackDrop:FC<{ isOpen: boolean }> = ({ isOpen }) =>
    isOpen
        ? <div className='fixed z-[60] top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.75)]'/>
        : <></>

export default BackDrop