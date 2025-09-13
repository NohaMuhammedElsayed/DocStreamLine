import { ArrowLeft, Image as ImageIcon, Sparkle, TextIcon, Video as VideoIcon } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';

const StoryModel = ({ setShowModel, fetchStories }) => {
    const bgColors = ["#0d9488","#4f46e5", "#7c3aed", "#db2777", "#e11d48", "#ca8a04"];
    const [model, setModel] = React.useState("text");
    const [background, setBackground] = React.useState(bgColors[0]);
    const [text, setText] = React.useState("");
    const [media, setMedia] = React.useState(null);
    const [mediaPreview, setMediaPreview] = React.useState(null);

    const handleMediaUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setMedia(file);
            setMediaPreview(URL.createObjectURL(file));
        }
    };

    const handleCreateStory = async () => {
        // Your story creation logic here
        alert("Story created! (implement logic)");
        setShowModel(false);
    };

    return (
        <div className='fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur flex text-white items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                <div className='text-center mb-4 flex items-center justify-between'>
                    <button onClick={() => setShowModel(false)} className='text-white p-2 cursor-pointer'>
                        <ArrowLeft />
                    </button>
                    <h2 className='text-lg font-semibold'>Create Story</h2>
                    <span className='w-10'></span>
                </div>
                <div className='rounded-lg h-96 flex items-center justify-center relative' style={{ backgroundColor: background }}>
                    {model === 'text' && (
                        <textarea
                            className='bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none'
                            placeholder="What's on your mind?"
                            onChange={(e) => setText(e.target.value)}
                            value={text}
                        />
                    )}
                    {model === 'media' && mediaPreview && (
                        media?.type.startsWith('image') ? (
                            <img src={mediaPreview} alt=" " className='object-contain max-h-full' />
                        ) : (
                            <video src={mediaPreview} className='object-contain max-h-full' controls />
                        )
                    )}
                </div>
                <div className='flex mt-4 gap-2'>
                    {bgColors.map((color) => (
                        <button
                            key={color}
                            className='w-6 h-6 rounded-full ring cursor-pointer'
                            style={{ backgroundColor: color }}
                            onClick={() => setBackground(color)}
                        />
                    ))}
                </div>
                <div className='flex gap-2 mt-4'>
                    <button
                        onClick={() => { setModel('text'); setMedia(null); setMediaPreview(null); }}
                        className={`flex-1 flex items-center justify-center gap-2 p-2 rounded ${model === 'text' ? "bg-white text-black" : "bg-zinc-800"}`}
                    >
                        <TextIcon size={18} /> Text
                    </button>

                    <label>
                        <input type="file" accept="image/*,video/*" className='hidden' style={{ display: 'none' }} onChange={handleMediaUpload} />
                    </label>

                    <button
                        onClick={() => { setModel('media'); setText(""); }}
                        className={`flex-1 flex items-center justify-center gap-2 p-2 rounded ${model === 'media' ? "bg-white text-black" : "bg-zinc-800"}`}
                    >
                        Media
                    </button>
                    {model === 'media' && (
                        <>
                            <label htmlFor="media-upload" className="flex items-center cursor-pointer bg-zinc-800 p-2 rounded hover:bg-zinc-700">
                                <ImageIcon size={18} />
                                <span className="ml-1">Upload</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleMediaUpload}
                                style={{ display: 'none' }}
                                id="media-upload"
                            />
                        </>
                    )}
                </div>

                    <button onClick={()=>toast.promise(handleCreateStory(),{
                        loading: 'Creating Story...',
                        success: <p>'Story Created!'</p>,
                        error: e => <p>{e.message}</p>,
                    })} className='flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-gradient-to-r from-indigo-500 to-purple-700 active:scale-95 transition cursor-pointer'>
                        <Sparkle size={18} /> Create Story 
                    </button>
                
            </div>
        </div>
    );
};

export default StoryModel;
