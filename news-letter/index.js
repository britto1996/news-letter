const express = require('express')
const app = express()
const port = 5000
let bodyParser = require('body-parser')

const https = require('https')
const { request } = require('http')



app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended:true}))

app.post('/failure',(req,res)=>{
    res.redirect('/')
})



app.post('/',(req,res)=>{
    const firstName = req.body.firstname
    const lastName = req.body.lastname
    const email = req.body.email
    // console.log(firstName)

    let data = {
        'members':[{
            'email_address':email,
            'status':'subscribed',
        'merge_fields':{
            'FNAME':firstName,
            'LNAME':lastName
        }
    }
        ]}

    const jsonData = JSON.stringify(data)
        

    let mailChimpInstance = 'us7'
    let listUniqueId = 'e702cd0d04'
    let url = `https://${mailChimpInstance}.api.mailchimp.com/3.0/lists/${listUniqueId}`
    
    let methods = {
        'method':'post',
        'auth': `btm:98d66a02e988a380ed060a1073f71b67-us7`
    }
    const requestData = https.request(url,methods,(responce)=>{
        
        if(responce.statusCode == 200){
             res.sendFile(__dirname+'/success.html')
        }else if(responce.statusCode == 401){
            res.sendFile(__dirname+'/failure.html')
        }
        res.on('data',(data)=>{
            console.log(JSON.parse(data))
        })
    })
    requestData.write(jsonData)
    requestData.end()

})





app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/signup.html')
})


app.listen(process.env.PORT || port,()=>{
    console.log(`server is running on the port ${port}`)
})