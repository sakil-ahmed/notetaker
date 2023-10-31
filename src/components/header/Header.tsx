import {signIn, signOut, useSession} from "next-auth/react";

export const Header = () => {
    const {data: sessionDta} = useSession()
    return (
        <div className='navbar bg-primary text-primary-content'>
            <div className='flex-1 pl-5 text-3xl font-bold'>
                {sessionDta?.user?.name ? `Notes for ${sessionDta.user.name}` : ""}
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
                        <button className='btn-ghost rounded-btn btn' onClick={() => void signIn()}>Sign In</button>
                    )}
                </div>
            </div>
        </div>
    )
}