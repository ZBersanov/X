'use client'

import { HiOutlineChat, HiOutlineHeart, HiOutlineTrash } from "react-icons/hi"

const Icons = () => {
  return (
    <div className="flex justify-start gap-5 p-2 text-gray-500">
      <HiOutlineChat className="w-8 h-8 rounded-full cursor-pointer transition duration-500 ease-in-out p-2 hover:text-sky-500 hover:bg-sky-100"/>
      <HiOutlineHeart className="w-8 h-8 rounded-full cursor-pointer transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100"/>
      <HiOutlineTrash className="w-8 h-8 rounded-full cursor-pointer transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100"/>
    </div>
  )
}

export default Icons