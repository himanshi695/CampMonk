//Middleware use when call rejected
module.exports = func =>{
    return (req,res,next) =>{
        func(req,res,next).catch(next);
    }
}