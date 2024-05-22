'use client'

import { useRecoilState } from "recoil"
import { modalState, postIdState } from "@/atom/modalAtom"
import Modal from 'react-modal'
import { HiX } from "react-icons/hi"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { app } from "@/firebase"
import {serverTimestamp, addDoc, collection, doc, getFirestore, onSnapshot } from "firebase/firestore"
import { useRouter } from "next/navigation"


const CommentModal = () => {
  const [open, setOpen] = useRecoilState(modalState)
  const { data: session } = useSession()
  const [postId, setPostId] = useRecoilState(postIdState)
  const [post, setPost] = useState({})
  const [input, setInput] = useState('')
  const db = getFirestore(app)
  const router = useRouter()
  

  useEffect(() => {
    if (postId) {
      const postRef = doc(db, 'posts', postId)
      const unsubscribe = onSnapshot(
        postRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setPost(snapshot.data())
          } else {
            console.log('No such document!')
          }
        }
      )
      return () => unsubscribe()
    }
  }, [postId])


  const sendComment = async () => {
    addDoc(collection(db, 'posts', postId, 'comments'), {
      name: session.user.name,
      username: session.user.username,
      userImg: session.user.image,
      comment: input,
      timestamp: serverTimestamp()
    }).then(() => {
      setOpen(false)
      setInput('')
      router.push(`/posts/${postId}`)
    }).catch(error => {
      console.log(error)
    })
  }

  if (!session) return null
  

  return (
    <div>
      {open && (
        <Modal
          isOpen={open}
          onRequestClose={() => setOpen(false)}
          ariaHideApp={false}
          className='max-w-lg w-[90%] absolute top-24 left-[50%] translate-x-[-50%] bg-white border-2 border-gray-200 rounded-xl shadow-md'
        >
          <div className="p-4">
            <div className="border-b border-gray-200 py-2 px-1.5">
              <HiX 
                className="text-2xl text-gray-700 p-1 hover:bg-gray-200 rounded-full cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <div className="p-2 flex items-center space-x-1 relative">
              <span className="w-0.5 h-full z-[-1] absolute left-8 top-11 bg-gray-200" />
              <img src={post?.profileImg} alt="#" className="w-11 h-11 cursor-pointer rounded-full mr-4" />
              <h4 className="font-bold sm:text=[16px] text-[15px] hover:underline truncate">{post?.name}</h4>
              <span className="text-sm sm:text-[15px] truncate">@{post?.username}</span>
            </div>
            <p className="text-gray-500 text-[15px] sm:text-[16px] ml-16 mb-2">{post?.text}</p>
            <div className="flex p-3 space-x-3">
              <img src={session?.user?.image} alt="#" className="w-11 h-11 cursor-pointer rounded-full hover:brightness-95" />
              <div className="w-full divide-y divide-gray-200">
                <div>
                  <textarea 
                    placeholder="Write a comment..."
                    className="w-full border-none outline-none tracking-wide min-h-[50px] text-gray-700 placeholder:text-gray-500"
                    rows='2'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex items-center justify-end pt-2.5">
                  <button
                    onClick={sendComment}
                    disabled={input.trim() === ''}
                    className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                  >Reply</button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default CommentModal
