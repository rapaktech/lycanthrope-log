var JOURNAL = [];

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


// function to calculate correlation of events to a positive for transformation, phi
function phi(table) {
    return (table[3] * table[0] - table[2] * table[1]) /
    Math.sqrt((table[2] + table[3]) *
    (table[0] + table[1]) *
    (table[1] + table[3]) *
    (table[0] + table[2]));
}

// function to extract values from JOURNAL to calculate correlation between events
function tableFor(event, journal) {
    let table = [0, 0, 0, 0];
    for (let i = 0; i < journal.length; i++) {
        let entry = journal[i], index = 0;
        if (entry.events.includes(event)) index += 1;
        if (entry.werewolf) index += 2;
        table[index] += 1;
    }
    return table;
}


// function to create an array of events from JOURNAL
function journalEvents(journal) {
    let events = [];
    for (let entry of journal) {
        for (let event of entry.events) {
            if (!events.includes(event)) {
                events.push(event);
            }
        }
    }
    return events;
}


// Printing out correlation values for each events
function print () {
  for (let event of journalEvents(JOURNAL)) {
    console.log(event + ":", phi(tableFor(event, JOURNAL)));
  }
}

let count = 1;

function query () {
  rl.question("Enter events with space between then like this: event1 event2 event3:  ", function (answer) {
    const events = answer.split(" ");
    let werewolf;
    rl.question(`Did You Change To A Werewolf on Day ${count}?: 'Y' for "yes", 'N' for "no":  `, function (answer) {
      if (answer == "Y") {
        werewolf = true;
        JOURNAL.push({events, werewolf});
        count++;
        rl.question(`Do You Want To Record Events for Day ${count}?: 'Y' for "yes", 'N' for "no":  `, function (answer) {
          if (answer == "Y") {
            query();
          }
          else if (answer == "N") {
            print();
            rl.close();
          }
        });
      }
      else if (answer == "N") {
        werewolf = false;
        JOURNAL.push({events, werewolf});
        count++;
        rl.question(`Do You Want To Record Events for Day${count}?: 'Y' for "yes", 'N' for "no":  `, function (answer) {
          if (answer == "Y") {
            query();
          }
          else if (answer == "N") {
            print();
            console.log(
                "The closer the correlation value is to 1, the more likely it is the cause of your wolf turn\nThe closer the correlation value is to -1, the less likely it is the cause of your wolf turn");
            rl.close();
          }
        });
      }
    });
  });
}

query();