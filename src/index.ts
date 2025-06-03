import server  from './server';
import colors from 'colors';


const port= process.env.PORT || 4000
 

server.listen(port, ()=>{
    console.log(colors.cyan.bold("Rest api server listening on port 4000"));

})

//wT_452CTgiGtire
//mongodb+srv://root:<password>@cluster0.gnzkead.mongodb.net/