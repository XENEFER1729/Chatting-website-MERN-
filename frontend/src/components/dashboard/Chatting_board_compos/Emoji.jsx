import React, { useState } from 'react';

export default function Emoji({ msg, setMsg }) {
    // List of emojis
    const emojis = [
        '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊',
        '😋', '😎', '😍', '😘', '🥰', '😚', '😗', '😙', '😜', '😝',
        '😛', '🤑', '🤗', '🤩', '🤔', '🤭', '🤫', '🤥', '😌', '😔',
        '😪', '😷', '🤒', '🤕', '🤢', '🤧', '😵', '🤯', '🤠', '😇'
    ];

    // State for search input
    const [search, setSearch] = useState('');

    // Filter emojis based on search
    const filteredEmojis = emojis.filter((emoji) =>
        emoji.includes(search)
    );

    return (
        <div className="emoji-picker absolute bottom-16 backdrop-blur-sm border rounded-md p-2 w-full max-w-md overflow-y-scroll max-h-48 scrollbar-hide">
            {/* Search Input */}
            <div className='w-full bg-inherit mb-2'>
                <input
                    type="text"
                    className='w-full bg-inherit border p-2 rounded'
                    placeholder='Search for Emoji'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} // Update search state
                />
            </div>

            {/* Emoji Grid */}
            <div className="grid grid-cols-5 gap-2">
                {filteredEmojis.map((emoji, index) => (
                    <button
                        key={index}
                        className="text-xl p-2 hover:bg-gray-500 rounded"
                        onClick={() => {
                            // setMsg(prevMsg => prevMsg + emoji);
                            console.log(msg) // Append emoji to the message
                        }}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    );
}
