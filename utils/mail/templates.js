function getRegistrationBody(username) {

    return {
        body: {
            name: `${username}`,
            greeting: 'Welcome',
            intro: 'Thank you for registering!',
            action: {
                button: {
                    color: '#48cfad', 
                    text: 'Go to my GitHub profile',
                    link: 'https://github.com/DavidPVaz'
                }
            },
            signature: 'Sincerely'
        }
    };
}

export default {
    getRegistrationBody
};
