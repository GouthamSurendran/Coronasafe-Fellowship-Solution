const fs = require('fs');

const inputMode = process.argv[2];
const todoFile = `${process.cwd()}/todo.txt`;
const doneFile = `${process.cwd()}/done.txt`;

function writeToFile() {
    const passedArg = process.argv[3];
    if (passedArg == null) console.log('Error: Missing todo string. Nothing added!');
    else {
        fs.appendFileSync(todoFile, `${passedArg}\n`);
        console.log(`Added todo: "${passedArg}"`);
    }
}

function readFromTodo() {
    if (fs.existsSync(todoFile)) {
        var todos = fs.readFileSync(todoFile, 'utf8').split('\n');
        if (todos.length > 0) {
            for (var i = todos.length - 2; i >= 0; i--) {
                console.log(`[${i + 1}] ${todos[i]}`);
            }
        }
    }
    else console.log("There are no pending todos!");
}

function showHelp() {
    console.log(`Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics`)
}

function delTodo(itemNum) {
    if (fs.existsSync(todoFile)) {
        fs.readFile(todoFile, 'utf8', function (err, data) {
            var todo = data.split('\n');
            if (itemNum <= todo.length - 1 && todo[0] != '' && itemNum != 0) {
                filteredTodo = [...todo.slice(0, itemNum - 1), ...todo.slice(itemNum)]
                fs.writeFileSync(todoFile, filteredTodo.join('\n'));
                console.log(`Deleted todo #${itemNum}`);
            }
            else console.log(`Error: todo #${itemNum} does not exist. Nothing deleted.`);
        });
    }
}

function markAsDone(itemNum) {
    const passedArg = process.argv[3];
    if (passedArg == null) {
        console.log('Error: Missing NUMBER for marking todo as done.');
    }
    else {
        fs.readFile(todoFile, 'utf8', function (err, data) {
            var todo = data.split('\n');
            if (itemNum <= todo.length - 1 && todo[0] != '' && itemNum != 0) {
                var dateToday = new Date().toISOString().slice(0,10);
                markedItem = todo[itemNum - 1];
                filteredTodo = [...todo.slice(0, itemNum - 1), ...todo.slice(itemNum)]
                fs.writeFileSync(todoFile, filteredTodo.join('\n'));
                fs.appendFileSync(doneFile, `x ${dateToday} ${markedItem}\n`);
                console.log(`Marked todo #${itemNum} as done.`);
            }
            else console.log(`Error: todo #${itemNum} does not exist. Nothing Marked.`);
        });
    }
}

// Checking for which action is to be done

if (inputMode == 'add') {
    writeToFile();
}
else if (inputMode == 'ls') {
    readFromTodo();
}
else if (inputMode == null || inputMode == 'help') {
    showHelp();
}
else if (inputMode == 'del') {
    itemNum = process.argv[3];
    if (itemNum == null) {
        console.log('Error: Missing NUMBER for deleting todo.');
    }
    else delTodo(itemNum);
}
else if (inputMode == 'done') {
    itemNum = process.argv[3];
    markAsDone(itemNum);
}
else if (inputMode == 'report'){
    var pending = fs.readFileSync(todoFile, 'utf8').split('\n');
    var completed = fs.readFileSync(doneFile,'utf-8').split('\n');
    var dateToday = new Date().toISOString().slice(0,10);
    console.log(`${dateToday} Pending : ${pending.length-1} Completed : ${completed.length-1}`);
}