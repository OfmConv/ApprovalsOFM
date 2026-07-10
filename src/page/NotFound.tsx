function NotFound () {
    return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center text-center p-4">
    
    <div className="w-50 h-50 mx-auto">
        <img src="/oFWop.jpg" alt="Not Found" className="w-full h-full object-contain"/>
    </div>
    
    <div className="mt-8 max-w-md">
       <div className="text-3xl mb-4 font-bold">404 – Page not found</div> 
       <div className="text-lg text-gray-600">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable</div> 
    </div>
    </div>
)
}

export default NotFound;
