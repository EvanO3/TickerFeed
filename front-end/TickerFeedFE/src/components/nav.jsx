import React from 'react'

function nav({page, prop1, prop2, prop3}) {
  return (
    <nav className="bg-gray-600">
      <div className="mx-auto max-w-7xl px-2 sm:px-2 lg:px-8">
        <div className="relative flex h-12 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/**Mobile buttons */}
            <button
              type="button"
              className="relative inline-flex items-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open Main</span>

              <svg
                className="block size-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />{" "}
              </svg>

              <svg
                className="hidden size-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
                <img className="h-8 w-auto" src="/" alt="TickerFeed" />
            </div>

            <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                    {/**Conditionally render these in the header only if the prop is passed */}
                    {page &&(
                        <a href="#" className="rounded-md bg-gray-800 px-3 py-2 text-sm font-medium text-white" aria-current="page">{page}</a>

                    )}

                     {prop1 &&(
                     <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">{prop1}</a>
                    )}

                    {prop2 &&(

                    <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">{prop2}</a>

                    )}

                    {prop3 &&(
                 <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">{prop3}</a>
                    )}
                     
                </div>
            </div>
          </div>



        </div>
      </div>
    </nav>
  );
}

export default nav