const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const Model = function () {
    this.todoList = [];
};

Model.prototype = {
    findData(key, vlaue) {
        return this.todoList.filter(todoData => todoData[key] === value);
    },
    addData(name, tags) {
        tags = tags.replace(/\[|\]|\"\'/g, '').split(',');
        const id = this.makeId();
        const todoData = {
            name,
            tags,
            status: 'todo',
            id
        }
        this.todoList.push(todoData);
    },
    deleteData() { },
    updateData() { },
    makeId() {
        return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
    }
};

const View = function () {
};

View.prototype = {
    showAll() { },
    showEachData() { },
    showAddResult(name, id) {
        console.log(`${name} 1개가 추가되었습니다.(id: ${id})`);
    },
    showDeleteResult() { },
    showupdateResult() { },
};

const Controller = function () {
    this.model = model;
    this.view = view;
};

Controller.prototype = {
    showAll() { },
    showEachData() { },
    addData(name, tags) {
        this.model.addData(name, tags);
        const id = this.model.findData('name',name)[0].id;
        this.view.showAddResult(name, id);
    },
    deleteData() { },
    updateData() { }
};

const Util = function () {
};

Util.prototype = {
    parseCommand(command) {
        return command.split('$');
    },
    getKeyCommand(command) {
        const keyMap = {
            'show': 'showData',
            'add': 'addData',
            'delete': 'deleteData',
            'update': 'updateData'
        }
        const keyCommand = command.shift();
        return keyMap[keyCommand];
    },
}

const app = {
    start() {
        rl.setPrompt('명령하세요.(종료하려면 "q"를 입력하세요.) : ');
        rl.prompt();
        rl.on('line', (command) => {
            if (command == 'q') rl.close();
            command = util.parseCommand(command);
            const keyCommand = util.getKeyCommand(command);
            const restCommand = command;
            controller[keyCommand](...restCommand);
            rl.prompt();
        });
        rl.on('close', () => {
            process.exit();
        })
    }
};

const model = new Model();
const view = new View();
const controller = new Controller();
const util = new Util();

app.start();