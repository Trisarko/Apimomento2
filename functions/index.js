const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const app = express();
//midlewards
app.use(cors);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

app.post('/createuser', async (req, res) => {
    try {
        await db.collection('users').add({
            name: req.body.name,
            lastname: req.body.lastname,
            identification: req.body.identification,
            birthdate: req.body.birthdate,
            city: req.body.city,
            neighborhood: req.body.neighborhood,
            phone: req.body.phone
        });
        res.json({ response: "User Created Successfully" });
    } catch (error) {
        res.json({ response: error });
    }
});


app.get('/listusers', async (req, res) => {
    try {
        let users = [];
        let allUsers = await db.collection('users').get();
        for (const doc of allUsers.docs) {
            let userToadd = {
                id: doc.id,
                name: doc.data().name,
                lastname: doc.data().lastname,
                identification: doc.data().identification,
                birthdate: doc.data().birthdate,
                city: doc.data().city,
                neighborhood: doc.data().neighborhood,
                phone: doc.data().phone
            }
            users.push(userToadd);
        }
        res.json({users: users});
    } catch (error) {
        res.json({ response: error });
    }
})

app.put('/updateuser', async (req, res) =>{
    try{
        const {id, name, lastname, identification, birthdate, city, neighborhood, phone} = req.body;
        let user = await db.collection('users').doc(id).set({
            name: name,
            lastname: lastname,
            identification: identification,
            birthdate: birthdate,
            city: city,
            neighborhood: neighborhood,
            phone: phone
        });
        res.json({ response: "User Updated Successfully" });
    }catch(error){
        res.json({ response: error });
    }
})
 app.delete('/userdelete', async (req, res) =>{
     try{
         const id = req.body.id;
        let deleteUser = await db.collection('users').doc(id).delete();
        res.json({response: "User deleted successfully"})
     }catch(error){
        res.json({ response: error });
     }
 })

exports.api = functions.https.onRequest(app);
