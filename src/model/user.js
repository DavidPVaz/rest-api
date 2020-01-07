const User = (function () {

    const privateProperties = new Map();

    class User {
        constructor(username, email, password) {
            privateProperties.set(this, {
                username,
                email,
                password
            });
        }

        static delete(user) {
            privateProperties.delete(user);
        }

        getUsername() {
            return privateProperties.get(this).username;
        }

        getEmail() {
            return privateProperties.get(this).email;
        }

        getPassword() {
            return privateProperties.get(this).password;
        }

        setUsername(newUsername) {
            privateProperties.get(this).username = newUsername;
        }

        setEmail(newEmail) {
            privateProperties.get(this).email = newEmail;
        }

        setPassword(newPassword) {
            privateProperties.get(this).password = newPassword;
        }

    }

    return User;

})();

export { User };