const express = require('express')
const app = express()
const axios   = require('axios'); 
const crypto  = require('crypto');
const fs = require('fs');
const request = require('request');
const http = require('http');
    
let url       = 'https://coderbyte.com/api/challenges/json/age-counting';
let urlOutPut = "./files/output.txt"; 
let keys      = ''; 

 
async function DataNode () {

    function sha_1(data){
      return crypto.createHash('sha1').update(data,"binary").digest("hex");
    }
  
    function isNum(val){
      return !isNaN(val)
    }

    function fsWrite( data){ 
        fs.writeFile(urlOutPut, data, function(err){
            //console.log(data)
        })
    }

    function outPut(){ 
        http.get(
            urlOutPut
            , res => { 
                res.pipe(
                    fs.createWriteFileStream('output.txt'))
                .on('finish');
        });          
    }
    
    function fsDelete(){
        try {
          fs.unlinkSync(urlOutPut) 
        } catch(err) {
            console.error(err)
        }
    }
    
    let registros;
    var contador   = 0;
    
    keys = axios.get(url)
      .then(resp => {
      
        registros = resp.data;  
        fsDelete();
        var arr        = registros.data.split(',');
        var arrSpread  = [...arr]; 
        var contador2  = 0;
        let writeData  = "[";

        for(let i = 0; i < arrSpread.length; i++){
          
        
          var data = arrSpread[i]
          var equal = data.split('=');
          var alias = equal[0];
          var valor = equal[1]; 
  
  
            if(isNum(valor) == true){ 
                
                let numero = parseInt(valor);
                if(numero == 32 ){  
                contador = contador + 1;
                }
  
            }else if(isNum(valor) == false){

                keys[contador2] = {
                    'key':valor
                } 
                writeData += "{ 'key':"+ valor +"},";
                fsWrite(writeData); 
                contador2 = contador2 + 1;
            
            }// en if
   
        }/// END FOR
        
        writeData += "]"; 
              
        keys = writeData;
        
        var sha1 = sha_1('FernandoAlarcon'); 
        console.log(sha1);
        console.log( `${contador} <- es la cantidad de personas con 32 años `);
        
        outPut();

      }).catch( err => {
        console.log(err);
      }); 
      
    return keys;  
    
}
  
 
const port = 3000
 
    app.get('/', (req, res) => {
        res.send({keys});
    }) 

    http.createServer( res => {
        var writeStream = fs.createWriteStream(urlOutPut);

        // This pipes the POST data to the file
        req.pipe(writeStream);
    })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})