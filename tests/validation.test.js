const {imap} = require('../src/connections/imap_connection');

// test('failed module', ()=>{
//     const total = 13;

//     if(total==13){
//         throw new Error('error');
//     }
// })

test('Gmail success', ()=>{
    if(!imap){
        throw new Error('gmail api not accessable!');
    }
})