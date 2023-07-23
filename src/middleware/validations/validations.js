const validator = (schema)=>{
    return (req,res,next)=>{
        try {
            const {error} = schema.validate(req.body);
            console.log(error)
            if(error){
            res.send(error)
            }
            else{
                next()
                console.log("rin")
            }
        } catch (error) {
            console.log(error)
        }
    }
}
module.exports = validator;