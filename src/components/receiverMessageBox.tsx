import React from 'react'

const ReceiverMessageBox = ({message}: {message: string}) => {
    return (
        <div className='max-w-2xl text-sm border border-black dark:border-white rounded-t-xl rounded-r-xl px-4 py-2 block break-words bg-gray-800 text-white dark:bg-gray-300 dark:text-black'>
            {message}
        </div>
    )
}

export default ReceiverMessageBox