exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("jokes")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("jokes").insert([
        {
          setup: " How do you get the code for the bank vault?",
          punchline: "You checkout their branch.",
          private: 0

        },
        {
          setup: "What do you call an eagle who can play the piano?",
          punchline: "Talonted!",
          private: 0
        },
        {
          setup: "How did the developer announce their engagement?",
          punchline: "They returned true!",
          private: 0
        },
      
        {
          setup:
            "Why did the security conscious engineer refuse to pay their dinner bill?",
          punchline: "Because they could not verify the checksum.",
          private: 0
        },
        {
          setup: "What do you call an idle server?",
          punchline: "A waiter.",
          private: 0
        },
        {
          setup: "How many Prolog programmers does it take to change a lightbulb?",
          punchline: "Yes.",
          private: 0
        },
        {
          setup: "I’ve been hearing news about this big boolean.",
          punchline: "Huge if true.",
          private: 0
        },
      
        {
          setup: "What diet did the ghost developer go on?",
          punchline: "Boolean",
          private: 0
        },
        {
          setup: "Q: Why was the developer unhappy at their job?",
          punchline: "They wanted arrays.",
          private: 0
        },
      
        {
          setup: "Why did 10 get paid less than '10'?",
          punchline: "There was workplace inequality.",
          private: 0
        },
        {
          setup: "Why was the function sad after a successful first call?",
          punchline: "It didn’t get a callback.",
          private: 0
        },
        {
          setup: "Why did the angry function exceed the callstack size?",
          punchline: "It got into an Argument with itself",
          private: 0
        },
      
        {
          setup: "Whats the object-oriented way to become wealthy?",
          punchline: "Inheritance",
          private: 0
        },
      
        {
          setup: "Why did the developer ground their kid?",
          punchline: "They weren't telling the truthy",
          private: 0
        },
      
        {
          setup: "What did the array say after it was extended?",
          punchline: "Stop objectifying me",
          private: 0,
        },
      
        {
          setup: "Where did the parallel function wash its hands?",
          punchline: "Async",
          private: 0
        },
      
      ]);
    });
};
