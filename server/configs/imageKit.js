import ImageKit from "imagekit";

// Ensure URL endpoint exists. In production this must be set. For local
// development we provide a small shim so the server can run without ImageKit
// credentials (useful for testing update endpoints without uploading files).
const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

let imagekit;
if (!urlEndpoint) {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('Missing urlEndpoint during ImageKit initialization. Set IMAGEKIT_URL_ENDPOINT in your environment.');
    }

    console.warn('⚠️ IMAGEKIT_URL_ENDPOINT not set — using dev shim for ImageKit (uploads will not go to ImageKit).');

    // Minimal dev shim that mimics the parts of ImageKit used in this app.
    imagekit = {
        upload: async ({ file, fileName }) => {
            // Return a fake filePath used by imagekit.url in the controllers
            return { filePath: `/dev/${fileName || 'upload'}` };
        },
        url: ({ path }) => {
            // Return a placeholder URL pointing at the local dev path
            return `https://dev.placeholder.local${path || '/placeholder.webp'}`;
        },
    };
} else {
    imagekit = new ImageKit({
        publicKey,
        privateKey,
        urlEndpoint,
    });
}

export default imagekit;