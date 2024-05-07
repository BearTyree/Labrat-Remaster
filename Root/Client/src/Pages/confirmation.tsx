function confirmation() {
    return (
        <div>
            <div className="flex items-center justify-center h-screen bg-gradient-to-r from-cyan-500 to-blue-500">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                    <h1 className="text-xl font-bold text-center mb-6">Login</h1>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                            <input type="text" id="username" name="username" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" id="password" name="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
                        </div>
                        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign In</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default confirmation;