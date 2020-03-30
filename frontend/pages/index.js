import React from 'react';
import Layout from "../components/Layout";
import MainHeader from "../components/home/MainHeader";
import Footer from "../components/Footer";
import AboutUs from "../components/home/AboutUs";
import RecentBlogArticles from "../components/home/RecentBlogArticles";
import RecentYoutubeVideos from "../components/home/RecentYoutubeVideos";

class Index extends React.Component {
    render() {
        return (
            <Layout>
                <main>
                    <MainHeader/>
                    <AboutUs/>
                    <RecentBlogArticles/>
                    <RecentYoutubeVideos/>
                    <Footer/>
                </main>
            </Layout>
        );
    }
}

export default Index;