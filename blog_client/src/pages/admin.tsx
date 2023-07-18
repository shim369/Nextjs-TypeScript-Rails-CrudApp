import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'
import { Post } from '@/types'
import axios from "axios"
import { useRouter } from 'next/router'

type Props = {
  posts: Post[];
};

export default function Admin({ posts }: Props) {
  const router = useRouter();

  const handleDelete = async (postId: string) => {
    try {
      await axios.delete(`http://localhost:3001/api/v1/posts/${postId}`);
      router.reload();
    } catch (error) {
      alert("削除に失敗しました")
    }
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Link href="/createPost" className={styles.createButton}>Create Post</Link>
        <div>
          {posts.map((post: Post) => (
            <div key={post.id} className={styles.postCard}>
              <Link href={`posts/${post.id}`} className={styles.postCardBox}>
                <h2>{post.title}</h2>
              </Link>
              <p>{ new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(post.created_at))}</p>
              <p>{post.content}</p>
              <Link href={`/editPost/${post.id}`}>
                <button className={styles.editButton}>Edit</button>
              </Link>
              <button className={styles.deleteButton}
                onClick={() => handleDelete(post.id)}
              >
                Delete</button>
            </div>
          ))}
        </div>
           
      </main>
    </>
  )
}

export async function getStaticProps() {
    const res = await fetch("http://localhost:3001/api/v1/posts");
    const posts = await res.json();
  
    return {
      props: {
        posts,
      },
      revalidate: 60 * 60 * 24,
    }
}