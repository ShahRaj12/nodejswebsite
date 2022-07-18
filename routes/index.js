var express = require('express');
var router = express.Router();
var mysql= require('mysql');


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'admin'
});
 
connection.connect(function(err){
  if(!err)
  {
    console.log("database connection is done")
  }
  else
  {
    console.log("database connection is not done")
  }
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/adminform', function(req, res, next) {
  res.render('Admin-form');
});

router.post('/adminform',function(req,res){
  console.log(req.body);
  const mybodydata={
    admin_name:req.body.admin_name,
    admin_email:req.body.admin_email,
    admin_password:req.body.admin_password
  }
  connection.query("insert into tbl_admin set ?",mybodydata,function(err,result){
    if(err) throw err;
    res.redirect('/adminform')
    // res.write(JSON.stringify(result))
    // res.end()
    
  })
  })

router.get('/adminshow',function(req,res,next){
  connection.query("select * from tbl_admin",function(err,db_rows){
    if(err) throw err;
    console.log(db_rows)
    res.render('Admin-show',{db_rows_array:db_rows})
  })
  })

router.get('/deleteadmin/:id',function(req,res){
    var deleteid = req.params.id;
    console.log("Delete id is " + deleteid);
    connection.query("delete from tbl_admin where admin_id = ?",
    [deleteid],function(err,db_rows)
    {
      if(err) throw err;
      console.log(db_rows)
      console.log("Record Deleted")
      res.redirect('/adminshow');
    })
  })  

  router.get('/showadmin/:id',function(req,res){
    var showid=req.params.id;
    console.log("Show id is " +showid)
  
    connection.query("select * from tbl_admin where admin_id= ?",[showid],
    function(err,db_rows)
    {
      console.log(db_rows);
      if(err) throw err;
      res.render("Admin-table",{db_rows_array:db_rows});
    })
  })   

router.get('/editadmin/:id',function(req,res){
    console.log("Edit id is :",req.params.id)
    var user_id=req.params.id;
    connection.query("select * from tbl_admin where admin_id = ?",[user_id],function(err,db_rows){
      if(err) throw err;
      console.log(db_rows)
      res.render('Admin-update',{db_rows_array:db_rows});
      
    })
  });

  router.post('/editadmin/:id', function(req,res){
    console.log("Edit id is ",+req.params.id);
  
    var admin_id=req.params.id;
    
    var admin_name=req.body.admin_name;
    var admin_email=req.body.admin_email;
    var admin_password=req.body.admin_password;
    
    connection.query("update tbl_admin set admin_name=?,admin_email =?,admin_password=? where admin_id=?",
    [admin_name,admin_email,admin_password,admin_id],function(err,respond){
      if(err) throw err;
      res.redirect('/adminshow');
    });
  });

router.get('/categoryform', function(req, res, next) {
  res.render('Category-form');
});

router.post('/categoryform',function(req,res){
  console.log(req.body);
  const mybodydata={
   category_name:req.body.category_name
  }
  connection.query("insert into tbl_category set ?",mybodydata,function(err,result){
    if(err) throw err;
    res.redirect('/categoryform')
  })
  })

  router.get('/categoryshow',function(req,res,next){
    connection.query("select * from tbl_category",function(err,db_rows){
      if(err) throw err;
      console.log(db_rows)
      res.render('Category-show',{db_rows_array:db_rows})
    })
    })

  router.get('/deletecategory/:id',function(req,res){
      var deleteid = req.params.id;
      console.log("Delete id is " + deleteid);
      connection.query("delete from tbl_category where category_id = ?",
      [deleteid],function(err,db_rows)
      {
        if(err) throw err;
        console.log(db_rows)
        console.log("Record Deleted")
        res.redirect('/categoryshow');
      })
    })  

router.get('/showcategory/:id',function(req,res){
      var showid=req.params.id;
      console.log("Show id is " +showid)
    
      connection.query("select * from tbl_category where category_id= ?",[showid],
      function(err,db_rows)
      {
        console.log(db_rows);
        if(err) throw err;
        res.render("Category-table",{db_rows_array:db_rows});
      })
    })     
  
router.get('/editcategory/:id',function(req,res){
      console.log("Edit id is :",req.params.id)
      var user_id=req.params.id;
      connection.query("select * from tbl_category where category_id = ?",[user_id],function(err,db_rows){
        if(err) throw err;
        console.log(db_rows)
        res.render('category-update',{db_rows_array:db_rows});
        
      })
    });
  
router.post('/editcategory/:id', function(req,res){
      console.log("Edit id is ",+req.params.id);
    
      var category_id=req.params.id;
      var category_name=req.body.category_name;
      
      connection.query("update tbl_category set category_name= ? where category_id=?",
      [category_name,category_id],function(err,respond){
        if(err) throw err;
        res.redirect('/categoryshow');
      });
    });
  
router.get('/productform', function(req, res, next) {
  res.render('Product-form');
});

router.post('/productform',function(req,res){
  console.log(req.body);
  const fileobj = req.files.image;
  const filename = req.files.image.name;
  const mybodydata={
    product_name:req.body.product_name,
    product_price:req.body.product_price,
    product_details:req.body.product_details,
    product_image:req.files.image.name,
    category_id:req.body.category_id
  }
  connection.query("insert into tbl_product set ?",[mybodydata],function(err){
    if(err) throw err;
    fileobj.mv('public/images/' +filename,function(err){
      res.redirect('/productform')
    });
  })
  })

  
router.get('/productshow', function(req, res, next) {
  connection.query("select * from tbl_product",function(err,db_rows){
    if(err) throw err;
    console.log(db_rows)
    res.render('Product-show',{db_rows_array:db_rows})
  })
});

router.get('/deleteproduct/:id',function(req,res){
  var deleteid = req.params.id;
  console.log("Delete id is " + deleteid);
  connection.query("delete from tbl_product where product_id = ?",
  [deleteid],function(err,db_rows)
  {
    if(err) throw err;
    console.log(db_rows)
    console.log("Record Deleted")
    res.redirect('/productshow');
  })
})  

router.get('/showproduct/:id',function(req,res){
  var showid=req.params.id;
  console.log("Show id is " +showid)

  connection.query("select * from tbl_product where product_id= ?",[showid],
  function(err,db_rows)
  {
    console.log(db_rows);
    if(err) throw err;
    res.render("Product-table",{db_rows_array:db_rows});
    // res.write(JSON.stringify(db_rows))
    // res.end()
  })
})     


router.get('/editproduct/:id',function(req,res){
  console.log("Edit id is :",req.params.id)
  var user_id=req.params.id;
  connection.query("select * from tbl_product where product_id = ?",[user_id],function(err,db_rows){
    if(err) throw err;
    console.log(db_rows)
    res.render('product-update',{db_rows_array:db_rows});
    
  })
});

router.post('/editproduct/:id',function(req,res){
  console.log(req.body);
  const fileobj = req.files.image;
  const filename = req.files.image.name;
  var product_id=req.params.id
  var product_name=req.body.product_name
  var product_price=req.body.product_price
  var product_details=req.body.product_details
  var product_image=req.files.image.name
  var category_id=req.body.category_id

  connection.query("update tbl_product set  product_name = ? , product_price = ? , product_details = ? , product_image = ? , category_id = ? where product_id = ?", [product_name, product_price, product_details, product_image, category_id, product_id],function(err){
    if(err) throw err;
    fileobj.mv('public/images/' +filename,function(err){
      res.redirect('/productshow')
    });
  })
})

router.get('/userform', function(req, res, next) {
  res.render('User-form');
});

router.get('/usertable', function(req, res, next) {
  res.render('User-table');
});

router.get('/usershow', function(req, res, next) {
  res.render('User-show');
});

router.get('/userupdate', function(req, res, next) {
  res.render('user-update');
});



module.exports = router;
