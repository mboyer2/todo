var express 	= require('express')
var bodyParser 	= require('body-parser')
var mongoose	= require('mongoose')
var app 		= express()


// set up mongoose and middleware
mongoose.connect('mongodb://localhost:27017/todo-app', function(err, db){
	if (err) {
        console.log('failed to connect to mongo')
        console.log(err)
    } else{
    	console.log('connected')
    }
})

app.use(express.static('./public'))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


var TodoSchema = mongoose.Schema({
	todo: { type: String, required: true},
    done: { type: Boolean, default:false}
})

let TodoModel = mongoose.model('Todo', TodoSchema)

 
// initialize homepage
app.get('/', function(req, res){
    res.sendFile('./index.html', {root: './public'})
})

//posting user input data to database
app.post('/todos', function(req, res){
	console.log('body? ', req.body)

	new TodoModel(req.body).save(function(err, createdTodo){

		if (err){
            console.log(err)
            res.send('POST TODO: oops, something went wrong.')
        }
        else {
            res.send(createdTodo)
            // console.log(createdTodo)
		}
    })
})


//retrieving fresh data t
app.get('/todos', function(req, res){
    TodoModel.find({}, function(err, docs){   ///study syntax changes. TodoModel is how we access database
        if (err) {
            console.log(err)
            res.send('GET TODO: oops, something went wrong. ')
        }
        else {
            res.send(docs)
        }
    }) 
})





//posting completed todos/////////////////////////////////////////////////
app.post('/completeTodos', function(req, res){
    console.log('complete todos', req.body)
    if ( req.body.todo.done === 'false' ) {
        req.body.todo.done = false
    }
    TodoModel.findByIdAndUpdate(
        req.body.todo._id,
        { $set : { done: !req.body.todo.done } },
        { new: true },
        function(err, updatedTodo){

        if (err){
            console.log(err)
            res.send('POST COMPLETE TODO: oops, something went wrong.')
        }
        else {
            res.send(updatedTodo)
            console.log(updatedTodo)
        }
    })
})



app.post('/deleteTodos', function(req, res){
    console.log('delete todos', req.body)

    TodoModel.findByIdAndRemove(req.body._id, function(err, deletedTodo){

        if (err){
            console.log('err', err)
            res.send('POST DELETE TODO: oops, something went wrong.')
        }
        else {
            res.send(deletedTodo)
            console.log('success', deletedTodo)
        }
    })
})






app.listen(8080, function(){
    console.log('server listening on port 8080')
})
