import React from 'react'

const AuthPanel = () => {
    return (

        <div
            className="relative h-screen bg-cover bg-center"
            style={{ backgroundImage: `url('/assets/signin-background.png')` }}
        >
            <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                <img
                    src={`/assets/logo-white.svg`}
                    height={100}
                    width={100}
                    className="absolute left-8 top-1 h-24 w-24"
                    alt={"Beam logo"}
                />
                <h3 className="mb-10 self-end px-4 text-center text-white">
                    Experience the future of automation with Beam.
                </h3>
            </div>
        </div>
    )
}

export default AuthPanel