/*

프로그램 요구사항
1. 함수 분리
2. id는 unique한 랜덤값
3. prompt는 반복 실행
4. add, delete, update 함수가 실행된 후 'show$all' 을 실행해 현재상태 출력
5. Update의 경우, 3초 delay 후 결과 출력
6. 정규표현식 활용

*/

const todos = require('./todosData');
const utils = require('./utils');
const readline = require('readline');

const r = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

r.setPrompt('명령하세요 : ');
r.prompt();
r.on('line', function (line) {
    if (line === 'q') {
        console.log("종료합니다.")
        r.close();
    }
    application(line);
});
r.on('close', function () {
    process.exit();
});

function application(line) {
    const showAll = function () {
        const theNumOf = status => todos.filter((el) => el['status'] === status).length;
        console.log(`현재상태 : todo ${theNumOf('todo')}개, doing ${theNumOf('doing')}개, done ${theNumOf('done')}개`);
        r.prompt();
    }

    const showEachData = function (order) {
        const status = order.match(/(?<=show\$)(todo|doing|done)$/);
        if (!utils.isValidStatus(status)) return r.prompt();

        const nameAndIdArr = todos
            .filter((el) => el['status'] === status[0])
            .map((el) => [el['name'], el['id'] + '번']);
        console.log(`${status[0]}리스트 총 ${nameAndIdArr.length}건 : '${nameAndIdArr.join('\' \'')}'`);
        r.prompt();
    }

    const addData = function (order) {
        const name = order.match(/(?<=add\$)\D*(?=\$)/);
        const tag = order.match(/(?<=\[\")[a-zA-Z]*(?=\"\])/i);
        if (!utils.isValidName(name) || !utils.isValidTag(tag)) return r.prompt();

        const objToAdd = {};

        objToAdd['name'] = name[0];
        objToAdd['tag'] = tag[0];
        objToAdd['status'] = 'todo';
        objToAdd['id'] = utils.makeRanNum(5, todos);
        todos.push(objToAdd);
        console.log(`${objToAdd['name']} 1개가 추가됐습니다.(id : ${objToAdd['id']})`);
        setTimeout(() => showAll(), 1000);
    }

    const deleteData = function (order) {
        const id = order.match(/(?<=delete\$)\d{5}$/);
        if (!utils.isValidId(id)) return r.prompt();

        todos.some((el, i) => {
            if (el['id'] === Number(id[0])) {
                console.log(`${el['name']}(${el['status']})가 목록에서 삭제됐습니다.`);
                todos.splice(i, 1);
                setTimeout(() => showAll(), 1000);
                return true;
            } else if (i === todos.length - 1) {
                console.log('없는 id 입니다.');
                r.prompt();
            }
        });
    }

    const updateData = function (order) {
        const id = order.match(/(?<=update\$)\d{5}(?=\$)/);
        const status = order.match(/(?<=\d{5}\$)(todo|doing|done)$/g);
        if (!utils.isValidId(id) || !utils.isValidStatus(status)) return r.prompt();

        todos.some((el, i) => {
            if (el['id'] === Number(id[0])) {
                setTimeout(() => {
                    console.log(`${el['name']}가 ${el['status']}에서 ${status[0]}으로 상태가 변경됐습니다.`);
                    el['status'] = status[0];
                    setTimeout(() => showAll(), 1000);
                }, 3000);
                return true;
            } else if (i === todos.length - 1) {
                console.log('없는 id 입니다.');
                r.prompt();
            }
        });
    }

    if (line === 'show$all') showAll();
    else if (line.slice(0, 4) === 'show') showEachData(line);
    else if (line.slice(0, 3) === 'add') addData(line);
    else if (line.slice(0, 6) === 'delete') deleteData(line);
    else if (line.slice(0, 6) === 'update') updateData(line);
    else {
        console.log("없는 명령어입니다.")
        r.prompt();
    }
}