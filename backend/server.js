const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect('mongodb://localhost:27017/Contact')
   .then(() => console.log("connection successfully"))
   .catch((err)=>console.log(err));


const userSchema = new mongoose.Schema(
    {
        ContactName : {type:String , unique : true , required : true},
        ContactNo : {type:String , unique : true , required : true}
    }
);

const contactmanage = mongoose.model('contactmanage' , userSchema , 'manage');


app.get('/users' , async(req , res) => {
    const users = await contactmanage.find();
    res.json(users);
});

app.post('/users' , async(req , res) => {
    const {ContactName , ContactNo } = req.body;
    const newUser = new contactmanage({ContactName , ContactNo});
    await newUser.save();
    res.json(newUser);
});

app.delete('/users/:id' , async (req , res) => {
    try{
        await contactmanage.findByIdAndDelete(req.params.id);
        console.log('contact deleted successfully');
        res.json({ message: 'Contact deleted successfully' });
    }
    catch(err){
        console.log(err);  
        res.status(500).json({ error: err.message }); 
    }
});

app.put('/users/:id' , async (req , res) => {
    try{
        const {ContactName , ContactNo} = req.body;

        const updateContact = await contactmanage.findByIdAndUpdate(
            req.params.id,
            {ContactName , ContactNo},
            {new : true}
        );
         
        if(!updateContact){
            return res.status(404).json({message:'contact not found'});
        }
        res.json(updateContact);
    }
    catch(error){
        console.error(error);
    }
})

const PORT = 3001 ;
app.listen(PORT , () => {
    console.log(`server running on http://localhost:${PORT}`);
});
