$(document).ready(function () {
    showRegisterPage()
    $('#login-route').on('click', function () {
        $('#register-page').hide()
        showLoginPage()
    })

});


// ----------------TODO---------------
function showUpdateTodo(taskId) {
    if(localStorage.token){

        event.preventDefault()
        $('#show-list-task').hide()
        $('#add-task').hide()
        $.ajax({
            url: `http://34.87.118.203/todos/${taskId}`,
            type: 'get'
        })
        .done(function (response) {
            $('#update-todo').html(`
                    <div class="form-group">
                        <label for="formGroupExampleInput">Title</label>
                        <input type="text" class="form-control" id="title-update-todo" value="${response.title}">
                    </div>
                    <div class="form-group">
                        <label for="formGroupExampleInput2">Description</label>
                        <input type="text" class="form-control" id="description-update-todo" value="${response.description}">
                    </div>
                    <div class="form-group">
                    <label for="formGroupExampleInput2">Due date</label>
                    <input type="text" class="form-control" id="dueDate-update-todo" value="${response.dueDate}">
                    </div>
                    <button type="submit" class="btn btn-light text-center login-button">Edit</button>
                `)
            $('#update-todo').on('submit',function(){
                let title = $('#title-update-todo').val()
                let description = $('#description-update-todo').val()
                let dueDate = $('#dueDate-update-todo').val()
                let token = localStorage.token
                $.ajax({
                    url: `http://34.87.118.203/todos/${taskId}`,
                    type: 'put',
                    headers: { token },
                    data: {
                        title,
                        description,
                        dueDate
                    }
                })
                .done(function(response){
                    getUser(response.userId)
                })
                .fail(function(err){
                    console.log(err)
                })
            })
        })
    }
}
        
function updateTodo(taskId){
    
    let title = $('#title-update-todo').val()
    let description = $('#description-update-todo').val()
    let dueDate = $('#dueDate-update-todo').val()
    let token = localStorage.token
    $.ajax({
        url: `http://34.87.118.203/todos/${taskId}`,
        type: 'put',
        headers: { token },
        data: {
            title,
            description,
            dueDate
        }
    })
    .done(function(response){
        getUser(response.userId)
    })
    .fail(function(err){
        console.log(err)
    })
}

function main(response, user) {
    $('#login-page').hide()
    $('#register-page').hide()
    $('#navbar').show()
    showNavbar()
    $('#create-todo').hide()
    $('#add-task').show()
    $('#add-task').on("click", function () {
        $('#add-task').hide()
        $('#create-todo').show()
        $('#show-list-task').hide()
    })
}


function deleteTodo(taskId) {
    event.preventDefault()
    let token = localStorage.token
    $.ajax({
        url: `http://34.87.118.203/todos/${taskId}`,
        type: 'delete',
        headers: { token, taskId }
    })
    .done(function (response) {
        getUser(response.userId)

    })
    .fail(function (err) {
        console.log(err)
    })
}

function createTodo() {
    event.preventDefault()

    let title = $('#title-input-todo').val()
    let description = $('#description-input-todo').val()
    let dueDate = $('#dueDate-input-todo').val()
    let token = localStorage.token

    $.ajax({
        url: 'http://34.87.118.203/todos',
        type: 'post',
        headers: { token },
        data: {
            title, description, dueDate
        }
    })
    .done(function (response) {
        getUser(response._id)
    })
    .fail(function (err) {
        console.log(err)
    })

}


// ---------------USER----------------

function getUser(userId) {
    $.ajax({
        url: `http://34.87.118.203/users/${userId}`,
        type: 'get',
        headers: { token: localStorage.token }
    })
    .done(function(user){
        $.ajax({
            url: 'http://34.87.118.203/todos',
            type: 'get',
            headers: { token: localStorage.token }
        })
        .done(function (response) {
            showMainPage(response, user)
            main(response, user)
        })
        .fail(function (err) {
            console.log(err)
        })
    })
}

function onSignIn(googleUser) {
    let { id_token } = googleUser.getAuthResponse();
    $.ajax({
        url: 'http://34.87.118.203/users/login/google',
        type: 'post',
        headers: { id_token }
    })
        .done(function (response) {
            localStorage.setItem('token', response.access_token)
        })
        .fail(err => {
            console.log(err)
        })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        localStorage.removeItem("token")
    });
}


function login() {
    event.preventDefault()
    let email = $('#email-input-log').val()
    let password = $('#password-input-log').val()
    $.ajax({
        url: 'http://34.87.118.203/users/login',
        type: 'post',
        data: {
            email,
            password
        }
    })
    .done(function (response) {
        localStorage.setItem('token', response.access_token)
        getUser(response.id)
    })
    .fail(function (err) {
        
    })
}

function register() {
    event.preventDefault()
    let email = $('#email-input-reg').val()
    let username = $('#username-input-reg').val()
    let password = $('#password-input-reg').val()
    $.ajax({
        url: 'http://34.87.118.203/users',
        type: 'post',
        data: {
            username,
            email,
            password
        }
    })
    .done(function (response) {
        localStorage.setItem('token', response)
        main(response)
        getUser()

    })
    .fail(function (err) {
        console.log(err)
    })

}


// --------------SHOW PAGE---------------
function showTodo() {
    let token = localStorage.token
    $.ajax({
        url: 'http://34.87.118.203/todos',
        type: 'get',
        headers: { token }
    })
    .done(function (response) {
        $('#show-list-task').html('')
        $('#create-todo').hide()
        $.each(response, function (i, tasks) {
            $('#show-list-task').prepend(
                `
            <div class="card text-center mt-3 bg-dark">
                <div class="card-header">
                    ${tasks.data.title}
                </div>
                <div class="card-body">
                    <p class="card-text">${tasks.data.description}</p>
                        <div class = "row">
                        <div class="col-md-6 text-right">
                            <a href="#" id="delete-task" onclick="deleteTodo('${tasks.data._id}')" class=""> Delete </a>
                        </div>
                        <div class="col-md-6 text-left">
                            <a href="#" id="update-task" onclick="showUpdateTodo('${tasks.data._id}')" class=""> Edit </a>
                        </div>
                    </div>
                </div>
                <div class="card-footer text-muted">
                    ${tasks.data.dueDate}
                </div>
            </div>`
            )
        })
    })
    .fail(function (err) {
        console.log(err)
    })
}

function showMainPage(todos, user) {
    $('#main').html(`
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-3 primary-page">
                <div class="list-group" id="list-tab" role="tablist">
                    <a class="list-group-item list-group-item-action active bg-dark" id="profile" data-toggle="list"
                    href="#list-home" role="tab" aria-controls="home">${user.username}</a>
                    <ul class="list-group">
                        <li class="list-group-item d-flex justify-content-between align-items-center bg-dark">
                            <div class="col-md-11">
                            <a href="#" class="list-group-item list-group-item-action disabled bg-dark" id="task-list" 
                             role="tab" aria-controls="home" onclick="showTodo()">Task</a>
                            </div>
                            <div class="col-md-1">
                            <span class="badge badge-primary badge-pill">${todos.length}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="col-md-9 secondary-page">
                <div class="list-group mt-3">
                    <a href="#" class="list-group-item list-group-item-action disabled" id="add-task">+ Add task ..</a>
                </div>
                <div id="show-secondary-page">
                <div class="list-group" id="show-list-task">
                
                </div>
                    <form id="create-todo" onsubmit="createTodo()">
                        <div class="form-group">
                            <label for="formGroupExampleInput" >Title</label>
                            <input type="text" class="form-control" id="title-input-todo" placeholder="Title">
                        </div>
                        <div class="form-group">
                            <label for="formGroupExampleInput2">Description</label>
                            <input type="text" class="form-control" id="description-input-todo" placeholder="Description">
                        </div>
                        <div class="form-group">
                            <label for="formGroupExampleInput2">Due date</label>
                            <input type="text" class="form-control" id="dueDate-input-todo" placeholder="yyyy/mm/dd">
                        </div>
                        <button type="submit" class="btn btn-light text-center login-button">create</button>
                    </form>
                    <form id="update-todo">
                    </form>
                </div>
            </div>
        </div>
    </div>`)
}
function showRegisterPage() {
    $('#register-page').html(`
    <div class="row mt-3 justify-content-center">
        <div class="col-md-12">
            <div class="clock"> </div>
            <div class="greeting">
                <h1 style="font-size:140px" class="text-center"> </h1>
            </div>
        </div>
    </div>
    <div class="row mt-3 justify-content-center">
        <form id="register" class="col-md-6" onsubmit="register()">
            <div class="col-md-12">
                <div class="input-group mb-3 ">
                    <input type="text" class="form-control" placeholder="Username" id="username-input-reg">
                </div>
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="email@example.com" id="email-input-reg">
                </div>
                <div class="input-group mb-3">
                    <input type="password" class="form-control" placeholder="password" id="password-input-reg">
                </div>
                <div class="row">
                    <div class="col-md-2">
                        <button type="submit" class="btn btn-light text-center register-button">Register</button>
                    </div>
                    <div class="col-md-8 offset-md-6">
                        <h6 class="text-center"><a href="#" id="login-route">Already have an account?</a></h6>
                    </div>
                </div>
            </div>
        </form>
    </div>`)
    $('.greeting').html(`<h1 style="font-size:50px" class="text-center font-weight-bold">Hallo,${greeting()}</h1> `)
}

function showLoginPage() {

    $('#login-page').html(`
    <div class="row mt-3 justify-content-center">
        <div class="col-md-12">
            <div class="clock"> </div>
            <div class="greeting">
                <h1 style="font-size:140px"  class="text-center"> </h1>
            </div>
        </div>
    </div>
    <div class="row mt-3 justify-content-center">
        <form id="register" class="col-md-6" onsubmit="login()">
            <div class="col-md-12">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="email@example.com" id="email-input-log">
                </div>
                <div class="input-group mb-3">
                    <input type="password" class="form-control" placeholder="password" id="password-input-log">
                </div>
                <div class="row">
                    <div class="col-md-2">
                        <button type="submit" class="btn btn-light text-center login-button">Login</button>
                    </div>
                    
                </div>
            </div>
        </form>
    </div>
    `)
    $('.greeting').html(`<h1 style="font-size:50px" class="text-center font-weight-bold">Hallo,${greeting()}</h1> `)
}

function showNavbar() {
    $('#navbar').html(`
    <div class="row">
        <div class="col">
            <div class="pos-f-t">
                <nav class="navbar navbar-dark bg-dark">
                    <button class="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span> <h5>Fancy Todo</h5> </span>
                    </button>
                </nav>
            </div>
        </div>
    </div>
    `)
}
function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    $('.clock').html(
        `<h1 class="text-center font-weight-bold" style="font-size:140px">${h}:${m}</h1>`)
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}
function greeting() {
    let today = new Date();
    let h = today.getHours();
    let greeting = ''
    if (h >= 0 && h <= 10) greeting += `Good Morning`
    else if (h >= 11 && h <= 18) greeting += `Good Afternoon`
    else if (h >= 16 && h <= 24) greeting += `Good Evening`
    return greeting
}