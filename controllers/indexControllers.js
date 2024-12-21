const connection = require("../config/db");

class IndexControllers{

  showHome = (req,res)=>{
    let sql = 'SELECT * FROM user WHERE user_is_deleted = 0';
    connection.query(sql, (err,result)=>{
      if(err){
        throw err;
      }else{
        res.render('index', {result})
      }
    });
  }

}

module.exports = new IndexControllers();