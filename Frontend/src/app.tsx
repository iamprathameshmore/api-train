import React from 'react'
import { router } from './routes/app-router';
import { RouterProvider } from 'react-router-dom';
// import { HelmetProvider } from 'react-helmet'

export default function App() {
    return (

        <RouterProvider router={router}  />

    )
}
