import Comments from "@/components/Comments"
import Post from "@/components/Post"
import { app } from "@/firebase"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import Link from "next/link"
import { HiArrowLeft } from "react-icons/hi"


export default async function Posts({params}) {
  const db = getFirestore(app)
  let data = {} 
  const querySnapshot = await getDoc(doc(db, "posts", params.id))
  data = {...querySnapshot.data(), id: querySnapshot.id}


  return (
    <div className="max-w-xl mx-auto border-r border-l min-h-screen">
      <div className="flex items-center space-x-2 py2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
        <Link href={'/'} className="hover:bg-gray-100 p-2 rounded-full">
          <HiArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="sm:text-lg">Back</h2>
      </div>
      <Post post={data} id={data.id} />
      <Comments id={params.id}/>
    </div>
  )
}
