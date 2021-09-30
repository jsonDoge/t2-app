import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>T2</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to TokenToken
        </h1>

        <p className="mt-3 text-2xl">
          It`s a... token ¯\_(ツ)_/¯
        </p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <div className="p-6 mt-6 text-left border w-full rounded-xl">
            <h3 className="text-2xl font-bold">Graph here</h3>
            <p className="mt-4 text-xl">
              Yes veri candle, also many gren
            </p>
          </div>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        Powered by... electricity ¯\_(ツ)_/¯
      </footer>
    </div >
  )
}

export default Home
