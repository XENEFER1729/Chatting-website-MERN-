import React from 'react'
import Navbar from './Navitems/Navbar'
import { motion } from 'motion/react'
import Home_middle from './Home_middle'

export default function Home_main() {

    return (
        <div>
            <div>
                <Navbar></Navbar>
            </div>
            <div>
                <Home_middle/>
            </div>

        </div>
    )
}
