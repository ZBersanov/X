import Link from "next/link"
import { HiDotsHorizontal } from "react-icons/hi"
import Icons from "./Icons"

const Post = ({post, id}) => {
  return (
    <div className='flex p-3 border-b border-gray-200 hover:bg-gray-50'>
      <img src={post?.profileImg} alt="#" className="w-11 h-11 rounded-full mr-4" />
      <div className='flex-1'>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-sm truncate">{post?.name}</h4>
            <span className="text-xs truncate">@{post?.username}</span>
          </div>
          <HiDotsHorizontal className="text-sm"/>
        </div>

        <Link href={`/posts/${id}`}>
          <p className="text-gray-800 text-sm my-3">{post?.text}</p>
        </Link>

        <Link href={`/posts/${id}`}>
          <img src={post?.image} className="rounded-2xl mr-2 cursor-pointer" />
        </Link>
        <Icons id={id}/>
      </div>
    </div>
  )
}

export default Post