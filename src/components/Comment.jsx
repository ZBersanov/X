'use client'

import { app } from "@/firebase"
import { getFirestore, doc, setDoc, onSnapshot, serverTimestamp, deleteDoc, collection } from "firebase/firestore"
import { HiDotsHorizontal, HiHeart, HiOutlineHeart } from "react-icons/hi"
import { signIn, useSession } from "next-auth/react"
import { useState, useEffect } from "react"


export default function Comment({comment, commentId, originalPostId}) {
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState([])
  const db = getFirestore(app)
  const {data: session} = useSession()

  const likePost = async () => {
    if (session) {
      if (isLiked) {
        await deleteDoc(doc(db, "posts", originalPostId, "comments", commentId, "likes", session?.user.uid))
      } else {
        await setDoc(doc(db, "posts", originalPostId, "comments", commentId, "likes", session.user.uid), {
          username: session.user.name,
          timestamp: serverTimestamp()
        })
      }
    } else {
      signIn()
    }
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts", originalPostId, "comments", commentId, "likes"), (snapshot) => {
      setLikes(snapshot.docs)
    })

    return () => unsubscribe()
  }, [db])

  useEffect(() => {
    setIsLiked(
      likes.findIndex((like) => like.id === session?.user?.uid) !== -1
    )
  }, [likes])

  return (
    <div className='flex p-3 border-b border-gray-200 hover:bg-gray-50 pl-10'>
    <img src={comment?.userImg} alt="#" className="w-9 h-9 rounded-full mr-4" />
    <div className='flex-1'>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 whitespace-nowrap">
          <h4 className="font-bold text-sm truncate">{comment?.name}</h4>
          <span className="text-xs truncate">@{comment?.username}</span>
        </div>
        <HiDotsHorizontal className="text-sm"/>
      </div>
        <p className="text-gray-800 text-xs my-3">{comment?.comment}</p> 
        <div className="flex items-center">
          {isLiked
            ? (
              <HiHeart onClick={likePost} className="w-8 h-8 text-red-600 rounded-full cursor-pointer transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100" />
            )
            : (
              <HiOutlineHeart onClick={likePost} className="w-8 h-8 rounded-full cursor-pointer transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100" />
            )}
          {likes.length > 0 && <span className={`text-xs ${isLiked && 'text-red-600'}`}>{likes.length}</span>}
        </div> 
    </div>
  </div>
  )
}
