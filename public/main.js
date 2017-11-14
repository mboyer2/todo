
// post checkbox data 
// post deleteTodo 

var mainVm = new Vue({

	el: '#app',
	data: {
		todos: [/* todo* */],
		newTodo: '',
		// taskDone: false,

		completeTodos: [],
		

	




	},
	methods: {
		//sending request to server.js to store user input data in database
		postNewTodo: function(event){
			event.preventDefault()
							//study this syntax,body is sent as an object, be explicit when sending  todo:this.newTodo 
			$.post('/todos', {todo: this.newTodo}, function(data){
				console.log('$POST',data)
				mainVm.todos.push(data)
               	//mainVm.getFreshData()
            })
		},
		getFreshData: function(event){
            $.get('/todos', function(data){
                mainVm.todos = data
			})
		},
		
		


		postCompleteTodo: function(todo){
			// event.preventDefault()
			

			$.post('/completeTodos', {todo: todo}, function(data){
				console.log('$POST COMPLETEtodos', data)
			})
		},
		


		//no server app.post yet.  
		postRemoveTodo: function(todo){
			// this.todos.splice(index,1)

			$.post('/deleteTodos', todo, function(data){
				// console.log('$POST REMOVE', data)
				mainVm.getFreshData()
			})
		},
		// getRemoveTodo: function(event){
  //           $.get('/deleteTodos', function(data){
  //               // mainVm.completeTodos = data
		// 	})
		// },


	},
	created: function(){
		this.getFreshData()

	}



})