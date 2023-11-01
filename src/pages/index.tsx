import Head from "next/head";

import {Nunito} from "next/font/google"
import {Header} from "@/components/header/Header";
import React, {useState} from "react";
import {useSession} from "next-auth/react";
import {api, type RouterOutputs} from "@/utils/api";
import {NoteEditor} from "@/components/note/NoteEditor";
import {NoteCard} from "@/components/note/NoteCard";

const poppins = Nunito({
    subsets: ['latin'],
    variable: '--font-nunito',
    weight: ['400', '500', '600', '700'],
    display: 'swap'
})

export default function Home() {
    const {data: sessionData} = useSession()
    return (
        <>
            <Head>
                <title>Notetaker</title>
                <meta name="description" content="Generated by create-t3-app"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={`${poppins.className} bg-white w-full h-screen`}>
                <Header/>
                {sessionData?.user === undefined ? <h1>Sign In to continue...</h1> : <Content/>}

            </main>
        </>
    );
}


type Topic = RouterOutputs['topic']['getAll'][0];

const Content: React.FC = () => {
    const {data: sessionData} = useSession()

    const [selectedTopic, SetSelectedTopic] = useState<Topic | null>(null)

    const {data: topics, refetch: refetchTopic} = api.topic.getAll.useQuery(
        undefined,
        {
            enabled: sessionData?.user !== undefined,
            onSuccess: (data) => {
                SetSelectedTopic(selectedTopic ?? data[0] ?? null)
            }
        }
    )

    const createTopic = api.topic.create.useMutation({
        onSuccess: () => {
            void refetchTopic()
        }
    })

    // Note
    const {data: notes, refetch: refetchNotes} = api.note.getAll.useQuery({
            topicId: selectedTopic?.id ?? ""
        },
        {
            enabled: sessionData?.user !== undefined && selectedTopic !== null
        })

    const createNote = api.note.create.useMutation({
        onSuccess: () => {
            void refetchNotes();
        },
    });

    const deleteNote = api.note.delete.useMutation({
        onSuccess: () => {
            void refetchNotes();
        },
    });

    return (
        <div className='mx-5 mt-5 grid grid-cols-4 gap-2'>

            <div className='px-2 scroll-body'>
                <input
                    type='text'
                    placeholder='New Topic'
                    className='input-bordered bg-transparent input input-sm w-full'
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            createTopic.mutate({
                                title: e.currentTarget.value
                            })
                            e.currentTarget.value = ''
                        }
                    }}
                />
                <div className='divider'></div>
                <ul className='menu rounded-box w-full bg-white p-2'>
                    {topics?.map((topic) => {
                        return (
                            <li key={topic.id} className='text-[20px]'>
                                <a href={'#'}
                                   onClick={(e) => {
                                       e.preventDefault()
                                       SetSelectedTopic(topic)
                                   }}
                                >
                                    {topic.title}
                                </a>

                            </li>
                        )
                    })}
                </ul>

            </div>
            <div className='col-span-3 scroll-body'>
                <div>
                    {notes?.map((note) => {
                        return (
                            <div key={note.id}>
                                <NoteCard note={note} onDelete={() => void deleteNote.mutate({id: note.id})}/>
                            </div>
                        )
                    })}

                </div>
                <NoteEditor
                    onSave={({title, content}) => {
                        void createNote.mutate({
                            title,
                            content,
                            topicId: selectedTopic?.id ?? "",
                        });
                    }}
                />
            </div>
        </div>
    )
}