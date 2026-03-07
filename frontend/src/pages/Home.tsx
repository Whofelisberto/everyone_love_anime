import Footer from "../Components/Footer"
import Header from "../Components/Header"
import PostList from "../Components/PostList"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <PostList />
      </main>
      <Footer />
    </div>
  )
}
