//We have added two keys dev and start to our scripts key in package.json

// "scripts": {
//     "dev": "nodemon --exec npm start",
//     "start": "node src/index.js"
//   }

/*
start is an inbuilt key for scripts key object and its value is set to the command which runs the file using node where we created our server. Such that when we write npm start it runs our server. But now when we make changes to our server file they will not be reflected on the browser, we will have to first stop the server and then type npm start again and any time we make a change we will have to stop server again and again.
To avoid this we installed a package called nodemon and then created our custom dev key inside scripts object and assigned it value "nodemon --exec npm start" which says "whenever we write npm run dev in command line, nodemon bro please execute npm start automatically and whenever any change is made to server please restart the server automatically."


Whenever we run npm run dev only index.js file runs, and the rest of the files and folders in src dont run with it. So we have to import them in our index.js file and then run the functions inside of them like we can write a code like this:

const connect = () => {
    return mongoose.connect("mongodb://localhost:27017/myDB");
  };

  in a file and then we will have to import the above code into index.js and then write the following code in index.js to connect to the collection:

  connect()
.then(() => {
  console.log("Connected to collection at port 27017");
})
.catch((e) => {
  console.error(e);
});

app.use((req, res, next) => {
  console.log("called 0");
  const data = {
    name: "Nihar",
    age: 23,
  };
  req.user = data;
  next();
});

app.get(
  "/login",
  (req, res) => {
    console.log("called 2");
    res.json(req.user);
  }
);
In middleware above we set a new key called user for req object in the middlewwre app.use() and on next() these same req and res where passed on to the actual api which was called i.e. /login and we could access this user property of req object that we set up in the middleware. Similar effect would have been seen if we had kept the middleware in the app.get() instead of app.use().


The return isn't needed by Express. next(error) is sufficient for it.

function foo(req, res, next) {
    next(new Error());
}
But, the return can be used to also stop the execution of the current function, allowing next(error) to more closely resemble a throw statement.

function foo(req, res, next) {
    return next(new Error());

    console.log("This is unreachable code and won't be logged.");
}

next(string or object) returns string or object passed inside it as an argument to the next middleware. In case we dont pass in any string or object to next() it will return nothing to the next middleware. 
When we write next() in case we receive an error, then as we are returning no error message inside the next() therefore error404handler() will be the next middleware to be executed as it gets executed when nothing is returned from prev. middleware, in case we send next(some string), then that string will be caught by handleError() in its error parameter, and if we send next(new Error(some string)) then that error object inside next() will again be caught inside error parameter of handleError() and in both cases error404handler() will be ignored.

Also 'return next()' should be used instead of 'next()' to fully pass on the control to next middleware otherwise if we dont do this, then in current middleware when next() is executed the control shifts to next middleware and the next middleware is executed, but when next middleware is fully executed the control again comes to the current middleware and it starts getting  executed from the line just below the next() in current middleware where it had left the control earlier.

******Difference between throw new Error and next(new Error())*************
Difference between throw new Error() and next(new Error()) is that we have to use try catch statement to handle throw Error otherwise we get a unhandled error exception in the console where server is running, though this exception doesnt stop the server but is not a clean way to handle rejections in promise and in case conditions are not satisfied. 
We should always use 'return next()' in controller.js files and 'throw Error' in validation.js files because in case an error occurs in controller.js files we want to handle that error using the middlewares next to it which are error404handler() and handleError(). And in case error occurs in Validation.js files we dont want to make those errors reach controller.js files instead we want them to be handled in GlobalMiddleware.js files. As soon as the error occurs in the validation.js we want it to be thrown and that error which gets thrown is caught in Globalmiddleware using validationResult(req) and then again in global middleware we use return next() to pass the control to next middleware error404handler() or handleError(). 

 Post.findOne({
                    _id:id
                },{
                    _v:0, 
                      user_id:0
                    //_Using _v:0 and user_id:0 we are making sure that the document that we will get back from the collection posts will not have fields _v and user_id.
                })
*/