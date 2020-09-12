const router = require('express').Router();
const auth = require('../middleware/auth');
const DinnerPlan = require('../models/dinnerModel');

//check whether selected dates have already been saved
router.post("/dateCheck", async(req,res)=>{
    try{
        const { dates, id } = req.body;
        console.log(dates, id)
        const look = await DinnerPlan.findOne({dates:dates, UserID:id});
        if(look){res.status(400).json({msg: "Mealplan already exists. Enter in different dates."});
} else {res.json({msg:'ok'})}
    }
    catch(err){
        res.status(500).json({ error: err.message })
    }
})

//archive dinner plan
router.post('/archive', async (req, res)=>{
  
    try{
        const { dates, dinnerPlan, UserID } = req.body;
const newDinnerPlan = new DinnerPlan({
dates,
dinnerPlan,
UserID,
        });

const savedDinnerPlan = await newDinnerPlan.save();
res.json(savedDinnerPlan);
    }
    catch(err){
        res.status(500).json({ error: err.message })
    }
});

//retrive list of dinner dates
router.get('/lists', async (req, res)=>{
    try{
    const id = req.header("UserID");
    const dates = await DinnerPlan.find({UserID:id}, { dates:1 })
res.json({
    datesDinner: dates 
})} catch(err){console.log(err)}
})

//retrive archived dinner plan by date

router.get('/list/:name', async (req,res)=>{
    try{
        const userId = req.header("UserID");
        console.log(userId, 'userid')
    const dinnerDate = req.params.name;
    console.log(dinnerDate)
    const plan = await DinnerPlan.findOne({dates:dinnerDate, UserID:userId}, { dinnerPlan:1 })
        console.log(plan, " the return");
    res.json({
        dinnerPlan: plan
    })
    } catch(err){console.log(err)}
})

//edit button
router.get('/edit/:name', async (req,res)=>{
    try{
        const userId = req.header("UserID");
        const index = req.header('id')
    const dinnerDate = req.params.name;
    const dinners = await DinnerPlan.findOne({dates:dinnerDate, UserID:userId
    })
   
   let notes= dinners.dinnerPlan[index].notes;
    res.json({
    notes: notes
    })
    
    } catch(err){console.log(err)}
})
//edit notes
router.post('/editNote/:name', async (req,res)=>{
    try{
        const dinnerDate = req.params.name;
        const { text, id, arrayIndex } = req.body;
        console.log( text, id, arrayIndex)
        const notesUpdate = await DinnerPlan.findOneAndUpdate({dates:dinnerDate, UserID:id
        }, {
            $set : 
      { [`dinnerPlan.${arrayIndex}.notes`]:  text }
   });
   const notesUpdated = await DinnerPlan.findOne({dates:dinnerDate, UserID:id
   });
   let note= notesUpdated.dinnerPlan[arrayIndex].notes;
    res.json({
    notes: note
    })
    } catch(err){console.log(err)}
})

//delete dinnerPlan
router.delete("/lists/delete", async (req, res)=>{
    //need to include middleware, function that will run before
    //delete function to validate before deleting
    try{
        const{id, dates} = req.body;
        console.log(id, dates)
   const deletedPlan =  await DinnerPlan.deleteOne({dates: dates, UserID: id});
   res.send(console.log("deleted"));
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});
module.exports=router;