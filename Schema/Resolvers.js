const { users } = require("../mocks/usersMock");

const resolvers = {
    Query: { 
        getUserById() {
            return users;
        }
    },
};

module.exports = { resolvers };