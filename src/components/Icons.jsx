'use client'

import { HiOutlineChat, HiOutlineHeart, HiOutlineTrash, HiHeart } from "react-icons/hi"
import { signIn, useSession } from "next-auth/react"
import { app } from "@/firebase"
import { doc, getFirestore, setDoc, serverTimestamp, onSnapshot, collection, deleteDoc } from "firebase/firestore"
import { useEffect, useState } from "react"



const Icons = ({id}) => {
  const {data: session} = useSession()
  const db = getFirestore(app)
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState([])
  const likePost = async () => {
    if (session) {
      if(isLiked) {
        await deleteDoc(doc(db, "posts", id, "likes", session?.user.uid))
      } else {
        await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
          username: session.user.name,
          timestamp: serverTimestamp()
        })
      }
    } else {
      signIn()
    }
  }

  useEffect(() => {
    onSnapshot(collection(db, "posts", id, "likes"), (snapshot) => {
      setLikes(snapshot.docs)
    })
  }, [db])

  useEffect(() => {
    setIsLiked(
      likes.findIndex(like => like.id === session?.user?.uid) !== -1 
    )
  }, [likes])

  return (
    <div className="flex justify-start gap-5 p-2 text-gray-500">
      <HiOutlineChat className="w-8 h-8 rounded-full cursor-pointer transition duration-500 ease-in-out p-2 hover:text-sky-500 hover:bg-sky-100"/>
      <div className="flex items-center">
      {isLiked
      ? (
        <HiHeart onClick={likePost} className="w-8 h-8 text-red-600 rounded-full cursor-pointer transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100"/>
        
      )
      : (
        
        <HiOutlineHeart onClick={likePost} className="w-8 h-8 rounded-full cursor-pointer transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100"/>
      )}
      {likes.length > 0 && <span className={`text-xs ${isLiked && 'text-red-600'}`}>{likes.length}</span>}
      </div>
      <HiOutlineTrash className="w-8 h-8 rounded-full cursor-pointer transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100"/>
    </div>
  )
}

export default Icons