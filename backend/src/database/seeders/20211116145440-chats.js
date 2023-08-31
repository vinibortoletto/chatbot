module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      "chats",
      [
        {
          created_at: new Date(),
          ended_at: new Date(),
          messages: `[{"id":"18f27892-6306-4bdd-8ef8-d45a6f66b306","content":"Hello, I'm Claire! How can I help you today?","createdAt":"2023-08-31T15:40:51.294Z","sender":"company"},{"id":"c0a31b1e-28cb-4983-8337-fbbfb851ff27","content":"goodbye","createdAt":"2023-08-31T15:40:55.500Z","sender":"user"},{"id":"d54267df-9ab3-4cf9-9624-529ff20d41ae","content":"Goodbye, have a nice day!","createdAt":"2023-08-31T15:40:55.501Z","sender":"company"},{"id":"7c5e8198-361b-4093-a416-84bf7a76e8dd","content":"If you want to talk again, you can create a new chat!","createdAt":"2023-08-31T15:40:55.501Z","sender":"company"}]`,
          username: "Carl Sagan",
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("chats", null, {});
  },
};
