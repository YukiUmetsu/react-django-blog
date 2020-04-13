import React from 'react';
import Layout from "../components/Layout";
import MainHeader from "../components/Home/MainHeader";
import Footer from "../components/Footer";
import AboutUs from "../components/Home/AboutUs";
import RecentBlogArticles from "../components/Home/RecentBlogArticles";
import RecentYoutubeVideos from "../components/Home/RecentYoutubeVideos";
import getConfig from 'next/config';
import { fetcherWithHeader } from "../lib/fetch";

class Index extends React.Component {
    render() {
        return (
            <Layout>
                <main>
                    <MainHeader/>
                    <AboutUs/>
                    <RecentBlogArticles posts={this.props.posts}/>
                    <RecentYoutubeVideos/>
                    <Footer/>
                </main>
            </Layout>
        );
    }
}

export async function getServerSideProps(ctx) {
    // Fetch data from external API
    const { serverRuntimeConfig } = getConfig();
    const data = await fetcherWithHeader(serverRuntimeConfig.POSTS_API, ctx.req.headers.cookie);
    return { props: { posts: data.results } }
}

export default Index;