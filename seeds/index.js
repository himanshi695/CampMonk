const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');
const campground = require('../models/campground');


mongoose.connect('mongodb://localhost:27017/camp-monk',{
    useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"CONNECTION ERROR:"));
db.once("open",() =>{
    console.log("Database connected");
});

const sample  = array => array[Math.floor(Math.random()* array.length)];

const seedDB  = async() =>{
    await Campground.deleteMany({});
    for(let i=0;i<400;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price= Math.floor(Math.random()*20) +10;
        const camp = new Campground({
            // YOUR USER ID
            author: '60b9b781bedb0a0c8426fe51',
            location :`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            description : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque possimus harum praesentium non nisi! Aspernatur similique quaerat cupiditate rem, facere nam ut dolorem nihil iusto illum voluptatem quod praesentium optio!",
            price,
            geometry :{
              type: "Point",
              coordinates : [
                cities[random1000].longitude,
                cities[random1000].latitude
              ]
            },
            images:   [
                {
                  url: 'https://res.cloudinary.com/camp-monk/image/upload/v1623146242/CampMonk/depnogdi3gqo8sz15cbj.jpg',
                  filename: 'CampMonk/depnogdi3gqo8sz15cbj'
                },
                {
                  url: 'https://res.cloudinary.com/camp-monk/image/upload/v1623146242/CampMonk/neimk0rzkgnifwjjzbqx.jpg',
                  filename: 'CampMonk/neimk0rzkgnifwjjzbqx'
                },
                {
                  url: 'https://res.cloudinary.com/camp-monk/image/upload/v1623146243/CampMonk/gu8x3sqmbbwpbh69fznt.jpg',
                  filename: 'CampMonk/gu8x3sqmbbwpbh69fznt'
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});
