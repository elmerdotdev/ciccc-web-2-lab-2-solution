$(function() {

  let counter = 1
  const container = $('.container')
  const header = $('header')
  const postsDiv = $('.posts')
  const todosDiv = $('.todos')

  function getUser(id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://dummyjson.com/users/${id}`,
        type: 'GET',
        success: function(response) {
          resolve(response)
        },
        error: function(error) {
          reject(error)
        }
      })
    })
  }

  function getUserPosts(id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://dummyjson.com/users/${id}/posts`,
        type: 'GET',
        success: function(response) {
          resolve(response)
        },
        error: function(error) {
          reject(error)
        }
      })
    })
  }

  function getUserTodos(id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://dummyjson.com/users/${id}/todos`,
        type: 'GET',
        success: function(response) {
          resolve(response)
        },
        error: function(error) {
          reject(error)
        }
      })
    })
  }

  function getPostInfo(id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://dummyjson.com/posts/${id}`,
        type: 'GET',
        success: function(response) {
          resolve(response)
        },
        error: function(error) {
          reject(error)
        }
      })
    })
  }

  async function build(id) {
    const user = await getUser(id)
    const posts = await getUserPosts(id)
    const todos = await getUserTodos(id)

    $('.info__image').find('img').attr('src', user.image)
    $('.info__content').html(`
      <h2>ID ${user.id}: ${user.firstName} ${user.lastName}</h2>
      <div><strong>Age:</strong> ${user.age}</div>
      <div><strong>Email:</strong> ${user.email}</div>
      <div><strong>Phone:</strong> ${user.phone}</div>
    `)

    postsDiv.find('h3').text(`${user.firstName}'s Posts`)
    todosDiv.find('h3').text(`${user.firstName}'s To Dos`)

    postsDiv.find('ul').empty()

    if (posts.posts.length !== 0) {
      _.forEach(posts.posts, function(post) {
        postsDiv.find('ul').append(`
          <li>
            <h4 post-id="${post.id}">${post.title}</h4>
            <p>${post.body}</p>
          </li>
        `)
      })
    } else {
      postsDiv.find('ul').append('<li>User has no posts</li>')
    }

    todosDiv.find('ul').empty()

    if (todos.todos.length !== 0) {
      _.forEach(todos.todos, function(todo) {
        todosDiv.find('ul').append(`
          <li>
            <p>${todo.todo}</p>
          </li>
        `)
      })
    } else {
      todosDiv.find('ul').append('<li>User has no todos</li>')
    }
  }

  postsDiv.find('h3').on('click', function() {
    $(this).next().slideToggle()
  })

  todosDiv.find('h3').on('click', function() {
    $(this).next().slideToggle()
  })

  $('.posts').on('click', 'h4', async function (id) {
    const postId = $(this).attr('post-id')
    const post = await getPostInfo(postId)
    const modal = $(`
        <div class="overlay">
          <div class="modal">
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <em>Views: ${post.views}</em>
            <button>Close Modal</button>
          </div>
        </div>
      `)
    container.append(modal)
  })

  container.on('click', '.overlay button', function () {
    $(this).parent().parent().remove()
  })

  header.find('button').first().on('click', function() {
    if (counter === 1) {
      counter = 30;
    } else {
      counter--;
    }
    build(counter);
  });

  header.find('button').last().on('click', function() {
    if (counter === 30) {
      counter = 1;
    } else {
      counter++;
    }
    build(counter);
  });

  build(counter)
})