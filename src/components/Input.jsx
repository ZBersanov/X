'use client'

import { useSession } from "next-auth/react"
import { HiOutlinePhotograph } from "react-icons/hi"
import { useEffect, useRef, useState } from "react"
import { app } from "@/firebase"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import {addDoc, collection, getFirestore, serverTimestamp} from 'firebase/firestore'

const Input = () => {
  const { data: session } = useSession()
  const imagePickRef = useRef(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [imageFileUploading, setImageFileUploading] = useState(false)
  const [text, setText] = useState('')
  const [postLoading, setPostLoading] = useState(false)
  const db = getFirestore(app)
  
  const addImageToPost = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setImageFileUrl(URL.createObjectURL(file))
    }
  }

  
  useEffect(() => {
    if (selectedFile) {
      uploadImageToStorage()
    }
  }, [selectedFile])
  
  const uploadImageToStorage = () => {
    setImageFileUploading(true)
    const storage = getStorage(app)
    const fileName = new Date().getTime() + '-' + selectedFile.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, selectedFile)
    
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done')
      },
      (error) => {
        console.error('Upload failed', error)
        setImageFileUploading(false)
        setImageFileUrl(null)
        setSelectedFile(null)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL)
          setImageFileUploading(false)
        })
      }
    )
  }

  const handleSubmit = async (e) => {
    setPostLoading(true)
    const docRef = await addDoc(collection(db, 'posts'), {
      uid: session.user.uid,
      name: session.user.name,
      username: session.user.username,
      text,
      profileImg: session.user.image,
      image: imageFileUrl,
      timestamp: serverTimestamp(),
    })
    setPostLoading(false)
    setText('')
    setSelectedFile(null)
    setImageFileUrl(null)
  }

  if (!session) return null

  return (
    <div className="flex border-b border-gray-200 p-3 space-x-3 w-full">
      <img 
        src={session.user.image} 
        alt={session.user.name} 
        className="w-11 h-11 rounded-full cursor-pointer hover:brightness-95"
      />
      <div className="w-full divide-y divide-gray-200">
        <textarea 
          className="border-none outline-none w-full tracking-wide min-h-[50px] text-gray-700" 
          placeholder="What's happening" 
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
        >
        </textarea>
        {
          selectedFile && (
            <img src={imageFileUrl} alt="img" className={`w-full max-h-[250px] object-cover cursor-pointer ${imageFileUploading ? 'animate-pulse' : ''}`} />
          )
        }
        <div className="flex items-center justify-between pt-2">
          <HiOutlinePhotograph onClick={() => imagePickRef.current.click()} className="w-10 h-10 p-2 text-sky-500 hover:bg-sky-100 rounded-full cursor-pointer" />
          <input type="file" ref={imagePickRef} accept="image/*" onChange={addImageToPost} hidden />
          <button 
            onClick={handleSubmit}
            disabled={text.trim() === '' || imageFileUploading || postLoading}
            className="bg-blue-400 text-white rounded-full px-4 py-1 font-bold shadow-md hover:brightness-95 disabled:opacity-50">Post</button>
        </div>
      </div>
    </div>
  )
}

export default Input
