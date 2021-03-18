class APIFeatures{
    constructor(query,queryStr){
    this.query = query,
    this.queryStr = queryStr;
    }

    search(){
        const keyword=this.queryStr.keyword?{
            product_name:{
                $regex:this.queryStr.keyword,
                $options:'i'   //case insensitive
            }
        } :{}

        this.query = this.query.find({...keyword});
        return this;
    }
}

module.exports=APIFeatures