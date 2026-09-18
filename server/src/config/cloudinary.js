import { v2 as cloudinary } from 'cloudinary';

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'my7ipdv4',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(img){
    const res = await cloudinary.uploader.upload(img);
    if (!res){
        throw new Error("Can't connect to Cloudinary!!");
    }
    const img_url = cloudinary.url(res.public_id, {
        transformation: [
            {
                quality: 'auto',
                fetch_format: 'auto'
            },
            {
                width: 1200,
                height: 1200,
                crop: 'fill',
                gravity: 'auto'
            }
        ]
    })

    console.log(img_url)

    return img_url
}
