function authrole(permittedrole){
    return (req,res,next)=>{
       if( permittedrole.includes(req.role)){
        next()
       }else{
        res.send({msg:"Unauthorised"})
       }
    }
}

module.exports={authrole}