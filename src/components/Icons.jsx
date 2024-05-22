'use client'

import { HiOutlineChat, HiOutlineHeart, HiOutlineTrash, HiHeart } from "react-icons/hi"
import { signIn, useSession } from "next-auth/react"
import { app } from "@/firebase"
import { doc, getFirestore, setDoc, serverTimestamp, onSnapshot, collection, deleteDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { modalState, postIdState } from "@/atom/modalAtom"

const Icons = ({ id, uid }) => {
  const { data: session } = useSession()
  const db = getFirestore(app)
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState([])
  const [open, setOpen] = useRecoilState(modalState)
  const [postId, setPostId] = useRecoilState(postIdState)
  const [comments, setComments] = useState([])

  const likePost = async () => {
    if (session) {
      if (isLiked) {
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
    const unsubscribe = onSnapshot(collection(db, "posts", id, "likes"), (snapshot) => {
      setLikes(snapshot.docs)
    })

    return () => unsubscribe()
  }, [db])

  useEffect(() => {
    setIsLiked(
      likes.findIndex((like) => like.id === session?.user?.uid) !== -1
    )
  }, [likes])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'posts', id, 'comments'),
      (snapshot) => {
        setComments(snapshot.docs)
      }
    )
    return () => unsubscribe()
  }, [db, id])

  const deletePost = async () => {
    if (window.confirm("Are you sure")) {
      if (session?.user?.uid === uid) {
        try {
          await deleteDoc(doc(db,'posts', id))
          console.log("Deleted")
          window.location.reload()
        } catch (error) {
          console.error("ERROR: ", error)
        }
      } else {
        alert("Ха-ха-ха, хотел удалить да? ты не авторизован, бомж, иди в мусор")
      }
    }
  }

  return (
    <div className="flex justify-start gap-5 p-2 text-gray-500">
      <div className="flex items-center">
        <HiOutlineChat
          onClick={() => {
            if (!session) {
              signIn()
            } else {
              setOpen(!open)
              setPostId(id)
              console.log('Modal opened')  // Add this line for debugging
            }
          }} className="w-8 h-8 rounded-full cursor-pointer transition duration-500 ease-in-out p-2 hover:text-sky-500 hover:bg-sky-100"
        />
        {
          comments.length > 0 && <span className="text-xs">{comments.length}</span>
        }
      </div>
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
      {session?.user?.uid === uid && (
        <HiOutlineTrash onClick={deletePost} className="w-8 h-8 rounded-full cursor-pointer transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100" />
      )}
    </div>
  )
}

export default Icons
