const {exec} = require('child_process');
const fs = require('fs/promises');

exec('git clone https://github.com/weatherapicom/weatherapi-Node-js.git && cd weatherapi-Node-js && git checkout CodeGen-NODE && npm i',async (error,stdout,stderr) => {
    if(error){
        console.log(stderr);
        return;
    }
    console.log(stdout);
    try{
        await fs.rmdir('weatherapi-Node-js/.git',{recursive:true});
    }catch(err){
        console.log(err);
    }
})