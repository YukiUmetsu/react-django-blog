import convertDateTime from "./convertDateTime";
import { IMG_HOST } from "../constants/index";

const convertPosts = (data) => {

    const convertImageHost  = (imagePath) => {
        let regex = /^(http|https):\/\/[a-z:0-9\.-]*\/?/;
        return imagePath.replace(regex, IMG_HOST)
    };

    const convertOneTag = (data) => {
        let tag_names = data.tags.map(tag => {
            return  tag.name;
        });
        let post = {
            'title': data.title,
            'content': data.content,
            'img': convertImageHost(data.main_img.file),
            'published_at': convertDateTime(data.published_at),
            'category': data.category.name,
            'tags': tag_names,
        };
        return post;
    };

    if(!Array.isArray(data)){
        return convertOneTag(data);
    }

    return data.map(postData => {
       return convertOneTag(postData)
    });
};

export default convertPosts;



