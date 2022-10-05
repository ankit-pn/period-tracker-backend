const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const dbConnect = require("./dbConnect");
const Date = require("./periodModel");

dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});



// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
    response.json({ message: "Hey! This is your server response!" });
    next();
});


// register endpoint
app.post("/postDates", (request, response) => {
    const date = new Date({
        userId: request.body.userId,
        date: request.body.date,
        note: request.body.note,
    });

    // save the new user
    date.save()
        // return success if the new user is added to the database successfully
        .then((result) => {
            response.status(201).send({
                message: "Date Saved Suceessfully",
                result,
            });
        })
        // catch error if the new user wasn't added successfully to the database
        .catch((error) => {
            response.status(500).send({
                message: "Error Saving Date",
                error,
            });
        });
});

app.post("/delDate", async (request, response) => {
    const userId = request.body.userId;
    const date = request.body.date;
    await Date.deleteOne({
        userId: userId,
        date: date
    })
    // save the new user
    // date.save()
        // return success if the new user is added to the database successfully
        .then((result) => {
            response.status(201).send({
                message: "Date Saved Suceessfully",
                result,
            });
        })
        // catch error if the new user wasn't added successfully to the database
        .catch((error) => {
            response.status(500).send({
                message: "Error Saving Date",
                error,
            });
        });
});


// register endpoint
app.post('/getDates', async (request, response) => {
    const uid = request.body.userId;
    console.log(uid);
    if (uid === undefined) {
        response.json({ "dates": "userId not Found" });
    }
    else {
        const date = await Date.find({ userId: uid })
        const resp = await date.length ? { "dates": date } : { "message": "No Records Found" }
        await response.json(resp)
    }


})





module.exports = app;
