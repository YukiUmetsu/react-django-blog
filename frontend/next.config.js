module.exports = {
    serverRuntimeConfig: {
        // Will only be available on the server side
        REGISTRATION_API: process.env.REGISTRATION_API,
        LOGIN_API: process.env.LOGIN_API,
        POSTS_API: process.env.POSTS_API,
    },
    publicRuntimeConfig: {
        // Will be available on both server and client
        staticFolder: '/static',
    },
}