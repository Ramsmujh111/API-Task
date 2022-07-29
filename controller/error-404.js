
exports.error_404 = (req,res,nex)=>{
    res.status(404).json({
        status:404,
        message:'Page not found',
    })
}