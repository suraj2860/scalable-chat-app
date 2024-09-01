import { faComments } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const DefaultChatBox = () => {
    return (
        <div className='flex flex-col h-[629.5px] bg-gray-300 dark:bg-black'>
            <div className="h-12 border-b border-black bg-gray-800 text-white dark:border-white flex items-center pl-6">
                <h1 className='text-lg font-semibold'>Chat</h1>
            </div>
            <div className='flex-grow flex flex-col items-center justify-center p-4'>
                <FontAwesomeIcon icon={faComments} className='text-6xl mb-4 text-gray-500' />
                <p className='text-xl font-medium text-gray-600 dark:text-gray-400'>
                    Select a user to start chatting
                </p>
            </div>
        </div>
    )
}

export default DefaultChatBox   