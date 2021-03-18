const Category = require('../Model/Category')

exports.postCategory = (req,res) =>{

        let category = new Category(req.body)
        category.save()
        .then(result=>{
            res.json({result})
        })
        .catch(err=>{
            console.log(err);
        })
            

}