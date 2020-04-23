module.exports = {
    serverRuntimeConfig: {
        // Will only be available on the server side
        POSTS_API: process.env.POSTS_API,
        ANGOU_KEY: process.env.ANGOU_KEY,
    },
    publicRuntimeConfig: {
        // Will be available on both server and client
        staticFolder: '/static',
        API_BASE: process.env.API_BASE
    },
}