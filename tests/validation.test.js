const {imap} = require('../src/connections/imap_connection');

// test('failed module', ()=>{
//     const total = 13;

//     if(total==13){
//         throw new Error('error');
//     }
// })

test('Gmail success', async ()=>{
    await imap.once("ready", () => {
    });
    await imap.once("error", (err) => {
        console.log(err)
        if(err){
            throw new Error('error');
        }
    });
})