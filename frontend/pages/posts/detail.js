import React from 'react';
import SiteNavBar from "../../components/SiteNavBar";
import Aux from "../../hoc/Aux/Aux";
import PropTypes from "prop-types";
import Footer from "../../components/Footer";
import PostDetailHeader from "../../components/posts/PostDetailHeader";
import Subscribe from "../../components/UI/Subscribe";
import PostDetailRecommendation from "../../components/posts/PostDetailRecommendation";

const PostDetail = (props) => {

    const fontStyle = {
        fontFamily: "Georgia,serif",
    };

    return (
        <Aux>
            <SiteNavBar/>
            <div className="w-full">
                <PostDetailHeader {...props}/>
                <div className="container max-w-5xl mx-auto -mt-32">
                    <div className="mx-0 sm:mx-6">
                        <div className="bg-white w-full p-8 md:p-24 text-xl md:text-2xl text-gray-800 leading-normal" style={fontStyle}>
                            <p className="text-2xl md:text-3xl mb-5">
                                👋 Welcome fellow <a
                                className="text-gray-800 hover:text-teal-500 no-underline border-b-2 border-teal-500"
                                href="https://www.tailwindcss.com">Tailwind CSS</a> and <a
                                className="text-gray-800 hover:text-teal-500 no-underline border-b-2 border-teal-500"
                                href="https://www.ghost.org">Ghost</a> fan. This starter template is an attempt to
                                replicate the default Ghost theme <a
                                className="text-gray-800 hover:text-teal-500 no-underline border-b-2 border-teal-500"
                                href="https://demo.ghost.io/welcome">"Casper"</a> using Tailwind CSS and vanilla
                                Javascript.
                            </p>

                            <p className="py-6">The basic blog page layout is available and all using the default
                                Tailwind CSS classes (although there are a few hardcoded style tags). If you are going
                                to use this in your project, you will want to convert the classes into components.</p>

                            <p className="py-6">Sed dignissim lectus ut tincidunt vulputate. Fusce tincidunt lacus
                                purus, in mattis tortor sollicitudin pretium. Phasellus at diam posuere, scelerisque
                                nisl sit amet, tincidunt urna. Cras nisi diam, pulvinar ut molestie eget, eleifend ac
                                magna. Sed at lorem condimentum, dignissim lorem eu, blandit massa. Phasellus eleifend
                                turpis vel erat bibendum scelerisque. Maecenas id risus dictum, rhoncus odio vitae,
                                maximus purus. Etiam efficitur dolor in dolor molestie ornare. Aenean pulvinar diam nec
                                neque tincidunt, vitae molestie quam fermentum. Donec ac pretium diam. Suspendisse sed
                                odio risus. Nunc nec luctus nisi. Class aptent taciti sociosqu ad litora torquent per
                                conubia nostra, per inceptos himenaeos. Duis nec nulla eget sem dictum elementum.</p>

                            <ol>
                                <li className="py-3">Maecenas accumsan lacus sit amet elementum porta. Aliquam eu libero
                                    lectus. Fusce vehicula dictum mi. In non dolor at sem ullamcorper venenatis ut sed
                                    dui. Ut ut est quam. Suspendisse quam quam, commodo sit amet placerat in, interdum a
                                    ipsum. Morbi sit amet tellus scelerisque tortor semper posuere.
                                </li>
                                <li className="py-3">Morbi varius posuere blandit. Praesent gravida bibendum neque eget
                                    commodo. Duis auctor ornare mauris, eu accumsan odio viverra in. Proin sagittis
                                    maximus pharetra. Nullam lorem mauris, faucibus ut odio tempus, ultrices aliquet ex.
                                    Nam id quam eget ipsum luctus hendrerit. Ut eros magna, eleifend ac ornare
                                    vulputate, pretium nec felis.
                                </li>
                                <li className="py-3">Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
                                    posuere cubilia Curae; Nunc vitae pretium elit. Cras leo mauris, tristique in risus
                                    ac, tristique rutrum velit. Mauris accumsan tempor felis vitae gravida. Cras egestas
                                    convallis malesuada. Etiam ac ante id tortor vulputate pretium. Maecenas vel sapien
                                    suscipit, elementum odio et, consequat tellus.
                                </li>
                            </ol>

                            <blockquote className="border-l-4 border-teal-500 italic my-8 pl-8 md:pl-12">
                                <h1>Conclusion:</h1>
                                Example of blockquote - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at ipsum
                                eu nunc commodo posuere et sit amet ligula.
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full mb-56 mx-auto">
                <PostDetailRecommendation />
                <Subscribe/>
            </div>
            <Footer/>
        </Aux>
    );
};

PostDetail.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  category: PropTypes.string,
  published_at: PropTypes.string,
};

PostDetail.defaultProps = {
  image: "/images/header/osakajo.jpg",
  title: "Welcome to Ghostwind CSS",
  category: "Welcome to Japanese Learning",
  published_at: "04/25/2020"
};

export default PostDetail