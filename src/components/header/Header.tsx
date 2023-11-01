import {signIn, signOut, useSession} from "next-auth/react";
import Image from "next/image";

export const Header = () => {
    const {data: sessionDta} = useSession()
    return (
        <div className='navbar bg-white text-primary-content border-2'>
            <div className='flex-1 pl-5 text-3xl font-bold'>
               <Image src={'/notetaker-removebg-preview.png'} alt={'Notetaker Logo'} width={48} height={48}/>
            </div>
            <div className='flex-none gap-2'>
                <div className='dropdown-end dropdown'>
                    {sessionDta?.user ? (
                        <label
                            tabIndex={0}
                            className='btn-ghost btn-circle avatar btn'
                            onClick={() => void signOut()}
                        >
                            <div className='w-10 rounded-full'>
                                <img
                                    src={sessionDta.user.image ?? ""}
                                    alt={sessionDta.user.name ?? ""}
                                />
                            </div>
                        </label>
                    ) : (
                        <button className='btn-primary rounded-btn btn' onClick={() => void signIn()}>Sign In</button>
                    )}
                </div>
            </div>
        </div>
    )
}