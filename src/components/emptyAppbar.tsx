import { DarkModeToggle } from "./darkModeToggle";


export const EmptyAppbar = () => {
    return (
        <div className="flex justify-between border-b px-4 h-12">
            <div className="text-2xl ml-32 flex flex-col justify-center dark:text-white text-black">
                Chat-App
            </div>
            <div className="flex flex-col justify-center mr-12">
                <DarkModeToggle />
            </div>
        </div>
    );
}